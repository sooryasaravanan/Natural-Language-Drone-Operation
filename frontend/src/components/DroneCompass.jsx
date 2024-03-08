import React, { useEffect, useState } from 'react';
// Ensure you import Box, Card, and other required components from @mui/material as needed
import axios from 'axios'; // Make sure to install axios for making HTTP requests

const DroneCompass = () => {
  const [compassImage, setCompassImage] = useState(''); // State to store the compass image

  useEffect(() => {
    // Function to fetch the compass image when the component mounts
    const fetchCompassImage = async () => {
      try {
        const response = await axios.get('http://localhost:5001/simulate_detections'); // Adjust URL/port as necessary
        setCompassImage(response.data.compassImage); // Update state with the fetched image
      } catch (error) {
        console.error('Failed to fetch compass image:', error);
      }
    };

    fetchCompassImage(); // Call the fetch function
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      {compassImage ? (
        // Display the compass image using the Base64-encoded string
        <img src={`data:image/jpeg;base64,${compassImage}`} alt="Compass" style={{ width: 200, height: 200 }} />
      ) : (
        <p>Loading compass...</p> // Placeholder text or component while loading
      )}
    </div>
  );
};

export default DroneCompass;