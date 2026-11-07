import { MdWifiOff } from "react-icons/md";
import Button from "../Button/Button";
import styles from "./ErrorState.module.css";

export default function ErrorState({ onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <span className={styles.icon} aria-hidden="true">
        <MdWifiOff size={32} />
      </span>
      <p className={styles.message}>Couldn't load cars. Check your connection and try again.</p>
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
