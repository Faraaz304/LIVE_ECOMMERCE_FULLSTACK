// 'use client';

// import { useState } from 'react';

// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8084';

// export const useAuth = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const clearMessages = () => {
//     setSubmitError(null);
//     setSuccessMessage(null);
//   };

//   // Helper to handle Login and Register
//   const executeAuthRequest = async (endpoint, data) => {
//     clearMessages();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         credentials: 'include',
//       });

//       const responseText = await response.text();
//       let result = null;

//       if (responseText) {
//         try {
//           result = JSON.parse(responseText);
//         } catch (parseError) {
//           console.warn(`Backend responded with non-JSON text on ${endpoint}:`, responseText, parseError);
//           throw new Error(`Server responded unexpectedly. Please try again.`);
//         }
//       }

//       if (!response.ok) {
//         throw new Error(result?.message || `Operation failed. Server error: ${response.status}.`);
//       }

//       // --- SAVE DATA TO LOCAL STORAGE ---
//       if (result.userid) localStorage.setItem('userid', result.userid);
//       // We assume the backend returns a field called 'token' or 'jwt'. 
//       // Adjust 'token' below to match your actual backend response key.
//       if (result.token) localStorage.setItem('token', result.token); 

//       setSuccessMessage(`${endpoint === 'login' ? 'Login' : 'Registration'} successful!`);
//       return result; 
//     } catch (err) {
//       console.error(`Error during ${endpoint}:`, err);
//       setSubmitError(err.message || `An unknown error occurred during ${endpoint}.`);
//       return null;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const login = async (email, password) => {
//     return executeAuthRequest('login', { email, password });
//   };

//   const register = async (username, email, password, role) => {
//     return executeAuthRequest('register', { username, email, password, role });
//   };

//   // --- NEW FUNCTION: Get User By ID ---
//   const fetchUserById = async (id) => {
//     clearMessages();
//     setIsSubmitting(true);

//     try {
//       // Retrieve the token saved during login
//       const token = localStorage.getItem('token'); 

//       if (!token) {
//         throw new Error("No authentication token found. Please login first.");
//       }

//       const response = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Standard way to pass JWT is via Authorization header
//           'Authorization': `Bearer ${token}` 
//         },
//       });

//       const responseText = await response.text();
//       let result = null;

//       if (responseText) {
//         try {
//           result = JSON.parse(responseText);
//         } catch (parseError) {
//           throw new Error("Failed to parse server response.");
//         }
//       }

//       if (!response.ok) {
//         throw new Error(result?.message || `Failed to fetch user. Status: ${response.status}`);
//       }

//       return result; // Returns { id, username, email, password, role }
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//       setSubmitError(err.message);
//       return null;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return {
//     login,
//     register,
//     fetchUserById, // Exporting the new function
//     isSubmitting,
//     submitError,
//     successMessage,
//     clearMessages,
//   };
// };


'use client';

import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8084';

export const useAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearMessages = useCallback(() => {
    setSubmitError(null);
    setSuccessMessage(null);
  }, []);

  // --------------------------------------------------
  // SAVE refresh + access tokens from backend
  // --------------------------------------------------
  const saveTokens = (data) => {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    if (data.userid) localStorage.setItem('userid', data.userid);
  };

  // --------------------------------------------------
  // AUTO REFRESH TOKEN
  // --------------------------------------------------
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      return data.token;
    } catch (err) {
      console.error("Refresh failed:", err);
      return null;
    }
  };

  // --------------------------------------------------
  // LOGIN + REGISTER COMMON HANDLER
  // --------------------------------------------------
  const executeAuthRequest = async (endpoint, data) => {
    clearMessages();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok) {
        // Backend returns error in 'error' field
        const errorMessage = result?.error || "Authentication failed.";
        console.error(`${endpoint} failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      // Save tokens (access + refresh)
      saveTokens(result);

      setSuccessMessage(endpoint === "login" ? "Login successful!" : "Registration successful!");
      return result;
    } catch (err) {
      console.error(`Error in ${endpoint}:`, err);
      setSubmitError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = async (email, password) => {
    return executeAuthRequest("login", { email, password });
  };

  const register = async (username, email, password, role) => {
    return executeAuthRequest("register", { username, email, password, role });
  };

  // --------------------------------------------------
  // FETCH USER BY ID WITH AUTO TOKEN REFRESH
  // --------------------------------------------------
  const fetchUserById = async (id) => {
    clearMessages();
    setIsSubmitting(true);

    try {
      let token = localStorage.getItem("token");
      if (!token) throw new Error("No access token found. Please log in.");

      // First request
      let response = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      // If access token expired → try refresh token
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Session expired. Please login again.");

        // Retry with new access token
        response = await fetch(`${API_BASE_URL}/api/auth/user/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${newToken}` },
        });
      }

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(result?.error || "Failed to fetch user.");

      return result;
    } catch (err) {
      setSubmitError(err.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    register,
    fetchUserById,
    isSubmitting,
    submitError,
    successMessage,
    clearMessages
  };
};
