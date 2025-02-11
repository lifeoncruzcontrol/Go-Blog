import { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import BlogPost from "../interfaces/BlogPost";
import GetPostsResponse from "../interfaces/GetPostsResponse";

const History: React.FC = () => {
  const [posts, setPosts] = useState<GetPostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {    
      try {
          const res = await fetch("http://127.0.0.1:8080/posts", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (!res.ok) {
            throw new Error("Failed to fetch posts")
          }

          const data: GetPostsResponse = await res.json();

          setPosts(data);

        } catch (err: any) {
          console.error("Error fetching posts:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchPosts();
  }, []);
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Container>
      <Typography variant="h3" gutterBottom>Blog Posts</Typography>
      <Grid2 container spacing={3}>
        {posts && posts.data.length > 0 ? (
          posts.data.map((post: BlogPost) => (
            <Grid2 item xs={12} sm={6} md={4} key={post._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>{post.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{post.username}</Typography>
                  <Typography variant="body2">{new Date(post.dateTime).toDateString()}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>{post.text.substring(0, 100)}...</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))
        ) : (
          <Typography>No blog posts found.</Typography>
        )}
      </Grid2>
    </Container>
  );
};

export default History;