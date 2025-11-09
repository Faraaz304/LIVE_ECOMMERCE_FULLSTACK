'use client';
import { useState } from 'react';

const useUpdateResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateResource = async (url, payload = {}, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      let requestOptions = { method: 'PUT' };
      let finalUrl = url;

      // If query params are provided (e.g. ?status=cancelled)
      if (options.queryParams) {
        const query = new URLSearchParams(options.queryParams).toString();
        finalUrl += `?${query}`;
      }

      // Handle file upload vs normal JSON
      if (options.isFormData) {
        const formData = new FormData();

        // If product data is provided, stringify and append
        if (payload.product) {
          formData.append('product', JSON.stringify(payload.product));
        }

        // If image file is provided, append it
        if (payload.image) {
          formData.append('image', payload.image);
        }

        requestOptions.body = formData;
      } else {
        requestOptions.headers = {
          'Content-Type': 'application/json',
        };
        requestOptions.body = JSON.stringify(payload);
      }

      const res = await fetch(finalUrl, requestOptions);
      if (!res.ok) throw new Error('Update failed');
      const result = await res.json();

      setData(result);
      return result;
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateResource, data, loading, error };
};

export default useUpdateResource;
