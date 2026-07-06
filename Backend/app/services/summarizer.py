import json
from .gemini_client import GeminiClient


class Summarizer:
    """Service for generating structured summaries of research papers."""
    
    def __init__(self):
        """Initialize summarizer with Gemini client."""
        self.client = GeminiClient()
    
    def generate_summary(self, text: str) -> dict:
        """
        Generate a structured summary from research paper text.
        
        Args:
            text: Extracted text from PDF
            
        Returns:
            Dictionary with structured summary containing:
                - problem: Research problem statement
                - method: Methodology used
                - results: Key results
                - limitations: Study limitations
                - future_work: Future research directions
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        prompt = self._build_summary_prompt(text)
        response = self.client.generate_content(prompt)
        
        # Parse JSON response
        try:
            summary = json.loads(response)
            return summary
        except json.JSONDecodeError:
            # Fallback: return as plain text if JSON parsing fails
            return {
                "problem": "Could not parse structured summary",
                "method": "",
                "results": response,
                "limitations": "",
                "future_work": ""
            }
    
    def _build_summary_prompt(self, text: str) -> str:
        """
        Build prompt for summary generation.
        
        Args:
            text: Research paper text
            
        Returns:
            Formatted prompt for Gemini
        """
        prompt = f"""Analyze the following research paper and provide a structured summary in JSON format with these exact keys:
- problem: What problem does this research address?
- method: What methodology or approach is used?
- results: What are the key findings or results?
- limitations: What are the limitations of this study?
- future_work: What future work is suggested?

Respond ONLY with valid JSON, no additional text.

Research Paper Text:
{text[:15000]}"""
        
        return prompt
