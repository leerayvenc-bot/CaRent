import { useId } from "react";
import styles from "./FormField.module.css";

// A label, one control, and its hint or error message, wired together for
// screen readers. as: "input" (default), "select" or "textarea".
// Any other props (type, value, onChange, ...) go straight to the control.
export default function FormField({
  label,
  name,
  as: Control = "input",
  error = "",
  hint = "",
  optional = false,
  children,
  ...controlProps
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${styles.field} ${error ? styles.invalid : ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (optional)</span>}
      </label>

      <Control
        id={id}
        name={name}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        {...controlProps}
      >
        {children}
      </Control>

      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
