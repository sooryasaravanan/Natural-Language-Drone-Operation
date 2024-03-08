import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, CardActions, CardMedia, Box } from '@mui/material';

const DroneCard = () => {
    const [isJamming, setIsJamming] = useState(false);

    const handleJamClick = async () => {
        setIsJamming(true);

        try {
            const response = await fetch('http://localhost:5001/check_connections', {
                method: 'POST', // Or 'POST' if sending data to the endpoint
            });

        } catch (error) {
            console.error('Error during fetch:', error);
        } finally {
            setTimeout(() => {
                setIsJamming(false);
            }, 3000);
        }
    };

    return (
        <Card sx={{ maxWidth: 315, display: 'flex', flexDirection: 'column', backgroundColor: '#525467', color: 'white' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                <Box sx={{ paddingBottom: 2 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 120, objectFit: 'cover' }}
                        image="/dronepic.png"
                        alt="Parrot Drone"
                    />
                </Box>
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 2, paddingRight: 2 }}>
                    <Typography sx={{ fontWeight: "Bold"}}>
                        Parrot Drone
                    </Typography>
                    <Typography variant="body2">
                        Moving SE...
                    </Typography>
                </Box>
            </Box>
            <CardActions sx={{ justifyContent: 'center', padding: 0 }}>
                <Button
                    size="large"
                    sx={{
                        width: '100%',
                        borderRadius: 1.5,
                        backgroundColor: isJamming ? '#800404' : '#9a0007',
                        color: 'white !important', 
                        '&:hover': { backgroundColor: '#800404' }
                    }}
                    onClick={handleJamClick}
                    disabled={isJamming}
                >
                    {isJamming ? 'Jamming...' : 'JAM'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default DroneCard;
