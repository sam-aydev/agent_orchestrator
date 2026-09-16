import logging
import httpx

logger = logging.getLogger(__name__)
HTTP_TIMEOUT = 10.0

async def trigger_discord_alert(webhook_url: str, summary: str, priority: str, intent: str) -> str:
    if not webhook_url: return "skipped_no_url"
    color_map = { "low": 3066993, "medium": 16777215, "high":15158332, "critical": 15158332}

    payload = {
        "embeds": [{
            "title": f"{priority.capitalize()} Priority Workflow Event",
            "description": summary,
            "color": color_map.get(priority.lower(), 16777215),
            "fields": [{"name": "Intent", "value": intent.replace("-", " ").title() }]
        }]
    }

    async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
        try:
            res = await client.post(webhook_url, json=payload)
            res.raise_for_status()
            return "success" # Fixed for frontend exact match
        except httpx.HTTPError as e:
            logger.error(f"Discord network error: {e}")
            status_code = getattr(e, 'response', None)
            code = status_code.status_code if status_code else 'timeout'
            return f"error_network_{code}"

async def log_to_notion(api_key: str, database_id: str, summary: str, priority: str, intent: str, raw_text: str) -> str:
    if not api_key or not database_id: return "skipped_missing_credentials"
    url = "https://api.notion.com/v1/pages"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    payload = {
        "parent": {"database_id": database_id},
        "properties": {
            "Summary": {"title": [{"text": {"content": summary[:255]}}]},
            "Priority": {"select": {"name": priority}},
            "Intent": {"select": {"name": intent}},
            "Raw Payload": {"rich_text": [{"text": {"content": raw_text[:2000]}}]}
        }
    }
    
    async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
        try:
            res = await client.post(url, headers=headers, json=payload)
            res.raise_for_status()
            return "success" # Fixed for frontend exact match
        except httpx.HTTPError as e:
            logger.error(f"Notion network error: {e}")
            status_code = getattr(e, 'response', None)
            code = status_code.status_code if status_code else 'timeout'
            return f"error_network_{code}"