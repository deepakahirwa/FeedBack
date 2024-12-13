import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button, Typography, Box, Paper } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ReactAudioPlayer from "react-audio-player";
import { AudioRecorder } from 'react-audio-voice-recorder';
const Dictaphone = ({ audioReview, setReview }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => {
    if (transcript) {
      setReview(transcript);
    }
  }, [transcript, setReview]);

  const startListening = () => {
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = async () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();

    // Simulate an audio file using Text-to-Speech for demonstration
    const speech = new SpeechSynthesisUtterance(transcript);
    speech.onend = () => {
      const recordedAudio = new Blob(["Audio not available"], { type: "audio/wav" }); // Placeholder Blob
      const audioFileURL = URL.createObjectURL(recordedAudio);
      setAudioURL(audioFileURL);
    };
    window.speechSynthesis.speak(speech);
  };

  const resetAudio = () => {
    resetTranscript();
    setAudioURL("");
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Typography variant="h6" color="error">
        Browser doesn't support speech recognition.
      </Typography>
    );
  }
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };
  return (
    <Paper elevation={1} sx={{ padding: 3, textAlign: "center" }}>
      <Typography
        variant="body1"
        sx={{
          color: listening ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        Microphone: {listening ? "On" : "Off"}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2,gap:3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={startListening}
          disabled={isRecording}
          startIcon={<PlayCircleOutlineIcon />}
        >
          Record
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopListening}
          disabled={!isRecording}
          startIcon={<StopCircleIcon />}
        >
          Stop
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={resetAudio}
          startIcon={<RestartAltIcon />}
        >
          Reset
        </Button>
      </Box>

      {audioURL && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2">Review Playback:</Typography>
          <ReactAudioPlayer
            src={audioURL}
            controls
            style={{ width: "100%" }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default Dictaphone;
