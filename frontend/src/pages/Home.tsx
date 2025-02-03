import React, { useState } from "react";
import { TextField, Typography, Button, Box, Toolbar, Chip, Autocomplete } from "@mui/material";

const existingTags = ["React", "FastAPI", "MongoDB", "TypeScript"];

const Home: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [postText, setPostText] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);

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

            {/* Tags Field */}
            <Autocomplete
                multiple
                freeSolo
                options={existingTags}
                value={tags}
                onChange={(event, newValue) => setTags(newValue)}
                renderTags={(value, getTagProps) => 
                    value.map((option, index) => (
                        <Chip label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" />}
                sx={{ mb: 2, width: "100%" }}
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
            >
                Create new post
            </Button>
        </Box>
    );
};

export default Home;
