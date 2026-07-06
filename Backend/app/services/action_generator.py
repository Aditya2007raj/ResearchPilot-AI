import json
from .gemini_client import GeminiClient


class ActionGenerator:
    """Service for generating action plans from research papers."""
    
    def __init__(self):
        """Initialize action generator with Gemini client."""
        self.client = GeminiClient()
    
    def generate_action_plan(self, text: str) -> dict:
        """
        Generate an action plan from research paper text.
        
        Args:
            text: Extracted text from PDF
            
        Returns:
            Dictionary with action plan containing:
                - skills_to_learn: Skills and concepts to learn
                - learning_path: Step-by-step learning path
                - project_ideas: Practical project ideas
                - estimated_timeline: Estimated time to complete
                - recommended_resources: Recommended learning resources
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        prompt = self._build_action_prompt(text)
        response = self.client.generate_content(prompt)
        
        # Clean response (remove markdown code fences if present)
        cleaned_response = self._clean_json_response(response)
        
        # Parse JSON response
        try:
            action_plan = json.loads(cleaned_response)
            return action_plan
        except json.JSONDecodeError:
            # Fallback: return as plain text if JSON parsing fails
            return {
                "skills_to_learn": [],
                "learning_path": [],
                "project_ideas": [],
                "estimated_timeline": "",
                "recommended_resources": []
            }
    
    def _build_action_prompt(self, text: str) -> str:
        """
        Build prompt for action plan generation.
        
        Args:
            text: Research paper text
            
        Returns:
            Formatted prompt for Gemini
        """
        prompt = f"""Analyze the following research paper and generate a practical action plan in JSON format with these exact keys:
- skills_to_learn: List of skills and concepts to learn based on this paper
- learning_path: Step-by-step learning path to understand and implement the research
- project_ideas: Practical project ideas to apply the concepts from this paper
- estimated_timeline: Estimated time to complete the learning path
- recommended_resources: List of recommended resources (papers, courses, tools)

Return ONLY valid JSON.
Do not wrap in markdown.
Do not include explanations Do not include code fences.

Research Paper Text:
{text[:15000]}"""
        
        return prompt
    
    def _clean_json_response(self, response: str) -> str:
        """
        Clean JSON response by removing markdown code fences if present.
        
        Args:
            response: Raw response from Gemini
            
        Returns:
            Cleaned JSON string
        """
        # Remove markdown code fences
        if response.strip().startswith("```json"):
            response = response.strip()[7:]  # Remove ```json
        elif response.strip().startswith("```"):
            response = response.strip()[3:]  # Remove ```
        
        if response.strip().endswith("```"):
            response = response.strip()[:-3]  # Remove trailing ```
        
        return response.strip()
