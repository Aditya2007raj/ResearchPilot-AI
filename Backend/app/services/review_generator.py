import json
from .gemini_client import GeminiClient


class ReviewGenerator:
    """Service for generating structured research reviews."""
    
    def __init__(self):
        """Initialize review generator with Gemini client."""
        self.client = GeminiClient()
    
    def generate_review(self, text: str) -> dict:
        """
        Generate a structured review from research paper text.
        
        Args:
            text: Extracted text from PDF
            
        Returns:
            Dictionary with structured review containing:
                - key_contributions: Main contributions of the research
                - strengths: Strengths of the study
                - weaknesses: Weaknesses or limitations
                - applications: Practical applications
                - research_gaps: Gaps for future research
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        prompt = self._build_review_prompt(text)
        response = self.client.generate_content(prompt)
        
        # Parse JSON response
        try:
            review = json.loads(response)
            return review
        except json.JSONDecodeError:
            # Fallback: return as plain text if JSON parsing fails
            return {
                "key_contributions": "Could not parse structured review",
                "strengths": "",
                "weaknesses": "",
                "applications": "",
                "research_gaps": ""
            }
    
    def _build_review_prompt(self, text: str) -> str:
        """
        Build prompt for review generation.
        
        Args:
            text: Research paper text
            
        Returns:
            Formatted prompt for Gemini
        """
        prompt = f"""Analyze the following research paper and provide a structured review in JSON format with these exact keys:
- key_contributions: What are the main contributions of this research?
- strengths: What are the strengths of this study?
- weaknesses: What are the weaknesses or limitations?
- applications: What are the practical applications?
- research_gaps: What research gaps does this work identify or leave open?

Return ONLY valid JSON.
Do not wrap in markdown.
Do not include explanations.
Do not include code fences.

Research Paper Text:
{text[:15000]}"""
        
        return prompt