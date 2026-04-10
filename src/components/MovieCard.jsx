import { useState } from "react";
import styles from "./MovieCard.module.css";

/**
 * GENERATE URL HELPER
 * Ensures the ID and Slug are separated correctly and allows dynamic sizing
 */
const generateLtrbxdUrl = (filmId, slug, w, h) => {
  const filmIdStr = String(filmId);
  const idPath = filmIdStr.split("").join("/");
  // Note: the dash between filmIdStr and slug is required for Ltrbxd CDN
  return `https://a.ltrbxd.com/resized/film-poster/${idPath}/${filmIdStr}-${slug}-0-${w}-0-${h}-crop.jpg`;
};

function parseDisplayName(displayName) {
  if (!displayName) return { title: null, year: null };
  const match = displayName.match(/^(.+?)\s+\((\d{4})\)$/);
  if (match) return { title: match[1], year: match[2] };
  return { title: displayName, year: null };
}

function StarRating({ rating }) {
  const totalStars = 5;
  const numRating = parseFloat(rating);

  return (
    <div className={styles.starsContainer}>
      <div className={styles.stars}>
        {[...Array(totalStars)].map((_, index) => {
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
      <span className={styles.ratingNum}>{numRating}</span>
    </div>
  );
}

export default function MovieCard({ movie, isFocused }) {
  const { filmId, slug, displayName, rating } = movie;
  const { title, year } = parseDisplayName(displayName);
  
  /**
   * FALLBACK STATE
   * 0: Original Slug (w/ Year)
   * 1: Clean Slug (No Year)
   * 2: High Res (1000px)
   * 3: Max Res (2000px)
   */
  const [attempt, setAttempt] = useState(0);

  const getActiveUrl = () => {
    const cleanSlug = slug;

    switch (attempt) {
      case 0: return generateLtrbxdUrl(filmId, slug, 1000, 1500);
      case 1: return generateLtrbxdUrl(filmId, cleanSlug, 1000, 1500);
      case 2: return generateLtrbxdUrl(filmId, cleanSlug, 2000, 3000);
      default: return "/poster-placeholder2.jpg";
    }
  };

  const activeUrl = getActiveUrl();

  const handleImageError = () => {
    if (attempt < 3) {
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
        href={`https://letterboxd.com/film/${slug}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.posterWrapper}>
          <img
            // Key forces React to replace the element on error to trigger new network request
            key={`${filmId}-${attempt}`}
            src={activeUrl}
            alt={title ?? slug}
            onError={handleImageError}
            // Performance: Eager for centered card, Lazy for others
            loading={isFocused ? "eager" : "lazy"}
            // React attribute for fetchpriority
            fetchPriority={isFocused ? "high" : "low"}
          />
        </div>
        <div className={styles.meta}>
          {(title || year) && (
            <p className={styles.metaTitle}>
              {title ?? slug}{" "}
              {year && <span className={styles.metaYear}>({year})</span>}
            </p>
          )}
          {rating && <StarRating rating={rating} />}
        </div>
      </a>
    </div>
  );
}