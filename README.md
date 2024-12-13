# Interactive Multilingual Feedback System with AI-Driven Insights

## Overview

This project provides a comprehensive user feedback system that integrates multiple input methods, such as speech-to-text, text input, and video analysis, to collect feedback from users. The backend processes and analyzes this feedback, providing actionable insights through AI-driven sentiment analysis.

## System Architecture

### Frontend

The frontend is responsible for capturing user feedback through three primary input methods:
1. **Speech-to-Text**: Converts spoken feedback into text.
2. **Text Input**: Captures typed feedback.
3. **Video Analysis**: Analyzes video input to detect emotions, age, and gender.

### Backend

The backend handles data processing and performs sentiment analysis, providing insights and storing feedback. Key technologies used include:
- **FastAPI**: API layer for data processing and statistics retrieval.
- **Kafka**: Message queue system for scalable feedback processing.
- **TextBlob**: Sentiment analysis library for processing feedback.
- **MongoDB**: Database for storing feedback data.

## Frontend Process

### 1. User Input Methods

#### (A) Speech-to-Text

- **Component**: `Dictaphone`
- **Process**: Captures voice input using `react-speech-recognition`, converts it to text, and sends it to the backend.
- **Data Format**:
  ```json
  {
    "input_type": "speech",
    "feedback": "I love the service!"
  }

## Feedback System Documentation

### (B) Text Input
**Component:** `ReviewForm`

**Process:**
Accepts user feedback via a text input field and sends the feedback to the backend.

**Data Format:**
```json
{
  "input_type": "text",
  "feedback": "The service was excellent."
}
```

### (C) Video Analysis
**Component:** `FacialExpression`

**Process:**
Analyzes live video feed using `face-api.js` to detect emotions, age, and gender.

**Data Format:**
```json
{
  "input_type": "video",
  "expressions": ["happy", "excited"],
  "age": 28,
  "gender": "male"
}
```

### 2. Aggregation and Submission
The parent component aggregates feedback from all sources into a unified state and sends it to the backend via an HTTP POST request.

#### Backend Process

**1. Feedback Submission**

- **API Endpoint:** `/api/feedback/`
- **Process:** Receives feedback from the frontend, stores raw data in MongoDB with a timestamp.

**Stored Data Example:**
```json
{
  "user_id": "123",
  "feedback": "I love the service!",
  "sentiment": "Positive",
  "timestamp": "2024-12-12T14:20:00Z"
}
```

**2. Kafka Worker Processing**

- **Purpose:** Processes feedback for sentiment analysis and stores the results.

**Sentiment Analysis:**
- **Library:** `TextBlob`
- **Process:** Calculates polarity (sentiment score) and subjectivity, then classifies sentiment as Positive, Negative, or Neutral.

**Processed Feedback Example:**
```json
{
  "feedback": "I love the service!",
  "sentiment": "Positive",
  "sentiment_score": 0.8,
  "sentiment_subjectivity": 0.9,
  "timestamp": "2024-12-12T14:20:00Z"
}
```

**3. Dashboard Statistics**

- **API Endpoint:** `/api/feedback/dashboard/`
- **Process:** Aggregates sentiment counts (Positive, Negative, Neutral) and computes daily feedback trends.

**Response Format:**
```json
{
  "total_sentiments": {
    "positive": 50,
    "negative": 20,
    "neutral": 30
  },
  "daily_sentiments": [
    {
      "date": "2024-12-12",
      "sentiments": {
        "positive": 10,
        "negative": 5,
        "neutral": 3
      }
    }
  ]
}
```

### Integration Flow

**Frontend to Backend Communication:**
The frontend sends feedback data (speech, text, video) via an HTTP POST request.

**Example Payload:**
```json
{
  "input_type": "text",
  "feedback": "Great product, will recommend!"
}
```

**Backend Processing:**
- The backend stores raw feedback and initiates sentiment analysis through Kafka Worker.

**Result Storage:**
- Feedback and sentiment data are stored in MongoDB.

**Dashboard Insights:**
- The backend API aggregates and retrieves sentiment statistics for visualization on the dashboard.

### Error Handling

**Frontend**
- **Speech-to-Text:** Displays an error message if the microphone is inaccessible.
- **Webcam Analysis:** Alerts the user in case of camera permission issues.
- **Input Validation:** Ensures feedback fields are not empty before submission.

**Backend**
- **Database Connection:** Logs errors if MongoDB is unreachable.
- **Kafka Consumer:** Handles message deserialization issues.
- **API Response:** Returns detailed error messages for failed operations.

### Enhancements

**1. Scalability**
- Partition Kafka topics to handle higher message volumes.
- Use async MongoDB libraries like `Motor` for non-blocking queries.

**2. Analytics**
- Implement advanced NLP models for better sentiment analysis accuracy.
- Add real-time feedback visualization to enhance the user experience.

**3. Testing**
- Automate unit and integration tests for input components and API endpoints.

### Conclusion
This integrated system provides a seamless mechanism for collecting and analyzing user feedback across multiple input methods. The frontend ensures rich user interaction, while the backend processes data efficiently to deliver insightful sentiment trends. This setup enhances the user experience and offers valuable insights for business decision-making.
