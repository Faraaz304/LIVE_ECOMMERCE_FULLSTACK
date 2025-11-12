// hooks/useDelete.js
import { useState } from "react";


export const useDelete = (baseUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Failed to delete item from ${baseUrl}/${id}`);

      // If your API returns a message (like "Product deleted successfully")
      const text = await res.text();
      setSuccess(true);
      return text;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error, success };
};
