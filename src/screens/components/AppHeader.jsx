import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { logout, getCurrentUser } from "../utils/auth";

export default function AppHeader({
  showHamburger = false,
  showNotifications = false,
  breadcrumbs = [],
  onHamburgerClick,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Get current user info
  const currentUser = getCurrentUser();
  const userName = currentUser?.first_name || currentUser?.email || "User";

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout(); // Clear token and user data
    navigate("/"); // Redirect to login page
  };

  const handleProfile = () => {
    handleClose();
    // Navigate to profile page if you have one
    navigate("/import-load-data");
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#0288d1",
        borderBottom: 1,
        borderColor: "#78909c",
        boxShadow: 0,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "56px",
          px: 2,
        }}
      >
        {/* Left Side */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Hamburger Menu (optional) */}
          {showHamburger ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onHamburgerClick}
              sx={{ mr: 1 }}
            >
              <ListIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: 40 }} />
          )}

          {/* Logo */}
          <Box
            component="img"
            src="https://c.animaapp.com/dFM9GSxT/img/image-3@2x.png"
            alt="Logo"
            sx={{
              width: 40,
              height: 35.69,
              flexShrink: 0,
            }}
          />

          {/* Demand Planning Text */}
          <Stack spacing={0} sx={{ ml: 1 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="white"
              sx={{
                fontFamily: "Poppins, Helvetica",
                lineHeight: 1.2,
              }}
            >
              Demand Planning
            </Typography>
            <Typography
              variant="caption"
              color="white"
              sx={{
                fontFamily: "Poppins, Helvetica",
                lineHeight: 1,
              }}
            >
              Business Planner
            </Typography>
          </Stack>

          {/* Breadcrumbs (optional) */}
          {breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<ChevronRightIcon fontSize="small" />}
              sx={{
                ml: 3,
                color: "white",
                "& .MuiTypography-root": {
                  color: "white",
                  fontSize: "14px",
                },
              }}
            >
              {breadcrumbs.map((crumb, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="inherit"
                  sx={{
                    cursor: crumb.onClick ? "pointer" : "default",
                    "&:hover": crumb.onClick
                      ? { textDecoration: "underline" }
                      : {},
                  }}
                  onClick={crumb.onClick}
                >
                  {crumb.label}
                </Typography>
              ))}
            </Breadcrumbs>
          )}
        </Stack>

        {/* Right Side */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Search Icon */}
          <IconButton color="inherit">
            <SearchIcon sx={{ width: 20, height: 20 }} />
          </IconButton>

          {/* Notification Icon (optional) */}
          {showNotifications && (
            <IconButton color="inherit">
              <NotificationsIcon sx={{ width: 20, height: 20 }} />
            </IconButton>
          )}

          {/* User Avatar with Dropdown */}
          <IconButton
            onClick={handleAvatarClick}
            sx={{ p: 0 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src="https://c.animaapp.com/dFM9GSxT/img/ellipse@2x.png"
              alt="User"
              sx={{
                width: 35,
                height: 35,
                cursor: "pointer",
                border: open ? "2px solid white" : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  border: "2px solid white",
                  transform: "scale(1.05)",
                },
              }}
            />
          </IconButton>
        </Stack>
      </Toolbar>

      {/* User Menu Dropdown */}
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            minWidth: 200,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
            {userName}
          </Typography>
          {currentUser?.email && (
            <Typography variant="caption" color="text.secondary">
              {currentUser.email}
            </Typography>
          )}
          {currentUser?.account_number && (
            <Typography variant="caption" color="text.secondary" display="block">
              Account: {currentUser.account_number}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Profile Option (optional) */}
        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <Divider />

        {/* Logout Option */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: "error.main",
            "&:hover": {
              bgcolor: "error.lighter",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}