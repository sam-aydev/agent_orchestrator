"use server";

import { createClient } from "@/lib/supabase/server";
import { Node, Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";


export async function getWorkflowById(workflowId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createBlankWorkflow() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("workflows")
    .insert({
      user_id: user.id,
      name: "Untitled Agent",
      nodes: [],
      edges: [],
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, workflowId: data.id };
}

export async function saveWorkflowConfiguration(
  workflowId: string,
  nodes: Node[],
  edges: Edge[],
  name: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Unauthorized: You must be logged in to save workflows.",
    };
  }

  const triggerNode = nodes.find((n) => n.type === "trigger");
  const discordNode = nodes.find((n) => n.data?.actionType === "discord");
  const notionNode = nodes.find((n) => n.data?.actionType === "notion");

  const { error: dbError } = await supabase
    .from("workflows")
    .update({
      name: name,
      nodes: nodes,
      edges: edges,
      endpoint_secret: triggerNode?.data?.endpointSecret || null,
      discord_webhook_url: discordNode?.data?.discordWebhookUrl || null,
      notion_api_key: notionNode?.data?.notionApiKey || null,
      notion_database_id: notionNode?.data?.notionDatabaseId || null,
    })
    .eq("id", workflowId)
    .eq("user_id", user.id);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true };
}



export async function getAllUserWorkflows(page: number = 1, limit: number = 9, searchQuery?: string) {
  const supabase = await createClient(); 
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized access" };
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("workflows")
    .select("id, name, updated_at, created_at", { count: "exact" })
    .eq("user_id", user.id);

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Database fetch error:", error);
    return { success: false, error: error.message };
  }

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return { success: true, data, totalPages, currentPage: page };
}


export async function deleteWorkflow(workflowId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized access" };
  }

  const { error } = await supabase
    .from("workflows")
    .delete()
    .eq("id", workflowId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/app/workflows");
  return { success: true };
}