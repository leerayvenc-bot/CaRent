import { MdChatBubbleOutline, MdLocationOn } from "react-icons/md";
import { PICKUP_AREAS } from "../../../constants/carFilters";
import Button from "../../common/Button/Button";
import styles from "./EmptyInbox.module.css";

export default function EmptyInbox({ browsePath }) {
  return (
    <section className={styles.empty} aria-labelledby="empty-inbox-heading">
      <span className={styles.icon} aria-hidden="true">
        <MdChatBubbleOutline size={34} />
      </span>
      <h2 id="empty-inbox-heading" className={styles.heading}>No messages yet</h2>
      <p className={styles.description}>Browse cars and message an owner.</p>
      <Button to={browsePath}>Browse cars</Button>
      <div className={styles.areas}>
        <p className={styles.areasTitle}>
          <MdLocationOn size={16} aria-hidden="true" />
          Popular areas
        </p>
        <ul className={styles.chips}>
          {PICKUP_AREAS.map((area) => (
            <li className={styles.chip} key={area.value}>{area.label}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
