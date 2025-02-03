import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";

// Dummy pages
const Home = () => <h2>Home Page</h2>;
const About = () => <h2>About Page</h2>;

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#212121", width: "100%" }}>
        <Toolbar>
          {/* Logo Image (Left Aligned) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.jpg" alt="Logo" style={{ height: "40px", width: "auto" }} />
          </Box>

          {/* Pushes menu items to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            /* Mobile Menu Button */
            <>
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                  {["Home", "About"].map((text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton component={Link} to={index === 0 ? "/" : "/about"} onClick={handleDrawerToggle}>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            /* Desktop Menu */
            <Box>
              <Link to="/" style={{ textDecoration: "none", color: "white", marginRight: "20px" }}>
                Home
              </Link>
              <Link to="/about" style={{ textDecoration: "none", color: "white" }}>
                About
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ marginTop: "64px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default Navbar;
