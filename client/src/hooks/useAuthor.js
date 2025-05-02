import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

export function useAuthor(authorId) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authorId) {
      setLoading(false);
      return;
    }

    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/authors/${authorId}`);
        setAuthor(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);

  return { author, loading, error };
}