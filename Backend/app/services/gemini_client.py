import google.generativeai as genai
from ..config import settings


class GeminiClient:
    """Client for interacting with Google Gemini API."""
    
    def __init__(self):
        """Initialize Gemini client with API key from settings."""
        self.api_key = settings.gemini_api_key
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not set in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_content(self, prompt: str) -> str:
        """
        Generate content using Gemini API.
        
        Args:
            prompt: Input prompt for generation
            
        Returns:
            Generated text response
            
        Raises:
            ValueError: If prompt is empty or API key is missing
            Exception: If API call fails
        """
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty")
        
        try:
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                raise ValueError("Empty response from Gemini API")
            
            return response.text
            
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
