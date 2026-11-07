import { Link } from "react-router-dom";
import styles from "./Button.module.css";

// variant: "primary" (mustard) or "secondary" (white with border).
// Pass `to` to render a link that looks like a button.
export default function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  to,
  type = "button",
  className = "",
  children,
  onClick,
  ...rest
}) {
  const classes = `${styles.button} ${styles[variant]} ${loading ? styles.loading : ""} ${className}`;
  const label = <span className={styles.label}>{children}</span>;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {label}
      </Link>
    );
  }

  const inactive = disabled || loading;

  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={inactive || undefined}
      onClick={inactive ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {label}
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </button>
  );
}
