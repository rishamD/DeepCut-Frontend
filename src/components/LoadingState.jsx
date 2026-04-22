import { useEffect, useState } from "react";
import styles from "./LoadingState.module.css";

const STEPS = [
    { key: "searching", label: "Searching for user...",         sub: "Verifying Letterboxd profile" },
    { key: "found",     label: name => `Found ${name}!`,        sub: "Fetching your watched films" },
    { key: "analyzing", label: (_, count) => `${count} films loaded`, sub: "Analyzing your taste patterns..." },
];

function getStep(info) {
    if (!info.usernameFound) return 0;
    if (info.movieCount === 0) return 1;
    return 2;
}

export default function LoadingState({ info }) {
    const stepIndex = getStep(info);
    const step = STEPS[stepIndex];
    const label =
        typeof step.label === "function"
            ? step.label(info.displayName || info.username, info.movieCount)
            : step.label;

    const [animKey, setAnimKey] = useState(0);
    useEffect(() => {
        setAnimKey(k => k + 1);
    }, [stepIndex]);

    return (
        <div className={styles.container}>
            <div className={styles.statusCard}>
                <div className={styles.spinnerWrap}>
                    {info.avatarUrl && stepIndex > 0 ? (
                        <img
                            src={info.avatarUrl}
                            alt="Profile"
                            className={styles.avatar}
                        />
                    ) : (
                        <div className={styles.spinner} />
                    )}
                </div>

                <div className={styles.textStack} key={animKey}>
                    <p className={styles.primaryText}>{label}</p>
                    <p className={styles.secondaryText}>{step.sub}</p>

                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${(stepIndex / 2) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.skeletonGrid}>
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className={styles.skeletonCard}
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}