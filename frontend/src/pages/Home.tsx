import React from "react";
import { TextField, Typography, Button, Box } from "@mui/material";

const Home: React.FC = () => {
    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            width="100%" 
            maxWidth={600} // Adjust max width for better responsiveness
            mx="auto" // Centers horizontally
            p={2} // Adds padding for better spacing
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                What would you like to post?
            </Typography>

            <TextField
                fullWidth
                multiline
                minRows={5} // Reduced for better scaling on mobile
                maxRows={10} // Allows it to expand
                variant="outlined"
                sx={{ mb: 2 }} // Adds spacing below the text field
            />

            <Button 
                fullWidth 
                variant="contained"
                sx={{ 
                    height: 50, 
                    backgroundColor: '#c5d8df',
                    '&:hover': {
                        backgroundColor: '#a3b7c7', // Optional: darkens the button on hover
                    }
                }}
            >
                Create new post
            </Button>
        </Box>
    );
};

export default Home;
