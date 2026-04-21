import { useState } from "react";
import styles from "./MovieCard.module.css";

/**
 * URL FORMATTER
 * Takes the partial path from the model and replaces dimensions.
 */
const formatPosterUrl = (partialPath, width, height) => {
  if (!partialPath) return "/poster-placeholder2.jpg";

  const highResPath = partialPath.replace(
    /\d+-0-\d+-crop$/,
    `${width}-0-${height}-crop`
  );

  return `https://a.ltrbxd.com/resized/${highResPath}.jpg`;
};

function parseDisplayName(title, year) {
  return {
    displayTitle: title || "Unknown Title",
    displayYear: year ? Math.floor(year) : null,
  };
}

function StarRating({ rating }) {
  const totalStars = 5;
  // Ensure we are working with a number rounded to 1 decimal point
  const numRating = parseFloat(parseFloat(rating).toFixed(1));

  return (
    <div className={styles.starsContainer}>
      <div className={styles.stars}>
        {[...Array(totalStars)].map((_, index) => {
          // Calculate fill based on the 1-decimal rounded rating
          const fill = Math.min(Math.max(numRating - index, 0), 1) * 100;
          return (
            <div key={index} className={styles.starWrapper}>
              <span className={styles.starEmpty}>★</span>
              <span
                className={styles.starFilled}
                style={{ width: `${fill}%` }}
              >
                ★
              </span>
            </div>
          );
        })}
      </div>
      {/* Displaying the number with exactly 1 decimal point */}
      <span className={styles.ratingNum}>{numRating.toFixed(1)}</span>
    </div>
  );
}

export default function MovieCard({ movie, isFocused }) {
  const { movie_id, title, image_url, year, score } = movie;
  const { displayTitle, displayYear } = parseDisplayName(title, year);
  
  /**
   * FALLBACK STATE
   * 0: High Res (1000x1500)
   * 1: Ultra Res (2000x3000)
   */
  const [attempt, setAttempt] = useState(0);

  const getActiveUrl = () => {
    switch (attempt) {
      case 0: return formatPosterUrl(image_url, 1000, 1500);
      case 1: return formatPosterUrl(image_url, 2000, 3000);
      default: return "/poster-placeholder2.jpg";
    }
  };

  const activeUrl = getActiveUrl();

  const handleImageError = () => {
    if (attempt < 2) {
      setAttempt((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`${styles.cardWrapper} ${isFocused ? styles.isFocused : ""}`}
      style={{ "--poster-url": `url(${activeUrl})` }}
    >
      <div className={styles.themeShadow} />
      <a
        className={styles.card}
        href={`https://letterboxd.com/film/${movie_id}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.posterWrapper}>
          <img
            key={`${movie_id}-${attempt}`}
            src={activeUrl}
            alt={displayTitle}
            onError={handleImageError}
            loading={isFocused ? "eager" : "lazy"}
            fetchPriority={isFocused ? "high" : "low"}
          />
        </div>
        <div className={styles.meta}>
          <p className={styles.metaTitle}>
            {displayTitle}{" "}
            {displayYear && <span className={styles.metaYear}>({displayYear})</span>}
          </p>
          {/* Passing the raw score * 5 to the StarRating component */}
          <StarRating rating={score * 5} />
        </div>
      </a>
    </div>
  );
}