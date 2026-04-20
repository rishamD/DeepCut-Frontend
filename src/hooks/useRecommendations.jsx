import { useState, useCallback, useRef } from "react";

const API_URL = "https://aieu3n5qqs247es3gr36nzoese0mlfdw.lambda-url.us-east-2.on.aws/";
const POLL_INTERVAL = 4000;
const MAX_POLLS = 30;

export function useRecommendations() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("IDLE"); 
  const [error, setError] = useState(null);
  const pollCount = useRef(0);
  const pollTimer = useRef(null);

  const fetchRecommendations = useCallback(async (username) => {
    if (pollTimer.current) clearTimeout(pollTimer.current);
    pollCount.current = 0;
    setError(null);
    setMovies([]);
    setStatus("LOADING");

    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        // Keep 202 logic: If still processing, wait and poll again
        if (res.status === 202 || data.status === "processing") {
          setStatus("PENDING");
          pollCount.current += 1;
          if (pollCount.current < MAX_POLLS) {
            pollTimer.current = setTimeout(poll, POLL_INTERVAL);
          } else {
            setStatus("ERROR");
            setError("Request timed out.");
          }
          return;
        }

        if (res.status === 200) {
          setMovies(data.recommendations || []);
          setStatus("COMPLETE");
          return;
        }

        setStatus("ERROR");
        setError(data.error || "Unknown error occurred.");
      } catch (err) {
        setStatus("ERROR");
        setError("Network error.");
      }
    };

    poll();
  }, []);

  return { movies, status, error, fetchRecommendations };
}