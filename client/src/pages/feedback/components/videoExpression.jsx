import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

const VideoPlayer = ({ videoReview, setReview }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelPath = "/models"; // Ensure this path is correct
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
          faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
          faceapi.nets.ageGenderNet.loadFromUri(modelPath),
        ]);
        console.log("Models loaded successfully!");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  const startCamera = () => {
    setLoading(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
        setIsCameraOn(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        setLoading(false);
      });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  useEffect(() => {
    const detectFaces = async () => {
      if (!isCameraOn || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;

      const intervalId = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors();

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const displaySize = {
            width: video.videoWidth,
            height: video.videoHeight,
          };

          faceapi.matchDimensions(canvas, displaySize);

          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

          if (detections.length > 0) {
            const faceDetails = detections
              .map((det) => ({
                age: det.age.toFixed(1),
                gender: det.gender,
                expressions: Object.entries(det.expressions)
                  .filter(([_, value]) => value > 0.5)
                  .map(([expression]) => expression)
                  .join(", "),
              }))
              .filter(Boolean);

            setDetails((prev) => [...prev, ...faceDetails]);
            setReview((prev) => [...prev, ...faceDetails.map((det) => det.expressions)]);
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    };

    detectFaces();
  }, [isCameraOn, setReview]);

  return (
    <Container sx={{ textAlign: "center", padding: 3 ,backgroundColor:'white'}}>
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading models...
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3,backgroundColor:"white" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={startCamera}
          disabled={isCameraOn || loading}
        >
          Start Camera
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopCamera}
          disabled={!isCameraOn}
        >
          Stop Camera
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            stopCamera();
            setDetails([]);
          }}
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ position: "relative", display: isCameraOn ? "block" : "none" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-lg shadow-lg"
          style={{ width: "100%", maxWidth: 600 }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: "100%", maxWidth: 600 }}
        />
      </Box>
      <Box sx={{ position: "relative", display: isCameraOn ? "none" : "block" }}>
        <video
          // ref={videoRef}
          autoPlay
          muted
          className="rounded-lg shadow-lg"
          style={{ width: "100%", maxWidth: 600 }}
        />
        <canvas
          // ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: "100%", maxWidth: 600 }}
        />
      </Box>

    
    </Container>
  );
};

export default VideoPlayer;