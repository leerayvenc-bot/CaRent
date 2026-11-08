import styles from "./ClearFilters.module.css";

export default function ClearFilters({ onClick }) {
  return (
    <button type="button" className={styles.clear} onClick={onClick}>
      Clear filters
    </button>
  );
}
