// MovieGrid.jsx
import styles from "./MovieGrid.module.css";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies, status, error }) {
    if (!status || status === "IDLE") return null;

    return (
        <section className={styles.section}>
            {(status !== "ERROR" && (movies?.length > 0 || status === "LOADING")) && (
                <h2 className={styles.heading}>Your Movie Suggestions</h2>
            )}

            {status === "ERROR" && <div className={styles.error}>{error}</div>}

            {(status === "COMPLETE" || status === "STALE") && movies?.length > 0 && (
                <div className={styles.grid}>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id ?? movie.slug} movie={movie} />
                    ))}
                </div>
            )}

            {status === "COMPLETE" && movies?.length === 0 && (
                <div className={styles.empty}>No recommendations found.</div>
            )}
        </section>
    );
}