import chromadb
from ..config import settings


class ChromaClient:
    """Client for interacting with ChromaDB."""
    
    def __init__(self):
        """Initialize ChromaDB client with persistent storage."""
        try:
            self.client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
            self.collection = self._get_or_create_collection()
        except Exception as e:
            raise Exception(f"Failed to initialize ChromaDB client: {str(e)}")
    
    def _get_or_create_collection(self):
        """
        Get or create the research_papers collection.
        
        Returns:
            ChromaDB collection
        """
        try:
            collection = self.client.get_or_create_collection(
                name=settings.collection_name,
                metadata={"description": "Research papers for RAG"}
            )
            return collection
        except Exception as e:
            raise Exception(f"Failed to get or create collection: {str(e)}")
    
    def get_collection(self):
        """
        Get the ChromaDB collection.
        
        Returns:
            ChromaDB collection
        """
        return self.collection
    
    def add_documents(self, ids: list, documents: list, metadatas: list = None):
        """
        Add documents to the collection.
        
        Args:
            ids: List of document IDs
            documents: List of document texts
            metadatas: Optional list of metadata dictionaries
        """
        try:
            self.collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )
        except Exception as e:
            raise Exception(f"Failed to add documents: {str(e)}")
    
    def query_documents(self, query_texts: list, n_results: int = 5, where: dict = None):
        """
        Query documents from the collection.
        
        Args:
            query_texts: List of query texts
            n_results: Number of results to return
            where: Optional metadata filter
            
        Returns:
            Query results
        """
        try:
            results = self.collection.query(
                query_texts=query_texts,
                n_results=n_results,
                where=where
            )
            return results
        except Exception as e:
            raise Exception(f"Failed to query documents: {str(e)}")
    
    def delete_documents(self, ids: list):
        """
        Delete documents from the collection.
        
        Args:
            ids: List of document IDs to delete
        """
        try:
            self.collection.delete(ids=ids)
        except Exception as e:
            raise Exception(f"Failed to delete documents: {str(e)}")
