from collections import defaultdict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import os
from kafka import KafkaProducer
import json
from pymongo import MongoClient
from typing import List, Dict
from datetime import datetime

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Environment Variables
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "feedback_topic")
KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")
MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGO_DB", "feedback_db")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "feedback_sentiments")

# MongoDB setup
try:
    client = MongoClient("mongodb+srv://deepak:deepak@minstagram1.vdgnyus.mongodb.net")
    db = client[MONGO_DB]
    collection = db[MONGO_COLLECTION]
    logger.info("Connected to MongoDB.")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {e}")
    raise

# Kafka Producer setup
try:
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_SERVERS.split(","),
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    logger.info("Kafka producer initialized.")
except Exception as e:
    logger.error(f"Error initializing Kafka producer: {e}")
    raise

# FastAPI Router
router = APIRouter(prefix="/api/feedback", tags=["feedback"])

# Feedback Model
class FeedbackModel(BaseModel):
    user_id: str
    feedback: str
    sentiment: str  # Assuming sentiment is included in the feedback data
    timestamp: datetime

class SentimentStatistics(BaseModel):
    positive: int
    negative: int
    neutral: int

class DaySentimentData(BaseModel):
    date: str
    sentiments: SentimentStatistics

class DashboardResponse(BaseModel):
    total_sentiments: SentimentStatistics
    daily_sentiments: List[DaySentimentData]

# Create Feedback Endpoint
@router.post("/", response_model=Dict[str, str])
async def create_feedback(feedback: FeedbackModel):
    feedback_data = feedback.dict()
    feedback_data["timestamp"] = datetime.utcnow()  # Ensure timestamp is set correctly

    try:
        # Store feedback in MongoDB
        inserted_id = collection.insert_one(feedback_data).inserted_id
        logger.info(f"Inserted feedback into MongoDB with ID: {inserted_id}")
        return {"message": "Feedback submitted successfully", "status": "success"}
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        raise HTTPException(status_code=500, detail="Error submitting feedback.")

# Get Dashboard Statistics
@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard_statistics():
    try:
        # Fetch feedback documents
        all_feedback = list(collection.find())  # Adjust for pymongo or motor
        logger.info(f"Fetched feedback documents: {all_feedback}")

        if not all_feedback:
            raise HTTPException(status_code=404, detail="No feedback data found.")

        # Initialize counters
        sentiment_counts = defaultdict(int)  # Tracks total sentiment counts
        daily_counts = defaultdict(lambda: {"positive": 0, "negative": 0, "neutral": 0})  # Tracks daily sentiment counts

        # Process each feedback
        for feedback in all_feedback:
            sentiment = feedback.get("sentiment", "neutral").lower()
            timestamp = feedback.get("timestamp", datetime.utcnow())
            if isinstance(timestamp, datetime):
                date_str = timestamp.strftime("%Y-%m-%d")
            else:
                date_str = datetime.utcnow().strftime("%Y-%m-%d")

            # Increment total sentiment counts
            sentiment_counts[sentiment] += 1

            # Increment daily sentiment counts
            daily_counts[date_str][sentiment] += 1

        # Calculate total sentiment stats
        total_sentiments = SentimentStatistics(
            positive=sentiment_counts["positive"],
            negative=sentiment_counts["negative"],
            neutral=sentiment_counts["neutral"]
        )

        # Prepare daily sentiment stats
        daily_sentiments = [
            DaySentimentData(date=date, sentiments=SentimentStatistics(**counts))
            for date, counts in sorted(daily_counts.items())
        ]

        return {
            "total_sentiments": total_sentiments,
            "daily_sentiments": daily_sentiments,
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard statistics: {e}")
        raise HTTPException(status_code=500, detail="Error generating dashboard statistics.")
