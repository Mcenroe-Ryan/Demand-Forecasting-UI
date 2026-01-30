import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";

const AuthPages = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default AuthPages;