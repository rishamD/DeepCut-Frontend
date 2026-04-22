import { useRef, useEffect } from "react";
import { Carousel } from "react-round-carousel";
import "react-round-carousel/src/index.css";
import styles from "./MovieCarousel.module.css";
import MovieCard from "./MovieCard";
import LoadingState from "./LoadingState";

export default function MovieCarousel({ movies, status, processInfo }) {
    const carouselRef = useRef(null);
    const scrollTimeout = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") carouselRef.current?.prev();
            if (e.key === "ArrowRight") carouselRef.current?.next();
        };

        const handleWheel = (e) => {
            if (scrollTimeout.current) return;
            if (Math.abs(e.deltaX) > 30 || Math.abs(e.deltaY) > 30) {
                if (e.deltaX > 0 || e.deltaY > 0) {
                    carouselRef.current?.next();
                } else {
                    carouselRef.current?.prev();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    if (!status || status === "IDLE") return null;

   if (status === "LOADING") {
    return (
        <section className={styles.carouselSection}>
            <LoadingState info={processInfo} />
        </section>
    );
    }

    if (!movies?.length) return null;

const items = movies.map((movie) => ({
    content: (
        <div className={styles.itemInner}>
            <MovieCard movie={movie} />
        </div>
    ),
}));

return (
    <>
        {/* Banner sits ABOVE the carousel section, outside the 3D context */}
        <div className={styles.resultsBanner}>
    {processInfo?.avatarUrl && (
        <img
            src={processInfo.avatarUrl}
            alt="Profile avatar"
            className={styles.bannerAvatar}
            referrerPolicy="no-referrer"
        />
    )}
    <div className={styles.bannerInfo}>
        <span className={styles.bannerText}>
            Based on{" "}
            <strong>{processInfo?.movieCount ?? movies.length} films</strong>{" "}
            from your Letterboxd
        </span>
        <span className={styles.bannerCount}>
            {movies.length} recommendations
        </span>
    </div>
</div>

        <section className={styles.carouselSection}>
            <div className={styles.outerContainer}>
                <button
                    className={`${styles.navBtn} ${styles.leftBtn}`}
                    onClick={() => carouselRef.current?.prev()}
                >
                    ‹
                </button>

                <div className={styles.carouselWrapper}>
                    <Carousel
                        ref={carouselRef}
                        items={items}
                        slideOnClick={true}
                        itemWidth={300}
                        radius={3000}
                        showControls={false}
                    />
                </div>

                <button
                    className={`${styles.navBtn} ${styles.rightBtn}`}
                    onClick={() => carouselRef.current?.next()}
                >
                    ›
                </button>
            </div>
        </section>
    </>
);
}