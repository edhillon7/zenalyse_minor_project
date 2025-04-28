from fastapi import APIRouter, Depends, HTTPException
from app.models.request import ChatRequest
from app.services.auth import get_current_user
from app.services.chat_service import ChatService
import logging

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/chat")
async def chat(request: ChatRequest, user=Depends(get_current_user)):
    try:
        logger.info(f"Processing chat request for user: {user['id']}")
        chat_service = ChatService(user_id=user["id"])
        response = await chat_service.process_message(request.message)
        return {"response": response, "status": "success", "user_id": user["id"]}
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return {"response": f"Error processing message: {str(e)}", "status": "error"}