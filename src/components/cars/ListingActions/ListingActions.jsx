import { MdEventAvailable } from "react-icons/md";
import Button from "../../common/Button/Button";
import PriceTag from "../PriceTag/PriceTag";
import StatusBadge from "../StatusBadge/StatusBadge";
import HostChip from "../HostChip/HostChip";
import RatingSummary from "../../ratings/RatingSummary/RatingSummary";
import { CAR_STATUS } from "../../../constants/carStatus";
import { rentedText } from "../../../utils/carLabels";
import styles from "./ListingActions.module.css";

// The panel next to the photo: price, status, host, and what the viewer can do.
//   isOwner     true when the viewer posted this car (shows Edit instead of Message)
//   onMessage   called when a renter clicks "Message owner"
//   messaging   true while the chat is opening
//   error       a message from a failed attempt to open the chat
export default function ListingActions({
  car,
  isOwner,
  editPath,
  onMessage,
  messaging,
  error,
}) {
  const isRented = car.status === CAR_STATUS.RENTED;

  return (
    <section className={styles.panel} aria-label="Rental details">
      <div className={styles.top}>
        <PriceTag amount={car.price_per_day} />
        <StatusBadge status={car.status} />
      </div>

      {isRented && (
        <p className={styles.rentedNote}>
          <MdEventAvailable size={18} aria-hidden="true" />
          {rentedText(car)}
        </p>
      )}

      <div className={styles.meta}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Host</span>
          <HostChip name={car.owner_name} />
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Rating</span>
          <RatingSummary avg={car.avg_rating} count={car.rating_count} />
        </div>
      </div>

      {isOwner ? (
        <>
          <p className={styles.note}>This is your listing.</p>
          <Button to={editPath}>Edit listing</Button>
        </>
      ) : (
        <>
          <Button onClick={onMessage} loading={messaging}>
            Message owner
          </Button>
          <p className={styles.note}>
            Ask if it&apos;s still available. CaRent doesn&apos;t handle
            payments, so you and the owner arrange the rental in chat.
          </p>
        </>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
