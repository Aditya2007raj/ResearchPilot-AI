import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List

from ..services.rag_engine import RAGEngine
from ..security.dependencies import get_current_user, verify_paper_ownership
from ..db.metadata_store import add_chat_message, get_chat_history_for_paper

router = APIRouter()


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    question: str


@router.get("/chat/{file_id}/history")
async def get_chat_history(
    file_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieve chat history for a paper owned by the current user."""
    await verify_paper_ownership(file_id, current_user)
    user_id = current_user["id"]
    history = get_chat_history_for_paper(user_id=user_id, paper_id=file_id)
    return {
        "success": True,
        "data": history
    }


@router.post("/chat/{file_id}")
async def chat(
    file_id: str,
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """Answer a question about an uploaded PDF using user-isolated RAG."""
    await verify_paper_ownership(file_id, current_user)
    user_id = current_user["id"]
    
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Save user question to chat history
        user_msg_id = str(uuid.uuid4())
        add_chat_message(
            message_id=user_msg_id,
            user_id=user_id,
            paper_id=file_id,
            role="user",
            message=request.question.strip()
        )
        
        # Initialize RAG engine
        rag_engine = RAGEngine()
        
        # Generate answer using user-isolated collection
        result = rag_engine.answer_question(
            user_id=user_id,
            file_id=file_id,
            question=request.question.strip()
        )
        
        # Save assistant response to chat history
        asst_msg_id = str(uuid.uuid4())
        add_chat_message(
            message_id=asst_msg_id,
            user_id=user_id,
            paper_id=file_id,
            role="assistant",
            message=result["answer"]
        )
        
        return {
            "success": True,
            "data": {
                "file_id": file_id,
                "question": request.question,
                "answer": result["answer"],
                "confidence": result["confidence"],
                "sources": result["sources"]
            }
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
