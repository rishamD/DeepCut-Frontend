import { useState, useCallback, useRef, useEffect } from "react";

const API_URL = "https://aieu3n5qqs247es3gr36nzoese0mlfdw.lambda-url.us-east-2.on.aws/";
const POLL_INTERVAL = 4000; 
const MAX_POLLS = 45;

export function useRecommendations() {
    const [movies, setMovies] = useState([]);
    const [status, setStatus] = useState("IDLE");
    const [error, setError] = useState(null);
    const [processInfo, setProcessInfo] = useState({
        usernameFound: false,
        movieCount: 0
    });

    const pollCount = useRef(0);
    const pollTimer = useRef(null);
    const abortControllerRef = useRef(null); // Added for request cancellation

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollTimer.current) clearTimeout(pollTimer.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const fetchRecommendations = useCallback(async (username) => {
        // Reset everything
        if (pollTimer.current) clearTimeout(pollTimer.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
        
        pollCount.current = 0;
        setError(null);
        setMovies([]);
        setStatus("LOADING");
        setProcessInfo({ usernameFound: false, movieCount: 0 });

        const poll = async () => {
            // Create a new controller for this specific poll attempt
            abortControllerRef.current = new AbortController();

            try {
                const res = await fetch(`${API_URL}?username=${encodeURIComponent(username)}`, {
                    signal: abortControllerRef.current.signal
                });
                
                if (res.status === 429) {
                    setStatus("ERROR");
                    setError("System busy. Retrying in 10s...");
                    // Auto-recover from 429 by waiting longer
                    pollTimer.current = setTimeout(poll, 10000);
                    return;
                }

                const data = await res.json();

                if (data.status === "ERROR") {
                    setStatus("ERROR");
                    setError(data.error || "User not found.");
                    return;
                }

                if (res.status === 202 || data.status === "LOADING") {
                    setStatus("LOADING");
                    setProcessInfo({
                        usernameFound: data.username_found || false,
                        movieCount: data.movie_count || 0
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
                    setProcessInfo(prev => ({ ...prev, movieCount: data.movie_count || prev.movieCount }));
                    setStatus("COMPLETE");
                    return;
                }

            } catch (err) {
                if (err.name === 'AbortError') return; // Ignore intentional cancellations
                setStatus("ERROR");
                setError("Connection lost.");
            }
        };

        poll();
    }, []);

    return { movies, status, error, processInfo, fetchRecommendations };
}