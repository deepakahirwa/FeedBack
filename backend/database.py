from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# MongoDB setup
MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")


MONGO_DB_URL = os.getenv("MONGO_URI")
if not MONGO_DB_URL:
    raise ValueError("MONGO_DB_URL is not set in environment variables")

client = AsyncIOMotorClient(MONGO_DB_URL)
database = client["MONGO_DB"]
students_collection = database["MONGO_COLLECTION"]
