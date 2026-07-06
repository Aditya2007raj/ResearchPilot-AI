from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from ..services.rag_engine import RAGEngine

router = APIRouter()


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    question: str


@router.post("/chat/{file_id}")
async def chat(file_id: str, request: ChatRequest):
    """
    Answer a question about an uploaded PDF using RAG.
    
    Args:
        file_id: UUID of the uploaded file
        request: Chat request containing the question
        
    Returns:
        Response with answer, confidence, and structured sources
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Initialize RAG engine
        rag_engine = RAGEngine()
        
        # Generate answer
        result = rag_engine.answer_question(file_id, request.question)
        
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
