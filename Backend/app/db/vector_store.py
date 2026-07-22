from typing import List, Dict, Any
from ..db.chroma_client import ChromaClient
from ..services.embedding_service import EmbeddingService
from ..services.text_chunker import TextChunker


class VectorStore:
    """Service for managing document vectors in user-isolated ChromaDB collections for RAG operations."""
    
    def __init__(self):
        """Initialize vector store with ChromaDB client, embedding service, and text chunker."""
        try:
            self.chroma_client = ChromaClient()
            self.embedding_service = EmbeddingService()
            self.text_chunker = TextChunker()
        except Exception as e:
            raise Exception(f"Failed to initialize VectorStore: {str(e)}")
    
    def add_document(self, user_id: str, file_id: str, text: str) -> None:
        """
        Add a document to the user's vector store collection.
        
        Args:
            user_id: Owner user ID
            file_id: Unique identifier for the file
            text: Full text content of the document
        """
        if not user_id or not user_id.strip():
            raise ValueError("user_id cannot be empty")
            
        if not file_id or not file_id.strip():
            raise ValueError("file_id cannot be empty")
        
        if not text or not text.strip():
            raise ValueError("text cannot be empty")
        
        try:
            # Chunk the text
            chunks = self.text_chunker.chunk_text(text)
            
            if not chunks:
                raise ValueError("No chunks generated from text")
            
            # Generate embeddings for chunks
            embeddings = self.embedding_service.generate_embeddings(chunks)
            
            # Create metadata for each chunk
            metadatas = []
            chunk_ids = []
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"{file_id}_chunk_{i}"
                chunk_ids.append(chunk_id)
                metadatas.append({
                    "file_id": file_id,
                    "user_id": user_id,
                    "chunk_index": i
                })
            
            # Add to ChromaDB user collection
            self.chroma_client.add_documents(
                user_id=user_id,
                ids=chunk_ids,
                documents=chunks,
                metadatas=metadatas,
                embeddings=embeddings
            )
            
        except ValueError:
            raise
        except Exception as e:
            raise Exception(f"Failed to add document: {str(e)}")
    
    def search(self, user_id: str, file_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for relevant chunks within a user's document collection.
        """
        if not user_id or not user_id.strip():
            raise ValueError("user_id cannot be empty")
            
        if not file_id or not file_id.strip():
            raise ValueError("file_id cannot be empty")
        
        if not query or not query.strip():
            raise ValueError("query cannot be empty")
        
        if top_k <= 0:
            raise ValueError("top_k must be greater than 0")
        
        try:
            query_embedding = self.embedding_service.generate_embedding(query)
            
            # Search user collection with file filter
            results = self.chroma_client.query_documents(
                user_id=user_id,
                query_embeddings=[query_embedding],
                n_results=top_k,
                where={"file_id": file_id}
            )
            
            formatted_results = []
            
            if results and 'documents' in results and results['documents']:
                documents = results['documents'][0]
                metadatas = results.get('metadatas', [[]])[0]
                distances = results.get('distances', [[]])[0]
                
                for i, doc in enumerate(documents):
                    distance = distances[i] if i < len(distances) else None
                    similarity_score = 1 / (1 + distance) if distance is not None else 0.0
                    
                    formatted_results.append({
                        "text": doc,
                        "chunk_index": metadatas[i].get("chunk_index", i) if i < len(metadatas) else i,
                        "score": round(similarity_score, 2),
                        "metadata": metadatas[i] if i < len(metadatas) else {}
                    })
            
            return formatted_results
            
        except ValueError:
            raise
        except Exception as e:
            raise Exception(f"Failed to search documents: {str(e)}")
    
    def delete_document(self, user_id: str, file_id: str) -> None:
        """
        Delete all chunks belonging to a document from a user's collection.
        """
        if not user_id or not user_id.strip():
            raise ValueError("user_id cannot be empty")
        if not file_id or not file_id.strip():
            raise ValueError("file_id cannot be empty")
        
        try:
            collection = self.chroma_client.get_user_collection(user_id)
            results = collection.get(where={"file_id": file_id})
            
            if results and results['ids']:
                self.chroma_client.delete_documents(user_id=user_id, ids=results['ids'])
            
        except ValueError:
            raise
        except Exception as e:
            raise Exception(f"Failed to delete document: {str(e)}")
