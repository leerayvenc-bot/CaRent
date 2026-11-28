import styles from "./StatTile.module.css";

// One number on a profile, e.g. "Cars listed 3".
//   label  short caption above the number
//   value  the number or text to show
//   icon   optional react-icons element shown next to the value
//   tone   "primary" (mustard, default) or "accent" (rose) for the icon
export default function StatTile({ label, value, icon, tone = "primary" }) {
  return (
    <div className={styles.tile}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        {value}
        {icon && (
          <span className={`${styles.icon} ${styles[tone]}`} aria-hidden="true">
            {icon}
          </span>
        )}
      </p>
    </div>
  );
}
