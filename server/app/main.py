from fastapi import FastAPI
from app.api.webhooks import router as webhook_router

app = FastAPI(title="Micro SAAS Orchestrator")

app.include_router(webhook_router, prefix="/api/v1/webhooks", tags=["Webhooks"])

@app.get("/")
async def health_check():
    return {"status": "healthy"}