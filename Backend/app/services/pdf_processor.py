import fitz  # PyMuPDF
from typing import Dict
import os


class PDFProcessor:
    """Service for extracting text from PDF files."""
    
    @staticmethod
    def extract_text(pdf_path: str) -> Dict[str, any]:
        """
        Extract text from PDF file.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Dictionary containing:
                - full_text: Complete text from all pages
                - page_count: Number of pages in PDF
                
        Raises:
            FileNotFoundError: If PDF file doesn't exist
            ValueError: If PDF file is corrupted or unreadable
        """
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        try:
            doc = fitz.open(pdf_path)
            page_count = doc.page_count
            full_text = ""
            
            for page in doc:
                text = page.get_text()
                if text.strip():
                    full_text += text + "\n\n"
            
            doc.close()
            
            # Clean the extracted text
            full_text = PDFProcessor._clean_text(full_text)
            
            return {
                "full_text": full_text,
                "page_count": page_count
            }
            
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Clean extracted text by removing excessive whitespace.
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        # Remove multiple spaces
        text = ' '.join(text.split())
        
        # Remove multiple newlines
        text = '\n'.join(line for line in text.split('\n') if line.strip())
        
        return text.strip()
