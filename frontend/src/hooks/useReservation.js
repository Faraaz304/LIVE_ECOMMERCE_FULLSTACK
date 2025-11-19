import { useState, useCallback } from 'react';

const BASE_URL = 'http://localhost:8088/api/reservations';

export const useReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Helper: Transform API Data to UI Structure ---
  const transformReservationData = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map(item => {
      // Construct a valid ISO Date string from 'date' and 'time'
      // API Date: "2025-11-20", Time: "2:30 PM"
      let constructedStartTime = null;
      
      if (item.date && item.time) {
        try {
          const [timePart, modifier] = item.time.split(' '); // ["2:30", "PM"]
          if (timePart && modifier) {
            let [hours, minutes] = timePart.split(':').map(Number);

            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const d = new Date(item.date);
            d.setHours(hours, minutes, 0);
            constructedStartTime = d.toISOString();
          }
        } catch (e) {
          console.warn("Error parsing date/time for reservation:", item.id);
        }
      }

      return {
        id: item.id,
        // Generate a display ID
        bookingId: `RES-${String(item.id).padStart(6, '0')}`, 
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        customerEmail: item.customerEmail,
        // Format productIds for display since names aren't in this API
        productName: item.productIds ? `Item IDs: ${item.productIds}` : 'No Products', 
        // API doesn't return people count in list, defaulting to 1
        people: item.people || 1, 
        // API doesn't return status, defaulting to Pending
        status: item.status || 'Pending', 
        startTime: constructedStartTime, 
        // End time approximated (+30 mins) for display sorting
        endTime: constructedStartTime, 
        createdAt: item.createdAt
      };
    });
  };

  // --- GET: Fetch All Reservations ---
  const getAllReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const formattedData = transformReservationData(data);
      setReservations(formattedData);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- POST: Create Reservation ---
  const createReservation = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error("Failed to create reservation:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reservations,
    isLoading,
    error,
    getAllReservations,
    createReservation
  };
};