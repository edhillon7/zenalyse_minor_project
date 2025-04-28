import requests
from supabase import create_client, Client
from app.services.sentiment import SentimentAnalyzer
import os
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        if not self.supabase_url or not self.supabase_key:
            logger.error("Supabase URL or Key not found in environment variables")
            raise ValueError("Supabase URL or Key not found")
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.sentiment_analyzer = SentimentAnalyzer()
        logger.info(f"Initialized ChatService for user_id: {self.user_id}")

    async def process_message(self, message: str):
        logger.info(f"Starting to process message: {message}")
        start_time = time.time()

        # Step 1: Analyze sentiment
        sentiment = "neutral"  # Default value
        try:
            logger.info("Analyzing sentiment...")
            sentiment_start = time.time()
            sentiment = self.sentiment_analyzer.analyze(message)
            logger.info(f"Sentiment analysis completed in {time.time() - sentiment_start:.2f}s: {sentiment}")
        except Exception as e:
            logger.error(f"Sentiment analysis failed: {str(e)}")
            sentiment = "neutral"

        # Step 2: Get response from Ollama/Mistral
        chat_response = "I'm sorry, I couldn't process your message."
        try:
            logger.info("Sending request to Ollama...")
            ollama_start = time.time()
            ollama_url = "http://localhost:11434/api/generate"
            payload = {"model": "mistral", "prompt": message, "stream": False}
            response = requests.post(ollama_url, json=payload, timeout=30)
            if response.status_code != 200:
                logger.error(f"Ollama request failed: {response.text}")
                raise Exception(f"Ollama request failed: {response.status_code}")
            chat_response = response.json().get("response", "No response from model")
            logger.info(f"Ollama response received in {time.time() - ollama_start:.2f}s")
        except Exception as e:
            logger.error(f"Ollama request failed: {str(e)}")
            chat_response = "I'm sorry, I couldn't reach the AI model."

        # Step 3: Save conversation to Supabase
        try:
            logger.info("Saving to Supabase...")
            supabase_start = time.time()
            conversation = {"user": message, "bot": chat_response, "sentiment": sentiment}
            self.supabase.table("conversations").insert({
                "user_id": self.user_id,
                "conversation": [conversation]
            }).execute()
            logger.info(f"Saved to Supabase in {time.time() - supabase_start:.2f}s")
        except Exception as e:
            logger.error(f"Failed to save to Supabase: {str(e)}")
            # Continue even if Supabase fails, as this shouldn't block the response

        total_time = time.time() - start_time
        logger.info(f"Message processing completed in {total_time:.2f}s")
        return chat_response