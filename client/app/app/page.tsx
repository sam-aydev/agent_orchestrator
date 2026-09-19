import Canvas from "@/components/canvas/CanvasFlow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace Builder - Agentic Orchestrator",
  description:
    "Visual canvas for designing and deploying autonomous AI agents, webhooks, and third-party integrations.",
};
export default function Page() {
  return <Canvas />;
}
