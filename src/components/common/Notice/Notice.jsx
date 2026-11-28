import Button from "../Button/Button";
import styles from "./Notice.module.css";

// A centered message card with one button, for "not found", "no access"
// and "couldn't load" screens.
//   actionTo / onAction  where the button goes, or what it does (use one)
export default function Notice({ title, text, actionLabel, actionTo, onAction }) {
  return (
    <div className={styles.notice} role="alert">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{text}</p>
      <Button variant="secondary" to={actionTo} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
