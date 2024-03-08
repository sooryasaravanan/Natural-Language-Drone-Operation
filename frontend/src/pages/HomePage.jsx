import React from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import DroneCard from "../components/DroneCard";
import VideoFeed from "../components/LiveeFeed"; // Assuming the correct file name is VideoFeed
import LLMContainer from "../components/LLMContainer";
import DroneCompass from "../components/DroneCompass"; // Import the DroneCompass component

const HomePage = () => {
  // Example drone directions; in a real app, these would be dynamic
  const droneDirections = [45, 90, 135, 180]; // This should be dynamically updated based on actual data

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          height: "100vh", // Adjusted for full screen height
          backgroundColor: "#3E3F51",
          padding: { xs: 2, sm: 3, md: 4 },
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ color: "#FFFFFF", mb: 2, alignSelf: "flex-start" }}
        >
          Counter UAS System
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-evenly",
            width: "100%",
            minHeight: "95vh", // Adjusted for full screen height
            backgroundColor: "#525467",
            mx: "auto",
            my: 2,
            p: 2,
            overflowY: "auto",
          }}
        >
          <Box>
            <LLMContainer />
          </Box>
          <Box sx={{ paddingRight: 1, paddingLeft: 1, paddingTop: 4.4 }}>
            <VideoFeed />
            {/* Include DroneCompass below VideoFeed or wherever appropriate */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;