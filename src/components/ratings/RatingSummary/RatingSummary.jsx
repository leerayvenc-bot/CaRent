import { MdStar } from "react-icons/md";
import { formatCount, formatRating } from "../../../utils/formatters";
import styles from "./RatingSummary.module.css";

// "★ 4.9 (34)", or "New" when there are no ratings yet
export default function RatingSummary({ avg, count }) {
  if (!count || avg == null) {
    return <span className={`${styles.rating} ${styles.new}`}>New</span>;
  }

  return (
    <span className={styles.rating}>
      <MdStar className={styles.star} size={16} aria-hidden="true" />
      <span className={styles.score}>{formatRating(avg)}</span>
      <span className={styles.count}>({formatCount(count)})</span>
    </span>
  );
}
