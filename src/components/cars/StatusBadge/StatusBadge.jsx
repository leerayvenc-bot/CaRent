import { CAR_STATUS } from "../../../constants/carStatus";
import styles from "./StatusBadge.module.css";

const LABEL = {
  [CAR_STATUS.AVAILABLE]: "Available",
  [CAR_STATUS.RENTED]: "Rented",
};

export default function StatusBadge({ status }) {
  const isRented = status === CAR_STATUS.RENTED;
  return (
    <span className={`${styles.badge} ${isRented ? styles.rented : styles.available}`}>
      {LABEL[status] ?? LABEL[CAR_STATUS.AVAILABLE]}
    </span>
  );
}
