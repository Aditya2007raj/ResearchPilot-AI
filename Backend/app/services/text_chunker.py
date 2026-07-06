import re
from typing import List


class TextChunker:
    """Service for chunking text into smaller segments for processing."""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        """
        Initialize text chunker with chunk size and overlap.
        
        Args:
            chunk_size: Maximum characters per chunk
            chunk_overlap: Number of characters to overlap between chunks
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def chunk_text(self, text: str) -> List[str]:
        """
        Split text into chunks with overlap, preserving sentence boundaries.
        
        Args:
            text: Input text to chunk
            
        Returns:
            List of text chunks
        """
        if not text or not text.strip():
            return []
        
        text = text.strip()
        
        # If text is smaller than chunk size, return as single chunk
        if len(text) <= self.chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            # Calculate end position
            end = start + self.chunk_size
            
            # If this is the last chunk, take remaining text
            if end >= len(text):
                chunks.append(text[start:])
                break
            
            # Try to find a sentence boundary near the end position
            chunk_end = self._find_sentence_boundary(text, start, end)
            
            # Extract chunk
            chunk = text[start:chunk_end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start position with overlap
            start = chunk_end - self.chunk_overlap
            
            # Ensure we make progress
            if start <= 0:
                start = chunk_end
        
        return chunks
    
    def _find_sentence_boundary(self, text: str, start: int, end: int) -> int:
        """
        Find the best sentence boundary within the chunk range.
        
        Args:
            text: Full text
            start: Chunk start position
            end: Chunk end position
            
        Returns:
            Position of sentence boundary
        """
        # Look for sentence endings (., !, ?) followed by space or end
        # Search backwards from end position
        search_range = text[start:end]
        
        # Pattern for sentence boundaries
        pattern = r'[.!?]\s+'
        
        # Find all matches in reverse order
        matches = list(re.finditer(pattern, search_range))
        
        if matches:
            # Return position of last sentence boundary
            last_match = matches[-1]
            return start + last_match.end()
        
        # If no sentence boundary found, look for paragraph breaks
        paragraph_pattern = r'\n\s*\n'
        paragraph_matches = list(re.finditer(paragraph_pattern, search_range))
        
        if paragraph_matches:
            last_match = paragraph_matches[-1]
            return start + last_match.end()
        
        # Fallback: break at word boundary
        word_pattern = r'\s+'
        word_matches = list(re.finditer(word_pattern, search_range))
        
        if word_matches:
            last_match = word_matches[-1]
            return start + last_match.end()
        
        # Last resort: break at exact chunk size
        return end
