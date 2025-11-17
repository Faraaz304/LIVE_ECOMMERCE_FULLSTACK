'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8084';

export const useAuth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearMessages = () => {
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const executeAuthRequest = async (endpoint, data) => {
    clearMessages();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const responseText = await response.text();
      let result = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn(`Backend responded with non-JSON text on ${endpoint}:`, responseText, parseError);
          throw new Error(`Server responded unexpectedly. Please try again. (Raw response: ${responseText.substring(0, 100)})`);
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || `Operation failed. Server error: ${response.status} ${response.statusText}.`);
      }

      // Store JWT token in a cookie
      if (result && result.token) {
        document.cookie = `accessToken=${result.token}; path=/; max-age=86400; SameSite=Lax; HttpOnly=false`; // Consider HttpOnly=true for better security if only used by server-side, but client needs it here. SameSite=Lax is a good default.
        // For development, you might set secure: false, but in production, it should be true.
        // Example with secure and httpOnly (for server-only access):
        // document.cookie = `accessToken=${result.token}; path=/; max-age=86400; SameSite=Lax; HttpOnly; Secure`;
      }


      // Store non-sensitive user details in localStorage
      if (result && result.email && result.role) {
        localStorage.setItem('userEmail', result.email);
        localStorage.setItem('userRole', result.role);
      }

      setSuccessMessage(`${endpoint === 'login' ? 'Login' : 'Registration'} successful!`);
      return result; // Return the full result including token, email, role
    } catch (err) {
      console.error(`Error during ${endpoint}:`, err);
      setSubmitError(err.message || `An unknown error occurred during ${endpoint}.`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = async (email, password) => {
    return executeAuthRequest('login', { email, password });
  };

  const register = async (username, email, password, role) => {
    return executeAuthRequest('register', { username, email, password, role });
  };

  return {
    login,
    register,
    isSubmitting,
    submitError,
    successMessage,
    clearMessages, // Allows clearing messages manually if needed
  };
};