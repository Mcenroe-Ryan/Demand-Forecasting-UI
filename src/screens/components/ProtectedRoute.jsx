import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user_data = localStorage.getItem("user_data");

  // If no token or user_data, redirect to login
  if (!token || !user_data) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;