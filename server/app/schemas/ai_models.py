from pydantic import BaseModel, Field
from typing import Literal

class TicketClassification(BaseModel):
    intent: Literal["bug_report", "feature_request", "support_query", "billing", "other"] = Field(
        description="The primary intention of the incoming payload"
    )
    priority: Literal["low", "medium", "high", "critical"] = Field(
        description="The urgency of the payload. Broken systems are denoted as critical"
    )
    summary: str = Field(description="A concise, one-sentemce summary of the text")
    sentiment: Literal["positive", "negative", "neutral"] = Field(description="the emotional tone of the user's message")