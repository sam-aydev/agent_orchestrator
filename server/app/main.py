from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.webhooks import router as webhook_router

app = FastAPI(title="Micro SAAS Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook_router, prefix="/api/v1/webhooks", tags=["Webhooks"])

@app.get("/")
async def health_check():
    return {"status": "healthy"}