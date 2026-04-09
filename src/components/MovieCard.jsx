import { useState } from "react";
import styles from "./MovieCard.module.css";

function getPosterUrl(filmId, slug) {
  const filmIdStr = String(filmId);
  const filmIdPath = filmIdStr.split("").join("/");
  return `https://a.ltrbxd.com/resized/film-poster/${filmIdPath}/${filmIdStr}-${slug}-0-230-0-345-crop.jpg`;
}

function StarRating({ rating }) {
  const totalStars = 5;
  return (
    <div className={styles.starsContainer}>
      <div className={styles.stars}>
        {[...Array(totalStars)].map((_, index) => {
          const fill = Math.min(Math.max(rating - index, 0), 1) * 100;
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
      <span className={styles.ratingNum}>{rating}</span>
    </div>
  );
}

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);
  const { filmId, slug, title, rating, year } = movie;
  const posterUrl = getPosterUrl(filmId, slug);
  const activeUrl = imgError ? "/poster-placeholder2.jpg" : posterUrl;

  return (
    <div
      className={styles.cardWrapper}
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
            src={activeUrl}
            alt={slug}
            onError={() => setImgError(true)}
          />
        </div>
        <div className={styles.meta}>
          {(title || year) && (
            <p className={styles.metaTitle}>
              {title ?? slug}{" "}
              {year && <span className={styles.metaYear}>({year})</span>}
            </p>
          )}
          {rating != null && rating > 0 && <StarRating rating={rating} />}
        </div>
      </a>
    </div>
  );
}