const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Make authenticated API request
 * @param {String} endpoint - API endpoint (e.g., '/projects')
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle token expiration or unauthorized
    if (response.status === 401) {
      // Clear storage and redirect to login
      localStorage.clear();
      window.location.href = "/";
      throw new Error(data.message || "Session expired. Please login again.");
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

// Convenience methods
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

export default api;