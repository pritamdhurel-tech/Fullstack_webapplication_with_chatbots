import { useState, useEffect } from "react";

export function buildApiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const configuredBase = import.meta.env.VITE_API_URL?.trim();

  if (import.meta.env.DEV && !configuredBase) {
    return normalizedPath;
  }

  const base = (
    configuredBase ||
    "https://fullstack-webapplication-with-chatbots.onrender.com"
  ).replace(/\/+$/, "");

  if (!base) return normalizedPath;

  if (base.endsWith("/api") && normalizedPath.startsWith("/api")) {
    return `${base}${normalizedPath.slice(4)}`;
  }

  return `${base}${normalizedPath}`;
}

export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(buildApiUrl(url))
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
