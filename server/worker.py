import os
from dotenv import load_dotenv
import time
import logging
from kafka import KafkaConsumer
from textblob import TextBlob
from pymongo import MongoClient
import json
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# MongoDB setup
MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

if not all([MONGO_URI, MONGO_DB, MONGO_COLLECTION]):
    logger.error("MongoDB environment variables are missing.")
    raise ValueError("Required MongoDB environment variables not found.")

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    collection = db[MONGO_COLLECTION]
    logger.info("Connected to MongoDB.")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {e}")
    raise

# Kafka Consumer setup
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
KAFKA_SERVERS = os.getenv("KAFKA_SERVERS")

if not all([KAFKA_TOPIC, KAFKA_SERVERS]):
    logger.error("Kafka environment variables are missing.")
    raise ValueError("Required Kafka environment variables not found.")

try:
    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_SERVERS.split(','),
        value_deserializer=lambda v: json.loads(v.decode('utf-8')),
        auto_offset_reset='earliest',  # Start from the earliest message
        enable_auto_commit=True,
        group_id="feedback_consumer_group"
    )
    logger.info("Kafka consumer initialized.")
except Exception as e:
    logger.error(f"Error initializing Kafka consumer: {e}")
    raise

# Processing feedback messages
def process_message(message):
    try:
        feedback = message.value.get('feedback', '')
        if not feedback:
            logger.warning("Received empty feedback. Skipping.")
            return

        # Sentiment Analysis
        blob = TextBlob(feedback)
        sentiment_score = blob.sentiment.polarity
        sentiment_subjectivity = blob.sentiment.subjectivity
        sentiment_label = (
            "Positive" if sentiment_score > 0 else 
            "Negative" if sentiment_score < 0 else 
            "Neutral"
        )

        # Log polarity and subjectivity
        logger.info(f"Feedback: {feedback}")
        logger.info(f"Polarity: {sentiment_score}, Subjectivity: {sentiment_subjectivity}")

        # Store in MongoDB
        collection.insert_one({
            "feedback": feedback,
            "sentiment": sentiment_label,
            "sentiment_score": sentiment_score,
            "sentiment_subjectivity": sentiment_subjectivity,
            "timestamp": datetime.utcnow()
        })
        logger.info(f"Processed feedback: {feedback} -> {sentiment_label}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")

# Continuous listening loop
try:
    logger.info("Starting feedback consumer...")
    while True:
        for message in consumer:
            process_message(message)
except KeyboardInterrupt:
    logger.info("Consumer interrupted by user. Exiting...")
except Exception as e:
    logger.error(f"Unexpected error in consumer loop: {e}")
finally:
    consumer.close()
    logger.info("Kafka consumer closed.")
