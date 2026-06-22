import { useState } from "react";
import styles from "./Hero.module.css";

export default function Hero({ children }) {
    const [methodologyOpen, setMethodologyOpen] = useState(false);

    return (
        <div className={styles.wrapper}>
            <div className={styles.overlay} />

            <div className={styles.content}>
                <div className={styles.logo}>
                    <span className={styles.logoText} data-text="Deep Cut">
                        Deep Cut
                    </span>
                </div>

                <h1 className={styles.headline}>
                    Discover Your Next Favorite Movie
                </h1>

                <p className={styles.subheadline}>
                    Enter your Letterboxd username and we'll analyze your
                    ratings to find movies you'll actually love — powered by a{" "}
                    <strong>two-tower neural network</strong> trained on ratings
                    from thousands of users.
                </p>

                {children}

                <div className={styles.steps}>
                    <div className={styles.step}>
                        <span className={styles.stepIcon}>①</span>
                        <span className={styles.stepLabel}>
                            Enter your username
                        </span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={styles.step}>
                        <span className={styles.stepIcon}>②</span>
                        <span className={styles.stepLabel}>
                            We scrape your ratings
                        </span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={styles.step}>
                        <span className={styles.stepIcon}>③</span>
                        <span className={styles.stepLabel}>
                            Neural net scores unseen films
                        </span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={styles.step}>
                        <span className={styles.stepIcon}>④</span>
                        <span className={styles.stepLabel}>
                            Get personalized picks
                        </span>
                    </div>
                </div>

                <div className={styles.methodology}>
                    <button
                        className={styles.methodologyToggle}
                        onClick={() => setMethodologyOpen((o) => !o)}
                        aria-expanded={methodologyOpen}
                    >
                        <span>How does this work?</span>
                        <span
                            className={styles.chevron}
                            style={{
                                transform: methodologyOpen
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                            }}
                        >
                            ▾
                        </span>
                    </button>

                    {methodologyOpen && (
                        <div className={styles.methodologyBody}>
                            <p>
                                Your star ratings are scraped from your public
                                Letterboxd profile and assigned numerical values
                                from 1–10 (accounting for half stars). These are
                                fed into a{" "}
                                <strong>two-tower neural network</strong> — one
                                tower encodes you as a user, the other encodes
                                each movie. Both towers output embeddings that
                                are compared via dot product to predict your
                                score for any unseen film.
                            </p>
                            <p>
                                The model is trained on ratings from thousands
                                of other Letterboxd users, so it understands
                                taste patterns — not just your own history.
                                Every film you haven't rated is scored and the
                                top predictions are returned.
                            </p>
                            <p className={styles.methodologyNote}>
                                ⚠ The model is blind to directors,
                                cast, or any content metadata — it recommends
                                purely based on{" "}
                                <em>rating pattern similarities</em> between
                                users. The more films you've rated, the better
                                your recommendations will be.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}