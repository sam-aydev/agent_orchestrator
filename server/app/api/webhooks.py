from fastapi import APIRouter, BackgroundTasks, HTTPException, Body
from app.core.config import supabase
from app.services.orchestrator import process_workflow

router = APIRouter()

# Add payload: dict = Body(...) so Swagger UI generates the input box
@router.post("/{endpoint_secret}")
async def receive_webhook(
    endpoint_secret: str, 
    background_tasks: BackgroundTasks,
    payload: dict = Body(...)
):
    # Secure lookup using the secret, not the ID
    res = supabase.table("workflows").select("*").eq("endpoint_secret", endpoint_secret).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Not Found")
        
    workflow_config = res.data[0]
    internal_workflow_id = workflow_config["id"]
    
    # Pass the payload dictionary directly to the orchestrator
    background_tasks.add_task(process_workflow, internal_workflow_id, workflow_config, payload)
    
    return {"status": "accepted"}