import { getInitials } from "../../../utils/formatters";
import styles from "./MessageBubble.module.css";

function formatTime(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message, isMine, senderName }) {
  const time = formatTime(message.createdAt);

  return (
    <article className={`${styles.row} ${isMine ? styles.mine : styles.theirs}`}>
      {!isMine && (
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(senderName)}
        </span>
      )}
      <div className={styles.message}>
        <p className={styles.bubble}>{message.text}</p>
        {time && <time className={styles.time}>{time}</time>}
      </div>
    </article>
  );
}
