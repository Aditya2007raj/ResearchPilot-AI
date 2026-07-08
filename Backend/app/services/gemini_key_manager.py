import os
from datetime import datetime, timedelta
import threading
from typing import List, Dict, Tuple
from ..config import settings
import logging

logger = logging.getLogger("GeminiKeyManager")


class GeminiKeyManager:
    """Thread-safe manager for loading, selecting, and rotating Gemini API keys with cooldown support."""
    
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        self.keys: List[str] = []
        self.cooldowns: Dict[str, datetime] = {}
        self.current_index = 0
        self.lock = threading.Lock()
        
        # Load API keys from environment config
        raw_keys = settings.gemini_api_keys
        if raw_keys:
            self.keys = [k.strip() for k in raw_keys.split(",") if k.strip()]
            
        # Fallback to single GEMINI_API_KEY
        if not self.keys and settings.gemini_api_key:
            self.keys = [settings.gemini_api_key.strip()]
            
        if not self.keys:
            logger.warning("[Gemini] No API keys configured in settings.gemini_api_keys or settings.gemini_api_key.")
            
        self._initialized = True

    def get_current_key(self) -> Tuple[str, int]:
        """
        Selects the next available key in round-robin fashion, skipping keys in cooldown.
        
        Returns:
            Tuple of (api_key, 1-based key index)
            
        Raises:
            Exception: If all configured keys are exhausted and in cooldown.
        """
        with self.lock:
            if not self.keys:
                raise ValueError("No Gemini API keys are configured.")
                
            now = datetime.now()
            num_keys = len(self.keys)
            
            # Loop once across all keys to find one not in cooldown
            for _ in range(num_keys):
                key = self.keys[self.current_index]
                cooldown_until = self.cooldowns.get(key)
                
                selected_index = self.current_index
                # Move pointer forward (round-robin)
                self.current_index = (self.current_index + 1) % num_keys
                
                if not cooldown_until or now >= cooldown_until:
                    return key, selected_index + 1
                    
            raise Exception("All configured Gemini API keys are exhausted and in cooldown.")

    def rotate_key(self, exhausted_key: str):
        """
        Marks an API key as exhausted and sets a 15-minute cooldown.
        
        Args:
            exhausted_key: The API key string that returned a 429
        """
        with self.lock:
            if exhausted_key in self.keys:
                idx = self.keys.index(exhausted_key)
                cooldown_until = datetime.now() + timedelta(minutes=15)
                self.cooldowns[exhausted_key] = cooldown_until
                logger.warning(
                    f"[Gemini] Key #{idx + 1} exhausted. Cooldown initiated until {cooldown_until.strftime('%H:%M:%S')}."
                )

    def available_keys(self) -> List[int]:
        """
        Returns list of 1-based indices of active keys not in cooldown.
        """
        with self.lock:
            now = datetime.now()
            return [
                idx + 1 for idx, key in enumerate(self.keys)
                if not self.cooldowns.get(key) or now >= self.cooldowns.get(key)
            ]
