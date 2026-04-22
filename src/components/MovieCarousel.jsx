import { useRef, useEffect } from "react";
import { Carousel } from "react-round-carousel";
import "react-round-carousel/src/index.css"; 
import styles from "./MovieCarousel.module.css";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ movies, status }) {
    const carouselRef = useRef(null);
    const scrollTimeout = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") carouselRef.current?.prev();
            if (e.key === "ArrowRight") carouselRef.current?.next();
        };

        const handleWheel = (e) => {
            // Prevent rapid-fire scrolling
            if (scrollTimeout.current) return;

            // Check horizontal (deltaX) or vertical (deltaY) scroll
            if (Math.abs(e.deltaX) > 10 || Math.abs(e.deltaY) > 10) {
                if (e.deltaX > 0 || e.deltaY > 0) {
                    carouselRef.current?.next();
                } else {
                    carouselRef.current?.prev();
                }

                // Lock scrolling for 200ms for a smoother experience
                scrollTimeout.current = setTimeout(() => {
                    scrollTimeout.current = null;
                }, 200);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    if (!status || status === "IDLE" || status === "LOADING" || !movies?.length) {
        return null;
    }

    const items = movies.map((movie) => ({
        content: (
            <div className={styles.itemInner}>
                <MovieCard movie={movie} />
            </div>
        )
    }));

    return (
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
                        radius={1500}
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
    );
}