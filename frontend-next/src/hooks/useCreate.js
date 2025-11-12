// hooks/useCreate.js
import { useState } from "react";

export const useCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const createItem = async (url, data, isFormData = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: isFormData
          ? {} // No need to manually set multipart header
          : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Failed to create item`);
      const result = await res.json();
      setResponse(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createItem, loading, error, response };
};
