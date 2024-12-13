import os
import json
from kafka import KafkaProducer
from dotenv import load_dotenv
import time
import logging

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

logger = logging.getLogger(__name__)
# Kafka Producer setup
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "feedback_topic")
KAFKA_SERVERS = os.getenv("KAFKA_SERVERS", "localhost:9092")

MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGO_DB", "feedback_db")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "feedback_sentiments")

# logger.info(f"{MONGO_URI}")

try:
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    print("Kafka producer initialized.")
except Exception as e:
    print(f"Error initializing Kafka producer: {e}")
    raise

def produce_feedback():
    feedbacks = [
        {"feedback": "This is a terrible experience."},
        {"feedback": "The weather is okay."},
        {"feedback": "The product is excellent and very useful!"}
    ]

    try:
        for feedback in feedbacks:
            producer.send(KAFKA_TOPIC, value=feedback)
            print(f"Produced feedback: {feedback}")
            time.sleep(1)  # Adding delay to simulate real-time feedback generation
    except Exception as e:
        print(f"Error producing feedback: {e}")
    finally:
        producer.flush()
        producer.close()

if __name__ == "__main__":
    produce_feedback()
