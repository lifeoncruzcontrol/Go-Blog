import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import BlogPost from "../interfaces/BlogPost";
import GetPostsResponse from "../interfaces/GetPostsResponse";

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<GetPostsResponse | null>(null);
    const [open, setOpen] = useState(false);
    
    // Form states for creating a new post
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [tags, setTags] = useState("");
  
    // Fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/posts");
        const data = await response.json();
        
        console.log("Fetched posts:", data); // Debugging
  
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
    // Handle form submission
    const handleSubmit = async () => {
      const newPost = { 
        title, 
        text, 
        username, 
        tags: tags.split(",").map(tag => tag.trim())  // Convert string to array
      };
      console.log(newPost)
      try {
        const response = await fetch("http://127.0.0.1:8080/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        });
  
        if (response.ok) {
          fetchPosts(); // Refresh the posts
          setOpen(false); // Close modal
          setTitle("");
          setText("");
          setUsername("");
          setTags("");
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    };
  
    return (
      <Container>
        <Typography variant="h3" gutterBottom>Blog Posts</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create New Post
        </Button>
  
        <Grid2 container spacing={3} sx={{ mt: 2 }}>
          {posts && posts?.data.length > 0 ? (
            posts.data.map((post: BlogPost) => (
              <Grid2 item xs={12} sm={6} md={4} key={post._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">{post.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{post.username}</Typography>
                    <Typography variant="body2">{new Date(post.dateTime).toDateString()}</Typography>
                    <Typography variant="body1">{post.text.substring(0, 100)}...</Typography>
                    {post.tags?.length > 0 && (
                      <Typography variant="body2" color="primary">Tags: {post.tags.join(", ")}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid2>
            ))
          ) : (
            <Typography variant="h6" sx={{ mt: 2 }}>No posts available.</Typography>
          )}

        </Grid2>
  
        {/* Create Post Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 400, p: 3, bgcolor: "background.paper", mx: "auto", mt: 10, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Create a New Post</Typography>
            <TextField label="Title" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Username" fullWidth sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Text" multiline rows={4} fullWidth sx={{ mb: 2 }} value={text} onChange={(e) => setText(e.target.value)} />
            <TextField label="Tags (comma-separated)" fullWidth sx={{ mb: 2 }} value={tags} onChange={(e) => setTags(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Modal>
      </Container>
    );
  };
  
export default BlogPage;
