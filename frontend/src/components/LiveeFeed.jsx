import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const VideoFeed = () => {
    const imgRef = useRef(null);

    useEffect(() => {
        // Assign the MJPEG stream URL directly to the <img> tag's src attribute
        if (imgRef.current) {
            imgRef.current.src = 'http://localhost:5001/video_feed';
        }
    }, []);

    return (
        <Box sx={{
            width: '70vw', // Adjust the width as per requirement
            maxWidth: '600px', // Set a max width if needed
            margin: 'auto', // Center the box if there's room on the sides
            position: 'relative', // Keeps the video within this box, relative to its normal flow
            backgroundColor: '#000',
            height: 345,
            '&::before': {
                content: '""',
                display: 'block',
                paddingTop:'39.25%', // Adjust the padding-top to control the aspect ratio (e.g., for 16:9 aspect ratio, use 56.25%)
            },
            '& > img': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            },
            border: '2px solid #fff',
            boxSizing: 'border-box',
        }}>
            <img ref={imgRef} alt="Video Feed" />
        </Box>

    );
};

export default VideoFeed;
