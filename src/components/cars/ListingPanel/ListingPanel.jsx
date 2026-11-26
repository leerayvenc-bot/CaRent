import {
  MdChatBubbleOutline,
  MdEdit,
  MdEventAvailable,
  MdFavorite,
  MdFavoriteBorder,
  MdLink,
  MdLocationOn,
  MdSchedule,
} from "react-icons/md";
import Button from "../../common/Button/Button";
import StatusBadge from "../StatusBadge/StatusBadge";
import SpecTiles from "../SpecTiles/SpecTiles";
import RatingSummary from "../../ratings/RatingSummary/RatingSummary";
import { CAR_STATUS } from "../../../constants/carStatus";
import { carTypeLabel, rentedText } from "../../../utils/carLabels";
import {
  formatHostName,
  formatPrice,
  formatTimeAgo,
  getInitials,
} from "../../../utils/formatters";
import styles from "./ListingPanel.module.css";

// The card beside the photo on the Listing detail page.
//   isOwner        true when the viewer posted this car (Edit instead of Message/Save)
//   saved          true when the viewer has this car in Saved
//   onToggleSave   called when the Save button is clicked
//   onMessage      called when "Is this still available?" is clicked
//   messaging      true while the chat is opening
//   onCopyLink     called when "Copy link" is clicked
//   error          a message from a failed attempt to open the chat
export default function ListingPanel({
  car,
  isOwner,
  editPath,
  saved,
  onToggleSave,
  onMessage,
  messaging,
  onCopyLink,
  error,
}) {
  const isRented = car.status === CAR_STATUS.RENTED;
  const eyebrow = [carTypeLabel(car.car_type), car.tag].filter(Boolean).join(" · ");

  return (
    <section className={styles.panel} aria-label="Rental details">
      <div className={styles.top}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <StatusBadge status={car.status} />
      </div>

      <div className={styles.heading}>
        <h1 className={styles.title}>{car.model}</h1>
        <RatingSummary avg={car.avg_rating} count={car.rating_count} />
      </div>

      <p className={styles.price}>
        <span className={styles.amount}>{formatPrice(car.price_per_day)}</span>
        <span className={styles.unit}>/day</span>
      </p>

      <SpecTiles car={car} />

      <ul className={styles.facts}>
        {car.location && (
          <li className={styles.fact}>
            <MdLocationOn size={16} aria-hidden="true" />
            {car.location}
          </li>
        )}
        {car.created_at instanceof Date && (
          <li className={styles.fact}>
            <MdSchedule size={16} aria-hidden="true" />
            Listed {formatTimeAgo(car.created_at)}
          </li>
        )}
        {isRented && (
          <li className={`${styles.fact} ${styles.rented}`}>
            <MdEventAvailable size={16} aria-hidden="true" />
            {rentedText(car)}
          </li>
        )}
      </ul>

      <div className={styles.owner}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(car.owner_name)}
        </span>
        <span className={styles.ownerText}>
          <span className={styles.ownerLabel}>Owner</span>
          <span className={styles.ownerName}>{formatHostName(car.owner_name)}</span>
        </span>
      </div>

      <div className={styles.actions}>
        {isOwner ? (
          <>
            <Button to={editPath} className={styles.fullWidth}>
              <MdEdit size={18} aria-hidden="true" />
              Edit listing
            </Button>
            <p className={styles.note}>This is your listing.</p>
          </>
        ) : (
          <>
            <Button onClick={onMessage} loading={messaging} className={styles.fullWidth}>
              <MdChatBubbleOutline size={18} aria-hidden="true" />
              Is this still available?
            </Button>
            <Button
              variant="secondary"
              onClick={onToggleSave}
              aria-pressed={saved}
              className={`${styles.fullWidth} ${saved ? styles.saved : ""}`}
            >
              {saved ? (
                <MdFavorite size={18} aria-hidden="true" />
              ) : (
                <MdFavoriteBorder size={18} aria-hidden="true" />
              )}
              {saved ? "Saved" : "Save"}
            </Button>
          </>
        )}

        <button type="button" className={styles.copy} onClick={onCopyLink}>
          <MdLink size={18} aria-hidden="true" />
          Copy link
        </button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
