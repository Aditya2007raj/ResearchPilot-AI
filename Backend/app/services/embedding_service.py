from sentence_transformers import SentenceTransformer


class EmbeddingService:
    """Service for generating embeddings using sentence-transformers."""
    
    def __init__(self):
        """Initialize embedding service with sentence-transformers model."""
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            raise Exception(f"Failed to load embedding model: {str(e)}")
    
    def generate_embedding(self, text: str) -> list:
        """
        Generate embedding for a single text.
        
        Args:
            text: Input text to embed
            
        Returns:
            List of float values representing the embedding
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        try:
            embedding = self.model.encode(text)
            return embedding.tolist()
        except Exception as e:
            raise Exception(f"Failed to generate embedding: {str(e)}")
    
    def generate_embeddings(self, texts: list) -> list:
        """
        Generate embeddings for multiple texts.
        
        Args:
            texts: List of input texts to embed
            
        Returns:
            List of embeddings, each as a list of float values
        """
        if not texts:
            raise ValueError("Texts list cannot be empty")
        
        for text in texts:
            if not text or not text.strip():
                raise ValueError("Text in list cannot be empty")
        
        try:
            embeddings = self.model.encode(texts)
            return embeddings.tolist()
        except Exception as e:
            raise Exception(f"Failed to generate embeddings: {str(e)}")
