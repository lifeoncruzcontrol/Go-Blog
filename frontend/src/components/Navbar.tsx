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
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router";

// Dummy pages
const Home = () => <h2>Home Page</h2>;
const About = () => <h2>About Page</h2>;

// Component for Navbar
const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation(); // Get current path

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
  ];

  return (
    <>
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
            /* Mobile Menu */
            <>
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                  {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={handleDrawerToggle}
                        sx={{
                          backgroundColor: location.pathname === item.path ? "#424242" : "inherit",
                          color: location.pathname === item.path ? "white" : "inherit",
                        }}
                      >
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            /* Desktop Menu */
            <Box>
              {menuItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    color: location.pathname === item.path ? "#ffcc00" : "white",
                    fontWeight: location.pathname === item.path ? "bold" : "normal",
                    marginRight: "20px",
                  }}
                >
                  {item.text}
                </Link>
              ))}
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
    </>
  );
};

// Wrap Navbar inside Router
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
    </Router>
  );
};

export default App;
