import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1E1E2F", boxShadow: 3, maxHeight:"200vh", maxWidth:'1000vh' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}>
          AI-Powered Honeypot
        </Typography>
        <List sx={{ display: "flex" }}>
          <ListItem button component={Link} to="/" sx={{ color: "white" }}>
            <ListItemText primary="Home" sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem button component={Link} to="/about" sx={{ color: "white" }}>
            <ListItemText primary="About" sx={{ textAlign: "center" }} />
          </ListItem>
        </List>
      </Toolbar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/about" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}
