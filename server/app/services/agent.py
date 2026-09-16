from pydantic_ai import Agent
from app.schemas.ai_models import TicketClassification

agent = Agent(
    'groq:openai/gpt-oss-20b',
    output_type=TicketClassification, 
    system_prompt=(
        "You are a strict data classifier. Analyze the incoming webhook JSON, "
        "extract the requested fields, and output ONLY valid JSON matching the schema. "
        "Never include conversational text."
    )
)