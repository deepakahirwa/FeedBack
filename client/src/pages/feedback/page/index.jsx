import React, { useState } from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import FaceExpressionAnalysis from "../components/videoExpression";
import ReviewForm from "../components/writingReview";
import Dictaphone from "../components/speechToText";

const FeedbackForm = () => {
  const [textReview, setTextReview] = useState("");
  const [videoReview, setVideoReview] = useState([]);
  const [audioReview, setAudioReview] = useState("");

  const handleSubmit = () => {
    const expressionCounts = {
      happy: 0,
      sad: 0,
      angry: 0,
      disgusted: 0,
    };

    if (videoReview && Array.isArray(videoReview)) {
      videoReview.forEach((expression) => {
        if (expressionCounts.hasOwnProperty(expression)) {
          expressionCounts[expression] += 1;
        }
      });
    }
    console.log(expressionCounts);
    
    const minCount = Math.min(...Object.values(expressionCounts));
    const normalizedExpressions = [];
    for (const [expression, count] of Object.entries(expressionCounts)) {
        const normalizedCount =minCount===0? count:Math.round(count / minCount);
        console.log(normalizedCount);
        
      if (normalizedCount > 0) {
        for (let i = 0; i < normalizedCount; i++) {
          // console.log(expression);
          
          normalizedExpressions.push(expression);
        }
      }
    }
    
    const combinedReviewString = [
      textReview,
      audioReview,
      normalizedExpressions.join(" "),
    ].join(" ");

    console.log(combinedReviewString);
    const userId = `user${Math.floor(Math.random() * 1000) + 1}`;

    fetch("http://localhost:8000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        feedback: combinedReviewString,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Review submitted successfully:", data);
        setAudioReview("");
        setTextReview("");
        setVideoReview([]);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          mb: 2,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Feedback System
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch",
          p: 3,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Dictaphone audioReview={audioReview} setReview={setAudioReview} />
        <FaceExpressionAnalysis
          videoReview={videoReview}
          setReview={setVideoReview}
        />
        <ReviewForm textReview={textReview} setReview={setTextReview} />
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            px: 4,
            py: 1,
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          Submit Review
        </Button>
      </Box>
    </Container>
  );
};

export default FeedbackForm;
