import React, { useState } from "react";
import { NavLink } from "react-router";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Description,
  Work,
  Mail,
  GitHub,
  LinkedIn,
  Close,
  PhoneAndroid,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ContactNumber } from "../_core/APP/Global/contactConstant";
import { useThemeMode } from "../_core/materialUIThemeProvider/ThemeProvider";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  "&.active .MuiListItemButton-root": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "& .MuiListItemIcon-root": {
      color: theme.palette.common.white,
    },
  },
}));

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDarkMode, toggleTheme, setDarkMode, setLightMode } = useThemeMode();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Resume", icon: <Description />, path: "/resume" },
    { text: "Portfolio", icon: <Work />, path: "/portfolio" },
    { text: "Contact", icon: <Mail />, path: "/contact" },
  ];

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Nikhil Masurkar
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 280 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={toggleDrawer(false)}>
              <Close />
            </IconButton>
          </Box>

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
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6" fontWeight="bold">
              Nikhil Masurkar
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
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

          {/* Theme Toggle Section */}
          <Box sx={{ p: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isDarkMode ? <DarkMode /> : <LightMode />}
                  <Typography variant="body2">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </Typography>
                </Box>
              }
            />
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={setLightMode}
                color={!isDarkMode ? "primary" : "default"}
                title="Light Mode"
              >
                <LightMode fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={setDarkMode}
                color={isDarkMode ? "primary" : "default"}
                title="Dark Mode"
              >
                <DarkMode fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <StyledNavLink
                  to={item.path}
                  end={item.path === "/"}
                  style={{ width: "100%" }}
                >
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </StyledNavLink>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
