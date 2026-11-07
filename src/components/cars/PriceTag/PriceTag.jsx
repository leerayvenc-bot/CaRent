import { formatPrice } from "../../../utils/formatters";
import styles from "./PriceTag.module.css";

export default function PriceTag({ amount }) {
  return (
    <span className={styles.tag}>
      <span className={styles.amount}>{formatPrice(amount)}</span>
      <span className={styles.unit}>/day</span>
    </span>
  );
}
