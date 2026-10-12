import { useState, useEffect } from "react";

export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        if (active) setResult({ url, data, error: null });
      })
      .catch((err) => {
        if (active) setResult({ url, data: null, error: err.message });
      });
    return () => { active = false; controller.abort(); };
  }, [url]);
  return result.url === url
    ? { data: result.data, error: result.error, isLoading: false }
    : { data: null, error: null, isLoading: true };
}
