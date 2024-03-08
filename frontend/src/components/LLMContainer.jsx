import React, { useState } from 'react';
import { Box, Paper, List, ListItem, ListItemText, Divider, TextField, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'; 

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendClick = () => {
        if (inputValue.trim()) {
            // Add the user message to the chat
            setMessages([...messages, { text: inputValue, sender: 'User' }]);
            console.log("Here")
            // Call the OpenAI API via your backend
            fetch('http://localhost:5001/openai_chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        setMessages(messages => [...messages, { text: data.data, sender: 'Arya' }]);
                    } else {
                        console.error("An error occurred:", data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            setInputValue('');  // Clear the input field
        }
    };



    return (
        <Paper sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height:580, 
            width: 650, 
            backgroundColor: "#525467",
        }}>
            <List sx={{
                padding: 2,
                height: "100%",
                overflowY: 'auto',
            }}>
                {messages.map((message, index) => (
                    <ListItem key={index} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start', // Keep all messages aligned on the same side
                        mb: 1
                    }}>
                        <Typography sx={{
                            fontSize: '0.75rem',
                            color: '#CCC',
                            fontWeight: "Bold",
                            alignSelf: 'flex-start', // Align the sender name on the same side as the message
                            mr: 1,
                        }}>
                            {message.sender} 
                        </Typography>
                        <ListItemText primary={message.text} sx={{
                            padding: 1,
                            width: '100%',
                            backgroundColor: '#596C9C', // Use the same color for all text boxes
                            borderRadius: 1,
                            color: 'white',
                            wordBreak: 'break-word',
                            mt: 0.5,
                        }} />
                    </ListItem>
                ))}
            </List>


            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, backgroundColor: "#273046"  }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type to search for drones..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleSendClick();
                        }
                    }}
                    InputProps={{
                        style: { color: 'white' }, 
                    }}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#273046' }, 
                            '&:hover fieldset': { borderColor: '#273046' },
                            '&.Mui-focused fieldset': { borderColor: '#273046' }, 
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'white',
                        }
                    }}
                />
                <Button variant="contained" onClick={handleSendClick} sx={{ marginLeft: 2 }}>
                    <SendIcon />

                </Button>
            </Box>
        </Paper>
    );
}

export default ChatInterface;
