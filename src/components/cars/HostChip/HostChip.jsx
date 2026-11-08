import { formatHostName, getInitials } from "../../../utils/formatters";
import styles from "./HostChip.module.css";

// Not a link in v1
export default function HostChip({ name }) {
  return (
    <span className={styles.chip}>
      <span className={styles.avatar} aria-hidden="true">
        {getInitials(name)}
      </span>
      <span className={styles.name}>{formatHostName(name)}</span>
    </span>
  );
}
