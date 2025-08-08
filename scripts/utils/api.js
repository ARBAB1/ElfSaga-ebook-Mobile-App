import axios from "axios";

// Define the base API URL
// const API_URL = "http://localhost:3001";
const API_URL = "https://talesfromthenorthpole.xyz:3001";

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login function
export const loginUser = async (username, password) => {
  try {
    console.log("Logging in with username:", username); // Log the username for debugging
    // Make the POST request to the login endpoint
    const response = await api.post("/auth/login", { username, password });

    console.log("Login successful:", response); // Log the response data for debugging

    return response.data; // Return the response data (likely a token or user info)
  } catch (error) {
    // Improved error handling with specific checks
    if (error.response) {
      // Server responded with a status code outside 2xx range
      console.log("Server Response Error:", error.response);
      throw new Error(error.response.data?.message || "Login failed"); // Get specific error message from server
    } else if (error.request) {
      // The request was made, but no response was received
      console.log("No response from server:", error.request);
      throw new Error("Network error, please try again later.");
    } else {
      // Any other errors (e.g., setup issues with the request)
      console.log("Error setting up request:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

// Register function
export const registerUser = async (username, password) => {
  try {
    console.log(username);
    // Make the POST request to the register endpoint
    const response = await api.post("/auth/register", { username, password });

    return response.data; // Return the response data (likely a success message or user info)
  } catch (error) {
    // Improved error handling with specific checks
    if (error.response) {
      // Server responded with a status code outside 2xx range
      console.log("Server Response Error:", error.response);
      if (error.response?.data?.code === "ER_DUP_ENTRY") {
        alert("Email is already registered.");
      } else {
        alert("Registration failed. Please try again.");
      }
      throw new Error(error.response.data?.message || "Registration failed");
    } else if (error.request) {
      // The request was made, but no response was received
      console.log("No response from server:", error.request);
      throw new Error("Network error, please try again later.");
    } else {
      // Any other errors (e.g., setup issues with the request)
      console.log("Error setting up request:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
