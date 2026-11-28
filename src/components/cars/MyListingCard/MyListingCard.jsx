import { Link } from "react-router-dom";
import { MdEventAvailable } from "react-icons/md";
import Button from "../../common/Button/Button";
import CarPhoto from "../CarPhoto/CarPhoto";
import StatusBadge from "../StatusBadge/StatusBadge";
import { CAR_STATUS } from "../../../constants/carStatus";
import { formatPrice } from "../../../utils/formatters";
import { rentedText } from "../../../utils/carLabels";
import styles from "./MyListingCard.module.css";

// One of the owner's listings, with the things they can do to it.
//   busy  true while an action on this car is running (its buttons are paused)
export default function MyListingCard({
  car,
  detailPath,
  editPath,
  busy,
  onMarkRented,
  onMarkAvailable,
  onDelete,
}) {
  const isRented = car.status === CAR_STATUS.RENTED;

  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        <CarPhoto src={car.photo_url} alt="" />
      </div>

      <div className={styles.info}>
        <div className={styles.headline}>
          <h2 className={styles.title}>
            <Link to={detailPath} className={styles.link}>
              {car.model}
            </Link>
          </h2>
          <StatusBadge status={car.status} />
        </div>

        <p className={styles.price}>{formatPrice(car.price_per_day)} / day</p>

        {isRented && (
          <p className={styles.rentedNote}>
            <MdEventAvailable size={18} aria-hidden="true" />
            {rentedText(car)}
          </p>
        )}

        <div className={styles.actions}>
          {isRented ? (
            <Button variant="secondary" loading={busy} onClick={() => onMarkAvailable(car)}>
              Mark as available
            </Button>
          ) : (
            <Button variant="secondary" disabled={busy} onClick={() => onMarkRented(car)}>
              Mark as rented
            </Button>
          )}
          <Button variant="secondary" to={editPath} aria-label={`Edit ${car.model}`}>
            Edit
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => onDelete(car)}>
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
