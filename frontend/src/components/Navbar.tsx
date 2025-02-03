import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#212121", width: "100%" }}>
        <Toolbar>
          {/* Logo Image (Left Aligned) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img 
              src="/logo.jpg"  // Update with your logo path
              alt="Logo"
              style={{ height: "40px", width: "auto" }} // Adjust size as needed
            />
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
                  {["Home", "About"].map((text) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton onClick={handleDrawerToggle}>
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
              <Button color="inherit">Home</Button>
              <Button color="inherit">About</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
