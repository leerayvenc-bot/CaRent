import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiExternalLink, FiSend } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";
import { QUICK_REPLIES } from "../../../constants/chatConstants";
import { formatDate, formatHostName } from "../../../utils/formatters";
import FavoriteButton from "../../cars/FavoriteButton/FavoriteButton";
import PriceTag from "../../cars/PriceTag/PriceTag";
import RatingSummary from "../../ratings/RatingSummary/RatingSummary";
import StatusBadge from "../../cars/StatusBadge/StatusBadge";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./ChatWindow.module.css";

function dayKey(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dayLabel(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(date);
}

export default function ChatWindow({
  conversation,
  listing,
  messages,
  currentUserId,
  currentUserName,
  favorite,
  onFavorite,
  onBack,
  onSend,
  sending,
  listingPath,
}) {
  const [draft, setDraft] = useState("");
  const messagesRef = useRef(null);
  const ownerName = formatHostName(conversation.ownerName);
  const model = conversation.carModel || listing?.model || "";
  const photo = conversation.carPhotoUrl || listing?.photo_url;
  const price = conversation.carPricePerDay ?? listing?.price_per_day;

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const submit = async (text) => {
    const sent = await onSend(text);
    if (sent) setDraft("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (draft.trim() && !sending) submit(draft);
  };

  return (
    <section className={styles.window} aria-label={`Chat with ${ownerName}`}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Back to inbox">
          <FiArrowLeft size={22} aria-hidden="true" />
        </button>
        <span className={styles.ownerAvatar} aria-hidden="true">{ownerName.charAt(0)}</span>
        <div className={styles.ownerInfo}>
          <h2 className={styles.ownerName}>{ownerName}</h2>
          {listing && (
            <div className={styles.ownerMeta}>
              <RatingSummary avg={listing.avg_rating} count={listing.rating_count} />
              {listing.location && <span>{listing.location}</span>}
            </div>
          )}
        </div>
      </header>

      <div className={styles.carCard}>
        {photo ? (
          <img className={styles.carImage} src={photo} alt={model} />
        ) : (
          <span className={styles.carPlaceholder} aria-hidden="true"><MdDirectionsCar size={28} /></span>
        )}
        <div className={styles.carInfo}>
          <div className={styles.carMeta}>
            {listing?.status && <StatusBadge status={listing.status} />}
            {listing?.location && <span className={styles.location}>{listing.location}</span>}
          </div>
          <p className={styles.model}>{model}</p>
          {price != null && <PriceTag amount={price} />}
        </div>
        <div className={styles.carActions}>
          <Link to={listingPath} className={styles.listingLink}>
            View listing <FiExternalLink size={15} aria-hidden="true" />
          </Link>
          <FavoriteButton active={favorite} onToggle={onFavorite} label={model} />
        </div>
      </div>

      <div className={styles.messages} ref={messagesRef} aria-live="polite">
        {messages.map((message, index) => {
          const currentDay = dayKey(message.createdAt);
          const previousDay = dayKey(messages[index - 1]?.createdAt);
          const showDivider = currentDay && currentDay !== previousDay;
          return (
            <div className={styles.messageGroup} key={message.id}>
              {showDivider && <span className={styles.dayDivider}>{dayLabel(message.createdAt)}</span>}
              <MessageBubble
                message={message}
                isMine={message.senderId === currentUserId}
                senderName={message.senderId === conversation.ownerId ? conversation.ownerName : currentUserName}
              />
            </div>
          );
        })}
      </div>

      <footer className={styles.composer}>
        <div className={styles.quickReplies} aria-label="Quick replies">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              className={styles.quickReply}
              onClick={() => !sending && submit(reply)}
              disabled={sending}
            >
              {reply}
            </button>
          ))}
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.visuallyHidden} htmlFor="message-draft">Write a message</label>
          <input
            id="message-draft"
            className={styles.input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Write a message to ${ownerName}...`}
            autoComplete="off"
          />
          <button type="submit" className={styles.send} disabled={!draft.trim() || sending}>
            <span>Send</span>
            <FiSend size={17} aria-hidden="true" />
          </button>
        </form>
      </footer>
    </section>
  );
}
