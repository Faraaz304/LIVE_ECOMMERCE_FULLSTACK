// hooks/useFetchById.js
import { useState, useEffect } from "react";


export const useFetchById = (baseUrl, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchById = async () => {
    if (!id) return; // don't call if no ID
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch item from ${baseUrl}/${id}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch when ID changes
  useEffect(() => {
    fetchById();
  }, [id]);

  return { data, loading, error, refetch: fetchById };
};
