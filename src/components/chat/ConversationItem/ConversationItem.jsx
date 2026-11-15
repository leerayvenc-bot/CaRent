import { MdDirectionsCar } from "react-icons/md";
import { CAR_STATUS } from "../../../constants/carStatus";
import { formatDate, formatHostName, formatPrice, getInitials } from "../../../utils/formatters";
import StatusBadge from "../../cars/StatusBadge/StatusBadge";
import styles from "./ConversationItem.module.css";

function formatConversationTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(date);
}

export default function ConversationItem({ conversation, listing, active, unread, onSelect }) {
  const model = conversation.carModel || listing?.model || "";
  const photo = conversation.carPhotoUrl || listing?.photo_url;
  const price = conversation.carPricePerDay ?? listing?.price_per_day;

  return (
    <button
      type="button"
      className={`${styles.item} ${active ? styles.active : ""}`}
      onClick={() => onSelect(conversation.id)}
      aria-current={active ? "true" : undefined}
    >
      <span className={styles.avatar} aria-hidden="true">
        {getInitials(conversation.ownerName)}
      </span>
      {unread && <span className={styles.unreadDot} aria-label="Unread" />}
      <span className={styles.content}>
        <span className={styles.top}>
          <span className={styles.name}>{formatHostName(conversation.ownerName)}</span>
          {listing?.status === CAR_STATUS.RENTED && (
            <StatusBadge status={CAR_STATUS.RENTED} />
          )}
          <span className={styles.time}>{formatConversationTime(conversation.lastMessageAt)}</span>
        </span>
        <span className={styles.car}>
          {photo ? (
            <img className={styles.thumbnail} src={photo} alt="" loading="lazy" />
          ) : (
            <span className={styles.thumbnailFallback} aria-hidden="true">
              <MdDirectionsCar size={20} />
            </span>
          )}
          <span className={styles.carDetails}>
            <span className={styles.model}>{model}</span>
            {price != null && <span className={styles.price}>{formatPrice(price)}/day</span>}
          </span>
          {listing?.location && <span className={styles.pickup}>{listing.location}</span>}
        </span>
        <span className={styles.preview}>{conversation.lastMessage}</span>
      </span>
    </button>
  );
}
