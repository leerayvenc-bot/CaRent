import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import styles from "./Toast.module.css";

const DISMISS_AFTER_MS = 4000;

// Small message at the bottom of the screen. Hides itself after 4 seconds.
export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onDismiss, DISMISS_AFTER_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {message && (
        <div className={styles.toast}>
          <span>{message}</span>
          <button type="button" className={styles.close} onClick={onDismiss} aria-label="Dismiss">
            <MdClose size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
