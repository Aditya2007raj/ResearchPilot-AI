from typing import Dict, Any, List
from ..db.vector_store import VectorStore
from .gemini_client import GeminiClient


class RAGEngine:
    """Service for Retrieval-Augmented Generation (RAG) using vector search and LLM."""
    
    def __init__(self):
        """Initialize RAG engine with vector store and Gemini client."""
        try:
            self.vector_store = VectorStore()
            self.gemini_client = GeminiClient()
        except Exception as e:
            raise Exception(f"Failed to initialize RAGEngine: {str(e)}")
    
    def answer_question(self, file_id: str, question: str) -> Dict[str, Any]:
        """
        Answer a question about a document using RAG.
        
        Args:
            file_id: Unique identifier for the document
            question: User's question about the document
            
        Returns:
            Dictionary containing:
                - answer: Generated answer from the LLM
                - confidence: Confidence score (0.0 to 1.0)
                - sources: List of structured source chunks with metadata
                
        Raises:
            ValueError: If inputs are invalid
            Exception: If RAG process fails
        """
        if not file_id or not file_id.strip():
            raise ValueError("file_id cannot be empty")
        
        if not question or not question.strip():
            raise ValueError("question cannot be empty")
        
        try:
            # Retrieve relevant chunks
            relevant_chunks = self.vector_store.search(
                file_id=file_id,
                query=question,
                top_k=5
            )
            
            if not relevant_chunks:
                return {
                    "answer": "No relevant information found in the document.",
                    "confidence": 0.0,
                    "sources": []
                }
            
            # Calculate confidence score from similarity scores
            confidence = self._calculate_confidence(relevant_chunks)
            
            # Build context from retrieved chunks
            context_parts = []
            for i, chunk in enumerate(relevant_chunks):
                context_parts.append(f"[Source {i+1}]: {chunk['text']}")
            
            context = "\n\n".join(context_parts)
            
            # Build prompt
            prompt = self._build_rag_prompt(context, question)
            
            # Generate answer using Gemini
            answer = self.gemini_client.generate_content(prompt)
            
            # Structure sources with preview and metadata
            sources = self._structure_sources(relevant_chunks)
            
            return {
                "answer": answer,
                "confidence": confidence,
                "sources": sources
            }
            
        except ValueError:
            raise
        except Exception as e:
            raise Exception(f"Failed to answer question: {str(e)}")
    
    def _build_rag_prompt(self, context: str, question: str) -> str:
        """
        Build RAG prompt with context and question.
        
        Args:
            context: Retrieved context chunks
            question: User's question
            
        Returns:
            Formatted prompt for Gemini
        """
        prompt = f"""Context from the research paper:
{context}

Question: {question}

Answer the question using only the provided context above. 
If the information is not available in the context, clearly state that the information is not available in the document.
Do not use outside knowledge or make up information.
Provide a clear and concise answer."""
        
        return prompt
    
    def _calculate_confidence(self, chunks: List[Dict[str, Any]]) -> float:
        """
        Calculate confidence score from retrieved chunk similarity scores.
        
        Args:
            chunks: List of retrieved chunks with scores
            
        Returns:
            Confidence score between 0.0 and 1.0
        """
        if not chunks:
            return 0.0
        
        scores = [chunk.get("score", 0.0) for chunk in chunks]
        avg_score = sum(scores) / len(scores) if scores else 0.0
        return round(avg_score, 2)
    
    def _structure_sources(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Structure sources with preview and metadata.
        
        Args:
            chunks: List of retrieved chunks
            
        Returns:
            List of structured source dictionaries
        """
        sources = []
        for chunk in chunks:
            preview = chunk["text"][:200] + "..." if len(chunk["text"]) > 200 else chunk["text"]
            sources.append({
                "chunk_index": chunk.get("chunk_index", 0),
                "preview": preview,
                "score": chunk.get("score", 0.0)
            })
        return sources
