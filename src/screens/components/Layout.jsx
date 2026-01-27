import React, { useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { useLocation, Outlet } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import SideNavBar from "./Sidebar";

const Layout = () => {
  const location = useLocation();
  const sidebarRoutes = [
    "/dashboard",
    "/addNewProject",
    "/demand",
    "/import-load-data",
    "/spreadsheet",
  ];
  const showSidebar = sidebarRoutes.includes(location.pathname);

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const blurStyle = sidebarOpen
    ? { filter: "blur(6px)", transition: "filter 0.3s" }
    : {};

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      {showSidebar && (
        <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {showSidebar && sidebarOpen && (
        <Box
          onClick={() => setSidebarOpen(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.2)",
            zIndex: 1199,
            backdropFilter: "blur(6px)",
          }}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto",
          position: "relative",
          fontWeight: 500,
        }}
        style={blurStyle}
      >
        {showSidebar && !sidebarOpen && (
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 1300,
              bgcolor: "#fff",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "#fff",
              },
            }}
          >
            <ListIcon />
          </IconButton>
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;