import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const ReviewForm = ({ textReview, setReview }) => {
  const handleChange = (e) => {
    setReview(e.target.value); // Update state with the text input
  };

  const handleReset = () => {
    setReview(""); // Reset the review text
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        p: 3,
        borderRadius: 2,
        backgroundColor: "white",
        mt: 4,
        minHeight: { xs: "200px", sm: "250px", md: "300px" }, // Responsive height
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 2,
          width: "100%",
        }}
      >
        <Button
          type="button"
          variant="outlined"
          onClick={handleReset}
          sx={{
            flex: 1,
            textTransform: "none",
            fontSize: "1rem",
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              borderColor: "#1976d2",
            },
          }}
        >
          Reset
        </Button>
      </Box>

      <TextField
        name="content"
        label="Your Review"
        variant="outlined"
        size="medium"
        multiline
        rows={4}
        value={textReview}
        onChange={handleChange}
        sx={{
          width: "100%",
          // maxWidth: { xs: "100%", sm: "80%", md: "70%" }, // Responsive width
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};

export default ReviewForm;