import { useState, useCallback } from "react";

export const useStream = () => {
  const [streams, setStreams] = useState([]); // List of streams
  const [currentStream, setCurrentStream] = useState(null); // specific stream details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================================
  // 1. GET ALL STREAMS (Matches your route.js GET list)
  // ==========================================================
  const getStreams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming your list route is at /api/streams
      const response = await fetch("/api/youtube/streams");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch streams");
      }

      setStreams(data.streams || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // 2. GET SINGLE STREAM (Matches your [id]/route.js GET)
  // ==========================================================
  const getStreamById = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      // Assuming your detail route is at /api/streams/[id]
      const response = await fetch(`/api/youtube/streams/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stream details");
      }

      setCurrentStream(data.stream);
      return data.stream;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // 3. CREATE STREAM (Matches your route.js POST)
  // ==========================================================
  const createStream = useCallback(async ({ title, description, location }) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming your create route is at /api/streams
      const response = await fetch("/api/youtube/streams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          location, // { lat: number, lng: number }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create stream");
      }

      return data; // Returns { broadcastId, streamSettings, etc. }
    } catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    streams,
    currentStream,
    loading,
    error,
    getStreams,
    getStreamById,
    createStream,
  };
};

export default useStream;