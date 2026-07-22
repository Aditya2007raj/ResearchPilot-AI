import chromadb
import re
from ..config import settings


class ChromaClient:
    """Client for interacting with user-isolated ChromaDB collections."""
    
    def __init__(self):
        """Initialize ChromaDB client with persistent storage."""
        try:
            self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        except Exception as e:
            raise Exception(f"Failed to initialize ChromaDB client: {str(e)}")
    
    def _sanitize_collection_name(self, user_id: str) -> str:
        """Sanitize user_id to form a valid ChromaDB collection name."""
        clean_id = re.sub(r'[^a-zA-Z0-9_-]', '', user_id)
        collection_name = f"user_{clean_id}"
        # Ensure length is within limits (3 to 63 chars)
        return collection_name[:63]

    def get_user_collection(self, user_id: str):
        """
        Get or create a dedicated ChromaDB collection for a specific user.
        
        Args:
            user_id: Unique identifier for the user
            
        Returns:
            ChromaDB collection for the user
        """
        try:
            name = self._sanitize_collection_name(user_id)
            collection = self.client.get_or_create_collection(
                name=name,
                metadata={"user_id": user_id, "description": "User isolated research paper vector storage"}
            )
            return collection
        except Exception as e:
            raise Exception(f"Failed to get or create user collection: {str(e)}")

    def add_documents(self, user_id: str, ids: list, documents: list, metadatas: list = None, embeddings: list = None):
        """Add documents to a user's isolated collection."""
        try:
            collection = self.get_user_collection(user_id)
            collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings
            )
        except Exception as e:
            raise Exception(f"Failed to add documents to user collection: {str(e)}")

    def query_documents(self, user_id: str, query_texts: list = None, query_embeddings: list = None, n_results: int = 5, where: dict = None):
        """Query documents exclusively from a user's isolated collection."""
        try:
            collection = self.get_user_collection(user_id)
            results = collection.query(
                query_texts=query_texts,
                query_embeddings=query_embeddings,
                n_results=n_results,
                where=where,
                include=["documents", "metadatas", "distances"]
            )
            return results
        except Exception as e:
            raise Exception(f"Failed to query user collection: {str(e)}")

    def delete_documents(self, user_id: str, ids: list):
        """Delete documents from a user's isolated collection."""
        try:
            collection = self.get_user_collection(user_id)
            collection.delete(ids=ids)
        except Exception as e:
            raise Exception(f"Failed to delete documents from user collection: {str(e)}")
