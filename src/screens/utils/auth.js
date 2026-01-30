// utils/auth.js
export const logout = () => {
  // Clear all stored data
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_data");
  localStorage.removeItem("account_number");
  
  // Redirect to login
  window.location.href = "/";
};

// Get current user
export const getCurrentUser = () => {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();
  return !!(token && user);
};