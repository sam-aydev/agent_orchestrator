# 🚀 Agentic Workflow Orchestrator (V1)

An enterprise-grade, full-stack AI workflow orchestration platform that empowers users to visually design, manage, and execute automated multi-step AI agents. The platform features a dynamic React Flow canvas, persistent Supabase state storage, and a robust FastAPI backend driven by Groq LLMs and Pydantic-AI.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
* **Framework:** Next.js 14/15 (App Router)
* **Canvas Engine:** React Flow (`@xyflow/react`) with custom nodes and edge delete buttons
* **Styling & UI:** Tailwind CSS, Framer Motion, Lucide React, Sonner (Toast notifications)

### Backend (`server/`)
* **Framework:** FastAPI (Python) with Uvicorn
* **AI Engine:** Groq LLMs via `pydantic-ai` for strict structured output extraction
* **Database & Auth:** Supabase PostgreSQL (with JSONB workspace state mapping)
* **HTTP Client:** `httpx` (Asynchronous networking for external webhooks and CRM sync)

---

## 🏛️ System Architecture

1. **Trigger Phase:** Incoming webhooks trigger the FastAPI backend via unique secure endpoints (`/api/v1/webhooks/{secret}`).
2. **AI Classification Engine:** Data flows into the Groq AI agent, which categorizes intent, extracts summaries, and assigns operational priorities (`low`, `medium`, `high`, `critical`).
3. **Smart Action Routing:** 
   * **High/Critical Priority:** Automatically routes payloads to **Discord** via rich webhook embeds.
   * **All Executions:** Securely synchronizes structured event data, metadata, and raw logs into **Notion CRM** databases.
4. **Execution Audit Logs:** Every run is recorded in Supabase and displayed in real-time on the frontend execution logs dashboard.

---

## ⚙️ Getting Started & Installation

### Prerequisites
* Node.js (v18+) & npm/pnpm
* Python (v3.10+) & pip
* A Supabase project & a Groq API key

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/orchestrator.git](https://github.com/your-username/orchestrator.git)
cd orchestrator