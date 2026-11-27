import Avatar from "../Avatar/Avatar";
import { formatMonthYear } from "../../../utils/formatters";
import styles from "./ProfileHero.module.css";

// The top of a public profile: cover band, avatar, name, details and actions.
//   name, city, createdAt   what to show (createdAt is a Date or null)
//   photoUrl                profile photo, or "" for initials
//   badge                   optional short label next to the name, e.g. "Top owner"
//   children                actions on the right (buttons or links)
export default function ProfileHero({ name, city, createdAt, photoUrl = "", badge, children }) {
  const meta = [
    city,
    createdAt instanceof Date && `Joined ${formatMonthYear(createdAt)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className={styles.hero}>
      <div className={styles.cover} aria-hidden="true" />
      <div className={styles.row}>
        <Avatar name={name} src={photoUrl} className={styles.avatar} />
        <div className={styles.text}>
          <div className={styles.titleRow}>
            <h1 className={styles.name}>{name}</h1>
            {badge && <span className={styles.badge}>{badge}</span>}
          </div>
          {meta && <p className={styles.meta}>{meta}</p>}
        </div>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </header>
  );
}
