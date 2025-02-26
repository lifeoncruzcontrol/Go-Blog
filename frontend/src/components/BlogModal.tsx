import React from "react";
import {
  Modal,
  Typography,
  Box,
  TextField,
  Button
} from "@mui/material";

// Define the props interface
interface BlogModalProps {
  open: boolean;
  onClose: () => void;
  modalTitle: string;
  title: string;
  author: string;
  text: string;
  tags: string;
  setTitle: (value: string) => void;
  setAuthor: (value: string) => void;
  setText: (value: string) => void;
  setTags: (value: string) => void;
  handleSubmit: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ 
  open, 
  onClose, 
  modalTitle,
  title, 
  author, 
  text, 
  tags, 
  setTitle, 
  setAuthor, 
  setText, 
  setTags, 
  handleSubmit 
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "background.paper", mx: "auto", mt: 10, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{modalTitle}</Typography>
        <TextField label="Title" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Author" fullWidth sx={{ mb: 2 }} value={author} onChange={(e) => setAuthor(e.target.value)} />
        <TextField label="Text" multiline rows={4} fullWidth sx={{ mb: 2 }} value={text} onChange={(e) => setText(e.target.value)} />
        <TextField label="Tags (comma-separated)" fullWidth sx={{ mb: 2 }} value={tags} onChange={(e) => setTags(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default BlogModal;