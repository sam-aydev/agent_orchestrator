"use server";

import { createClient } from "@/lib/supabase/server";
import { Node, Edge } from "@xyflow/react";

export async function getWorkflowById(workflowId: string) {
  const supabase = await createClient();

  // 1. Enforce Authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Fetch the specific workflow
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

  // Extract optional credentials from nodes if needed for webhook processing later
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
