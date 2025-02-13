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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router"; 

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/" }
  ];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#c5d8df", width: "100%" }}>
      <Toolbar>
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.jpg" alt="Logo" style={{ height: "40px", width: "auto" }} />
          <Typography 
            variant="h6" 
            sx={{ marginLeft: 1, fontWeight: "bold", color: "black" }}
          >
            Go Blog
          </Typography>
        </Box>

        {/* Pushes menu items to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
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
                        backgroundColor: location.pathname === item.path ? "#c5d8df" : "inherit",
                        color: location.pathname === item.path ? "black" : "white",
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
          <Box>
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: location.pathname === item.path ? "black" : "white",
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
  );
};

export default Navbar;
