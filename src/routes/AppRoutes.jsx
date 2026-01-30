import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../src/screens/Dashboard";
import { AddNewProject } from "../../src/screens/AddNewProject";
import { DemandProjectMonth } from "../../src/screens/DemandPlanning";
import { ImportProfilesData } from "../../src/screens/ImportProfile";
import { AddNewProjectSpreadsheet } from "../../src/screens/AddProjectSpreadsheet";
import Layout from "../../src/screens/components/Layout";
import ProtectedRoute from "../../src/screens/components/ProtectedRoute";
import LoginPage from "../pages/Login";
import SignUpPage from "../pages/LoginSignUp";
import VerifyPage from "../pages/LoginVerify";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - NO sidebar, NO authentication */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify" element={<VerifyPage />} />

      {/* Protected routes - WITH sidebar AND authentication */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addNewProject" element={<AddNewProject />} />
        <Route path="/demand" element={<DemandProjectMonth />} />
        <Route path="/import-load-data" element={<ImportProfilesData />} />
        <Route path="/spreadsheet" element={<AddNewProjectSpreadsheet />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;