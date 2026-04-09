import styles from "./Hero.module.css";

export default function Hero({ children }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.overlay} />

            <div className={styles.content}>
                <div className={styles.logo}>
                    <span className={styles.logoText} data-text="Deep Cut">Deep Cut</span>{""}
                </div>

                <h1 className={styles.headline}>
                    Discover Your Next Favorite Movie With Deep Cut
                </h1>

                {children}
            </div>
        </div>
    );
}