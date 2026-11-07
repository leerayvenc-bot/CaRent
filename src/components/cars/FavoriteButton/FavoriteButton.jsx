import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from "./FavoriteButton.module.css";

// label is the car title, used in "Save {title}" / "Remove {title} from saved"
export default function FavoriteButton({ active, onToggle, label }) {
  return (
    <button
      type="button"
      className={`${styles.button} ${active ? styles.active : ""}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from saved` : `Save ${label}`}
      onClick={onToggle}
    >
      <span className={styles.circle} aria-hidden="true">
        {active ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
      </span>
    </button>
  );
}
