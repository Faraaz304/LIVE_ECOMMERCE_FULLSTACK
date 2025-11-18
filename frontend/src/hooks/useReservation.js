'use client';

import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8084'; // Ensure this matches your backend reservation service port if different from 8084

export const useReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(null); // For single reservation details
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearMessages = () => {
    setError(null);
  };

  const executeReservationRequest = useCallback(async (method, endpoint, data = null) => {
    clearMessages();
    setIsLoading(true);

    try {
      const config = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if required for your API
          // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Example if token stored in localStorage
          // For cookie-based auth, 'credentials: "include"' would send it automatically
        },
        credentials: 'include', // Important for sending cookies with the request
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}/api/reservations${endpoint}`, config);
      const responseText = await response.text();
      let result = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn(`Backend responded with non-JSON text on ${method} ${endpoint}:`, responseText, parseError);
          throw new Error(`Server responded unexpectedly. (Raw response: ${responseText.substring(0, 100)})`);
        }
      }

      if (!response.ok) {
        throw new Error(result?.message || `Reservation operation failed. Status: ${response.status} ${response.statusText}.`);
      }

      return result;
    } catch (err) {
      console.error(`Error during reservation operation (${method} ${endpoint}):`, err);
      setError(err.message || 'An unknown error occurred.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (reservationData) => {
    const result = await executeReservationRequest('POST', '', reservationData);
    if (result) {
      // Optionally update reservations state if you want real-time updates without re-fetching all
      // setReservations(prev => [...prev, result]);
      return { success: true, data: result };
    }
    return { success: false, error: error }; // 'error' state is already set by executeReservationRequest
  }, [executeReservationRequest, error]);

  const getAllReservations = useCallback(async () => {
    const result = await executeReservationRequest('GET', '');
    if (result) {
      setReservations(result);
      return { success: true, data: result };
    }
    return { success: false, error: error };
  }, [executeReservationRequest, error]);

  // Optional: Fetch a single reservation by ID if you have such an endpoint (e.g., /api/reservations/{id})
  const getReservationById = useCallback(async (id) => {
    const result = await executeReservationRequest('GET', `/${id}`);
    if (result) {
      setReservation(result);
      return { success: true, data: result };
    }
    setReservation(null);
    return { success: false, error: error };
  }, [executeReservationRequest, error]);


  return {
    reservations,
    reservation,
    isLoading,
    error,
    createReservation,
    getAllReservations,
    getReservationById, // Optional
    clearMessages,
  };
};