import { useState, useCallback, useRef } from "react";

const API_URL =
  "https://aieu3n5qqs247es3gr36nzoese0mlfdw.lambda-url.us-east-2.on.aws/";
const POLL_INTERVAL = 4000;
const MAX_POLLS = 30;

export function useRecommendations() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("IDLE"); // IDLE | LOADING | PENDING | COMPLETE | STALE | ERROR
  const [error, setError] = useState(null);
  const pollCount = useRef(0);
  const pollTimer = useRef(null);

  const stopPolling = () => {
    if (pollTimer.current) clearTimeout(pollTimer.current);
  };

  const fetchRecommendations = useCallback(async (username) => {
    stopPolling();
    pollCount.current = 0;
    setError(null);
    setMovies([]);
    setStatus("LOADING");
    console.log("[useRecommendations] Starting fetch for username:", username);

    const poll = async () => {
      console.log(
        `[useRecommendations] Polling... attempt ${pollCount.current + 1}`
      );
      try {
        const res = await fetch(
          `${API_URL}?username=${encodeURIComponent(username)}`
        );
        console.log("[useRecommendations] Response status:", res.status);

        const data = await res.json();
        console.log("[useRecommendations] Response body:", data);

        if (res.status === 202 || data.status === "PENDING") {
          setStatus("PENDING");
          pollCount.current += 1;
          if (pollCount.current >= MAX_POLLS) {
            console.log("[useRecommendations] Max polls reached, giving up.");
            setStatus("ERROR");
            setError("Timed out waiting for results. Try again.");
            return;
          }
          pollTimer.current = setTimeout(poll, POLL_INTERVAL);
          return;
        }

        if (res.status === 200) {
          console.log("[useRecommendations] Received movies:", data.movies);
          setMovies(data.movies || []);
          setStatus(data.status === "STALE" ? "STALE" : "COMPLETE");
          return;
        }

        console.log("[useRecommendations] Unexpected response:", res.status, data);
        setStatus("ERROR");
        setError(data.error || "Something went wrong.");
      } catch (err) {
        console.error("[useRecommendations] Fetch error:", err);
        setStatus("ERROR");
        setError("Failed to reach the API. Please try again.");
      }
    };

    poll();
  }, []);

  return { movies, status, error, fetchRecommendations };
}