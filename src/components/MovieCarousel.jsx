import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./MovieCarousel.module.css";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ movies, status }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayInterval = useRef(null);
    const scrollRef = useRef(null);

    const nextSlide = useCallback(() => {
        if (!movies?.length) return;
        setActiveIndex((prev) => (prev + 1) % movies.length);
    }, [movies?.length]);

    const prevSlide = useCallback(() => {
        if (!movies?.length) return;
        setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length);
    }, [movies?.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA"
            )
                return;
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextSlide, prevSlide]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let accumulated = 0;

        const handleWheel = (e) => {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
            e.preventDefault();
            accumulated += e.deltaX;
            if (accumulated > 100) {
                nextSlide();
                accumulated = 0;
            } else if (accumulated < -100) {
                prevSlide();
                accumulated = 0;
            }
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [nextSlide, prevSlide]);

    useEffect(() => {
        if (!isAutoPlaying || isHovering || !movies || movies.length <= 1)
            return;
        autoPlayInterval.current = setInterval(nextSlide, 5000);
        return () => clearInterval(autoPlayInterval.current);
    }, [isAutoPlaying, isHovering, movies, nextSlide]);

    if (
        !status ||
        status === "IDLE" ||
        status === "LOADING" ||
        !movies ||
        movies.length === 0
    ) {
        return null;
    }

    return (
        <section className={styles.carouselSection}>
            {/* Desktop carousel */}
            <div
                className={styles.carouselWrapper}
                ref={scrollRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className={styles.stage}>
                    {movies.map((movie, index) => {
                        let offset = index - activeIndex;
                        const half = Math.ceil(movies.length / 2);
                        if (offset > half) offset -= movies.length;
                        if (offset < -half) offset += movies.length;

                        const absOffset = Math.abs(offset);
                        if (absOffset > 4) return null;

                        return (
                            <div
                                key={movie.id || movie.slug}
                                className={`${styles.carouselSlide} ${offset === 0 ? styles.active : ""}`}
                                onClick={() => {
                                    setActiveIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                                style={{
                                    "--offset": offset,
                                    "--abs-offset": absOffset,
                                    zIndex: 10 - absOffset,
                                }}
                            >
                                <MovieCard
                                    movie={movie}
                                    isFocused={offset === 0}
                                />
                            </div>
                        );
                    })}
                </div>

                <button
                    className={`${styles.navButton} ${styles.prev}`}
                    onClick={prevSlide}
                >
                    ‹
                </button>
                <button
                    className={`${styles.navButton} ${styles.next}`}
                    onClick={nextSlide}
                >
                    ›
                </button>
            </div>

            {/* Mobile list */}
            <div className={styles.mobileList}>
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id || movie.slug}
                        movie={movie}
                        isFocused={false}
                    />
                ))}
            </div>
        </section>
    );
}