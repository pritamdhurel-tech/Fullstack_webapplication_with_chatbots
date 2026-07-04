import { useState, useEffect } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fullstack-webapplication-with-chatbots.onrender.com";

export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(`${API_URL}${url}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(Array.isArray(json) ? json : (json.data ?? []));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
