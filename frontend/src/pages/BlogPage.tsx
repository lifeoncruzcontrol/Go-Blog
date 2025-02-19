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
  IconButton
} from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import BlogPost from "../interfaces/BlogPost";
import GetPostsResponse from "../interfaces/GetPostsResponse";

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [limit, setLimit] = useState<number>(1);
    const [nextCursor, setNextCursor] = useState<string>("");
    const [totalDocuments, setTotalDocuments] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [open, setOpen] = useState(false);
    
    // Form states for creating a new post
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [author, setAuthor] = useState("");
    const [tags, setTags] = useState("");
    const [snackbarMsg, setSnackbarMsg] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  
    const addPost = (newPost: BlogPost) => {
      setPosts((prevPosts) => [...prevPosts, newPost]);
    };

    const removePost = (id: string) => {
      setPosts(posts.filter((post) => post.id !== id));
    };

    // Fetch posts from the backend
    const fetchNewPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/posts/filter");
        const res: GetPostsResponse = await response.json();
        setPosts(res.data);
        if (res.pagination.limit) {
          setLimit(res.pagination.limit);
        }
        if (res.pagination.totalDocuments) {
          setTotalDocuments(res.pagination.totalDocuments);
        }
        if (res.pagination.totalPages) {
          setTotalPages(res.pagination.totalPages);
        }
        setNextCursor(res.pagination.nextCursor);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    useEffect(() => {
      fetchNewPosts();
    }, []);
  
    // Handle form submission
    const handleSubmit = async () => {
      let newPost: BlogPost = { 
        title, 
        text, 
        author, 
        tags: tags.split(",").map(tag => tag.trim())  // Convert string to array
      };
      try {
        const response = await fetch("http://127.0.0.1:8080/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          newPost = {
            ...newPost,
            id: responseData.id,
            datetime: responseData.datetime
          }
          addPost(newPost)
          setOpen(false); // Close modal
          setTitle("");
          setText("");
          setAuthor("");
          setTags("");
          setSnackbarMsg("Post created successfully!");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    };

    const handleDelete = async (postId: string) => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/posts?id=${postId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setSnackbarMsg("Post deleted successfully!");
          setOpenSnackbar(true);
          
          removePost(postId);
        }
      } catch (err) {
        console.error("Error trying to delete post: ", err);
      }
    };
  
    return (
      <Container>
        <Typography variant="h3" gutterBottom>Blog Posts</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create New Post
        </Button>
  
        <Grid2 container spacing={3} sx={{ mt: 2 }}>
          {posts && posts.length > 0 ? (
            posts.map((post: BlogPost) => (
              <Grid2 item xs={12} sm={6} md={4} key={post.id}>
                <Card sx={{ position: "relative", p: 2 }}>
                <Box sx={{ position: "absolute", top: 5, right: 5 }}>
                  <IconButton onClick={() => handleDelete(post.id)} color="textSecondary">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                  <CardContent>
                    <Typography variant="h5">{post.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{post.author}</Typography>
                    <Typography variant="body2">{new Date(post.datetime).toDateString()}</Typography>
                    <Typography variant="body1">{post.text.substring(0, 100)}...</Typography>
                    {post.tags?.length > 0 && (
                      <Typography variant="body2" color="textSecondary">Tags: {post.tags.join(", ")}</Typography>
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
            <TextField label="Author" fullWidth sx={{ mb: 2 }} value={author} onChange={(e) => setAuthor(e.target.value)} />
            <TextField label="Text" multiline rows={4} fullWidth sx={{ mb: 2 }} value={text} onChange={(e) => setText(e.target.value)} />
            <TextField label="Tags (comma-separated)" fullWidth sx={{ mb: 2 }} value={tags} onChange={(e) => setTags(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Modal>
        {/* Snackbar for success message */}
        <Snackbar 
            open={openSnackbar} 
            autoHideDuration={3000} 
            onClose={() => setOpenSnackbar(false)}
        >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                {snackbarMsg}
            </Alert>
        </Snackbar>
      </Container>
    );
  };
  
export default BlogPage;
