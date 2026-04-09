// SearchBar.jsx
import { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSubmit, loading }) {
    const [username, setUsername] = useState("");
    const [dims, setDims] = useState({ width: 0, height: 0 });
    const rowRef = useRef(null);

    useEffect(() => {
        const update = () => {
            if (rowRef.current) {
                setDims({
                    width: rowRef.current.offsetWidth,
                    height: rowRef.current.offsetHeight,
                });
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (trimmed) onSubmit(trimmed);
    };

    // The radius for the pill shape
    const r = dims.height / 2;

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputRow} ref={rowRef}>
                <svg
                    className={styles.borderSvg}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            id="borderGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#5257e5" />
                            <stop offset="25%" stopColor="#597ae4" />
                            <stop offset="50%" stopColor="#619de3" />
                            <stop offset="75%" stopColor="#68c0e2" />
                            <stop offset="100%" stopColor="#6fe3e1" />
                        </linearGradient>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        rx={r}
                        ry={r}
                        fill="none"
                        stroke="url(#borderGradient)"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter Your Letterboxd Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
                <button
                    className={styles.button}
                    type="submit"
                    disabled={loading || !username.trim()}
                >
                    {loading ? "Loading..." : "Get Recommendations"}
                </button>
            </div>
        </form>
    );
}