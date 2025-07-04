import React from "react";
import { NavLink } from "react-router";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Home,
  Description,
  Work,
  Mail,
  GitHub,
  LinkedIn,
  PhoneAndroid,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ContactNumber } from "../_core/APP/Global/contactConstant";

const drawerWidth = 280;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  width: "100%",
  "&.active .MuiListItemButton-root": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&.MuiListItemIcon-root": {
      color: theme.palette.common.white,
    },
  },
}));

const Sidebar = () => {
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Resume", icon: <Description />, path: "/resume" },
    { text: "Portfolio", icon: <Work />, path: "/portfolio" },
    { text: "Contact", icon: <Mail />, path: "/contact" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src="https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/Profile_photo.jpeg"
          alt="Nikhil Masurkar"
          sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }}
        />
        <Typography variant="h5" fontWeight="bold" align="center">
          Nikhil Masurkar
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          gutterBottom
        >
          React/React Native Developer
        </Typography>

        <Box sx={{ display: "flex", mt: 1 }}>
          <IconButton
            href={ContactNumber.dailLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Phone"
          >
            <PhoneAndroid />
          </IconButton>

          <IconButton
            href="https://github.com/nikhilmasurkar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHub />
          </IconButton>

          <IconButton
            href="https://www.linkedin.com/in/nikhil-masurkar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            color="primary"
          >
            <LinkedIn />
          </IconButton>
        </Box>
      </Box>

      <Divider />
      <List sx={{ mt: 2, width: "100%", flex: 1, p: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text}>
            <StyledNavLink to={item.path} end={item.path === "/"}>
              <ListItemButton
                sx={{ py: 1.5, width: "100%", borderRadius: "7px" }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </StyledNavLink>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
