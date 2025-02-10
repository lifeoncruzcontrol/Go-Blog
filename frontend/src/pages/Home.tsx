import React, { useState } from "react";
import { TextField, Typography, Button, Box, Toolbar, Snackbar, Alert } from "@mui/material";

const Home: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [postText, setPostText] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    const handlePostSubmit = async () => {
        const postData = {
            title,
            username,
            text: postText,
            tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""), // Convert comma-separated string to array
        };

        try {
            const res = await fetch("http://127.0.0.1:8080/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (!res.ok) {
                throw new Error("Response not ok");
            }

            const data = await res.json();

            // Show success message
            setOpenSnackbar(true);

            setUsername("");
            setTitle("");
            setPostText("");
            setTags("");

        } catch (err) {
            console.error("Error trying to post: ", err);
        }
    };

    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            width="100%" 
            maxWidth={600} 
            mx="auto" 
            p={2} 
        >
            {/* Spacer to prevent overlap with fixed navbar */}
            <Toolbar />

            <Typography variant="h4" gutterBottom textAlign="center">
                What would you like to post?
            </Typography>

            {/* Username Field */}
            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Title Field */}
            <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Tags Field (Regular TextField instead of Autocomplete) */}
            <TextField
                fullWidth
                label="Tags (comma-separated)"
                variant="outlined"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Post Text Field */}
            <TextField
                fullWidth
                multiline
                minRows={5}
                maxRows={10}
                label="Post Content"
                variant="outlined"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button 
                fullWidth 
                variant="contained"
                sx={{ 
                    height: 50, 
                    backgroundColor: '#c5d8df',
                    '&:hover': {
                        backgroundColor: '#a3b7c7',
                    }
                }}
                onClick={handlePostSubmit}
            >
                Create new post
            </Button>

            {/* Snackbar for success message */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Post created successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;
