import { useEffect, useId, useRef } from "react";
import styles from "./Modal.module.css";

// A popup window over the page. It uses the browser's own <dialog>, which
// already traps the keyboard focus, closes on Esc and returns focus afterwards.
//   open     show or hide it
//   onClose  called when the user presses Esc or clicks outside the window
export default function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // The window fills the whole <dialog>, so only the dimmed backdrop gets here
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {/* Children exist only while open, so a form inside starts fresh every time */}
      {open && (
        <div className={styles.window}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
