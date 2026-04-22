import { useState, useCallback, useRef, useEffect } from "react";

const API_URL =
    "https://aieu3n5qqs247es3gr36nzoese0mlfdw.lambda-url.us-east-2.on.aws/";
const POLL_INTERVAL = 2500;
const MAX_POLLS = 12;

export function useRecommendations() {
    const [movies, setMovies] = useState([]);
    const [status, setStatus] = useState("IDLE");
    const [error, setError] = useState(null);
    const [processInfo, setProcessInfo] = useState({
        usernameFound: false,
        movieCount: 0,
    });

    const pollCount = useRef(0);
    const pollTimer = useRef(null);
    const abortControllerRef = useRef(null);
    const isActiveRef = useRef(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isActiveRef.current = false;
            if (pollTimer.current) clearTimeout(pollTimer.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const fetchRecommendations = useCallback(async (username) => {
        // Cancel any in-flight requests / polls
        isActiveRef.current = false;
        if (pollTimer.current) clearTimeout(pollTimer.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        // Reset state
        pollCount.current = 0;
        setError(null);
        setMovies([]);
        setStatus("LOADING");
        setProcessInfo({ usernameFound: false, movieCount: 0 });

        // Mark this run as active
        isActiveRef.current = true;

        const poll = async () => {
            if (!isActiveRef.current) return;

            abortControllerRef.current = new AbortController();

            try {
                const res = await fetch(
                    `${API_URL}?username=${encodeURIComponent(username)}`,
                    { signal: abortControllerRef.current.signal }
                );

                if (!isActiveRef.current) return;

                if (res.status === 429) {
                    setStatus("ERROR");
                    setError("System busy. Retrying in 10s...");
                    pollTimer.current = setTimeout(poll, 10000);
                    return;
                }

                const data = await res.json();

                if (!isActiveRef.current) return;

                if (data.status === "ERROR") {
                    setStatus("ERROR");
                    setError(data.error || "User not found.");
                    return;
                }

                if (res.status === 202 || data.status === "LOADING") {
                    setStatus("LOADING");
                    setProcessInfo({
                        usernameFound: data.username_found || false,
                        movieCount: data.movie_count || 0,
                    });

                    pollCount.current += 1;
                    if (pollCount.current < MAX_POLLS) {
                        pollTimer.current = setTimeout(poll, POLL_INTERVAL);
                    } else {
                        setStatus("ERROR");
                        setError("Request timed out.");
                    }
                    return;
                }

                if (res.status === 200 || data.status === "COMPLETE") {
                    setMovies(data.recommendations || []);
                    setProcessInfo((prev) => ({
                        ...prev,
                        movieCount: data.movie_count || prev.movieCount,
                    }));
                    setStatus("COMPLETE");
                    return;
                }
            } catch (err) {
                if (err.name === "AbortError") return;

                // Ignore browser extension message channel errors
                if (err.message?.includes("message channel closed")) return;

                if (!isActiveRef.current) return;

                setStatus("ERROR");
                setError("Connection lost.");
            }
        };

        poll();
    }, []);

    return { movies, status, error, processInfo, fetchRecommendations };
}