import styles from "./Badge.module.css";

// Small pill label with a dot. variant: "active" (pink) or "muted" (grey).
export default function Badge({ children, variant = "active" }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
