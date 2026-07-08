import google.generativeai as genai
from ..config import settings
from .gemini_key_manager import GeminiKeyManager
import logging

logger = logging.getLogger("GeminiClient")


class GeminiClient:
    """Central gateway client for interacting with Google Gemini API, supported by failover and key rotation."""
    
    def __init__(self):
        """Initialize Gemini client and key manager."""
        self.key_manager = GeminiKeyManager()
        self.model_name = settings.gemini_model
        
    def generate_content(self, prompt: str) -> str:
        """
        Generate content using Gemini API, with automatic rotation and retry failover.
        
        Args:
            prompt: Input prompt for generation
            
        Returns:
            Generated text response
            
        Raises:
            ValueError: If prompt is empty or keys are missing
            Exception: If all configured keys fail or exhaust quota
        """
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty")
            
        num_keys = len(self.key_manager.keys)
        if num_keys == 0:
            raise ValueError("No Gemini API keys configured.")
            
        last_error = None
        
        # Retry up to the number of configured keys
        for attempt in range(num_keys):
            try:
                # Retrieve the round-robin selected key
                key, key_idx = self.key_manager.get_current_key()
            except Exception as e:
                raise Exception(f"Failed to obtain active API key: {str(e)}")
                
            logger.info(f"[Gemini] Using Key #{key_idx}")
            
            try:
                # Reconfigure generative AI library with the active key
                genai.configure(api_key=key)
                model = genai.GenerativeModel(self.model_name)
                
                response = model.generate_content(prompt)
                
                if not response or not response.text:
                    raise ValueError("Empty response from Gemini API")
                    
                logger.info(f"[Gemini] Request successful with Key #{key_idx}")
                return response.text
                
            except Exception as e:
                err_msg = str(e).lower()
                last_error = e
                
                # Check for standard quota / rate limit limits
                is_quota_exhausted = (
                    "429" in err_msg or 
                    "resource_exhausted" in err_msg or 
                    "quota exceeded" in err_msg or 
                    "rate limit exceeded" in err_msg or
                    "resource exhausted" in err_msg
                )
                
                if is_quota_exhausted:
                    logger.warning(f"[Gemini] Key #{key_idx} exhausted. Rotating to next key.")
                    self.key_manager.rotate_key(key)
                else:
                    # Non-exhaustion error (e.g. prompt safety block, API error): raise immediately
                    logger.error(f"[Gemini] Error encountered with Key #{key_idx}: {str(e)}")
                    raise e
                    
        logger.error("[Gemini] All configured Gemini API keys are exhausted.")
        raise Exception("All configured Gemini API keys are exhausted.")
