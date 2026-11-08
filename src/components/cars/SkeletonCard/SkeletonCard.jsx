import styles from "./SkeletonCard.module.css";

// Same size as CarCard, shown while cars load
export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.block} ${styles.image}`} />
      <div className={styles.body}>
        <div className={`${styles.block} ${styles.eyebrow}`} />
        <div className={`${styles.block} ${styles.title}`} />
        <div className={`${styles.block} ${styles.line}`} />
        <div className={`${styles.block} ${styles.line}`} />
      </div>
    </div>
  );
}
