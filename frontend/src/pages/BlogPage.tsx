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
  IconButton,
  Pagination
} from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import BlogPost from "../interfaces/BlogPost";
import BlogModal from "../components/BlogModal";
import GetPostsResponse from "../interfaces/GetPostsResponse";

const BlogPage: React.FC = () => {
    const [postsCache, setPostsCache] = useState<BlogPost[]>([]);
    const [currPosts, setCurrPosts] = useState<BlogPost[]>([]);
    const [limit, setLimit] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [visitedPages, setVisitedPages] = useState<Set<number>>(new Set([0]));
    const [nextCursorMap, setNextCursorMap] = useState<Map<number, string>>(new Map());
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
      setPostsCache((prevPostsCache) => [...prevPostsCache, newPost]);
    };

    const removePost = (id: string) => {
      setPostsCache(postsCache.filter((post) => post.id !== id));
    };

    // Fetch posts from the backend
    const fetchPosts = async (page: number) => {
      try {
        const cursor = nextCursorMap.get(page - 1) || "";
  
        const response = await fetch("http://127.0.0.1:8080/posts/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nextCursor: cursor, limit }),
        });
  
        const res: GetPostsResponse = await response.json();
        if (!res.data || res.data.length === 0) return;
  
        // Append new posts to cache, ensuring uniqueness
        setPostsCache((prev) => {
          const newPosts = res.data.filter((post) => !prev.some((p) => p.id === post.id));
          return [...prev, ...newPosts];
        });
  
        setLimit(res.pagination.limit || limit);
        setTotalDocuments(res.pagination.totalDocuments || totalDocuments);
        setTotalPages(res.pagination.totalPages || totalPages);
  
        // Store nextCursor for the current page
        setNextCursorMap((prev) => new Map(prev).set(page, res.pagination.nextCursor || ""));
        setVisitedPages((prev) => new Set(prev).add(page));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    useEffect(() => {
      if (!visitedPages.has(pageNum)) {
        fetchPosts(pageNum);
      }
      
      const startIdx = (pageNum - 1) * limit;
      const endIdx = startIdx + limit;
      setCurrPosts(postsCache.slice(startIdx, endIdx));

      const newTotalPages = Math.ceil(postsCache.length / limit);

      // If the current page is now empty, navigate to the previous page
      if (pageNum > newTotalPages) {
        setPageNum(Math.max(1, newTotalPages)); // Ensures we don't go below page 1
      }
    
      setTotalPages(newTotalPages); // Update pagination display
    }, [pageNum, postsCache]);
    
  
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setPageNum(value);
    };
  
    // Handle form submission
    const handleSubmit = async () => {
      let newPost: BlogPost = {
        title,
        text,
        author,
        tags: tags.split(",").map((tag) => tag.trim()),
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
            datetime: responseData.datetime,
          };
          addPost(newPost);
          setOpen(false);
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
          method: "DELETE",
        });
  
        if (res.ok) {
          removePost(postId);
          setTotalDocuments((prev) => prev - 1);
          if ((currPosts.length === 1 || currPosts.length === 0) && pageNum > 1) {
            setPageNum((prev) => prev - 1);
          }
          setSnackbarMsg("Post deleted successfully!");
          setOpenSnackbar(true);
        }
      } catch (err) {
        console.error("Error trying to delete post:", err);
      }
    };
  
    return (
      <Container>
        <Typography variant="h3" gutterBottom>Blog Posts</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Create New Post
        </Button>
  
        <Grid2 container spacing={3} sx={{ mt: 2 }}>
          {currPosts && currPosts.length > 0 ? (
            currPosts.map((post: BlogPost) => (
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

        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            mt: 3, 
            width: "100%" 
          }}
        >
          <Pagination 
            count={totalPages} 
            page={pageNum} 
            onChange={handlePageChange} 
            sx={{
              "& .MuiPaginationItem-root": { fontSize: { xs: "0.75rem", sm: "1rem" } } // Smaller font on small screens
            }}
          />
        </Box>

  
        {/* Create Post Modal */}
        <BlogModal
          open={open}
          onClose={() => setOpen(false)}
          modalTitle = "Create New Post"
          title={title}
          author={author}
          text={text}
          tags={tags}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setText={setText}
          setTags={setTags}
          handleSubmit={handleSubmit}
          />
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
