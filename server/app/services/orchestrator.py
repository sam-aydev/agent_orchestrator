import os
import json
import logging
from supabase import create_async_client # Import this directly here
from app.services.agent import agent
from app.services.actions import trigger_discord_alert, log_to_notion
from app.schemas.ai_models import TicketClassification

logger = logging.getLogger(__name__)

async def process_workflow(workflow_id: str, workflow_config: dict, payload: dict):
    """The async agent that wires the AI engine and API actions together"""

    discord_status = "pending"
    notion_status = "pending"
    classification_data = None

    try:
        raw_text = json.dumps(payload)
        result = await agent.run(raw_text)
        classification: TicketClassification = result.output
        classification_data = classification.model_dump()

        if classification.priority in ["high", "critical"]:
            discord_status = await trigger_discord_alert(
                webhook_url=workflow_config.get("discord_webhook_url"),
                summary=classification.summary,
                priority=classification.priority,
                intent=classification.intent
            )
        else:
            discord_status = "skipped_low_priority"

        notion_status = await log_to_notion(
            api_key=workflow_config.get("notion_api_key"),
            database_id=workflow_config.get("notion_database_id"),
            summary=classification.summary,
            priority=classification.priority,
            intent=classification.intent,
            raw_text=raw_text
        )
    except Exception as e:
        logger.error(f"[{workflow_id}] Workflow Error: {e}")
        discord_status = f"system_error_{str(e)}"
    finally: 
        # Safely instantiate and await the async client INSIDE the background task
        async_supabase = await create_async_client(
            os.getenv("SUPABASE_URL"), 
            os.getenv("SUPABASE_SECRET_KEY")
        )
        
        await async_supabase.table("execution_logs").insert({
            "workflow_id": workflow_id,
            "payload_received": payload,
            "ai_classification": classification_data,
            "discord_status": discord_status,
            "notion_status": notion_status
        }).execute()