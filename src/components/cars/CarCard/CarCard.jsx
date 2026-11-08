import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAirlineSeatReclineNormal,
  MdDirectionsCar,
  MdEventAvailable,
  MdLocalGasStation,
  MdLocationOn,
  MdSettings,
} from "react-icons/md";
import StatusBadge from "../StatusBadge/StatusBadge";
import PriceTag from "../PriceTag/PriceTag";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import HostChip from "../HostChip/HostChip";
import RatingSummary from "../../ratings/RatingSummary/RatingSummary";
import { CAR_STATUS } from "../../../constants/carStatus";
import { CAR_TYPE_OPTIONS, FUEL_OPTIONS, TRANSMISSION_OPTIONS } from "../../../constants/carFilters";
import { formatDate, formatPrice, formatRating } from "../../../utils/formatters";
import styles from "./CarCard.module.css";

const MISSING = "—";
const labelFor = (options, value) => options.find((o) => o.value === value)?.label;

function rentedText(car) {
  return car.available_from instanceof Date
    ? `Available from ${formatDate(car.available_from)}`
    : "Currently rented";
}

// Full summary for screen readers, read as the card link's name
function describe(car, typeLabel, isRented) {
  const parts = [car.model];
  if (typeLabel) parts.push(typeLabel);
  parts.push(`${formatPrice(car.price_per_day)} per day`);
  parts.push(
    car.rating_count
      ? `${formatRating(car.avg_rating)} stars from ${car.rating_count} reviews`
      : "new, no reviews yet"
  );
  parts.push(isRented ? `rented, ${rentedText(car).toLowerCase()}` : "available");
  if (car.location) parts.push(car.location);
  return parts.join(", ");
}

export default function CarCard({ car, detailPath, isFavorite, onFavorite }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isRented = car.status === CAR_STATUS.RENTED;
  const typeLabel = labelFor(CAR_TYPE_OPTIONS, car.car_type);
  const eyebrow = [typeLabel, car.tag].filter(Boolean).join(" · ");
  const showImage = car.photo_url && !imageFailed;

  const specs = [
    { Icon: MdSettings, text: labelFor(TRANSMISSION_OPTIONS, car.transmission) },
    { Icon: MdLocalGasStation, text: labelFor(FUEL_OPTIONS, car.fuel) },
    { Icon: MdAirlineSeatReclineNormal, text: car.seats ? `${car.seats} seats` : null },
  ];

  return (
    <article className={`${styles.card} ${isRented ? styles.rented : ""}`}>
      <div className={styles.media}>
        {showImage ? (
          <img
            className={styles.image}
            src={car.photo_url}
            alt={car.model}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <MdDirectionsCar size={48} />
          </div>
        )}
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.badge}>
          <StatusBadge status={car.status} />
        </div>
        <div className={styles.favorite}>
          <FavoriteButton active={isFavorite} onToggle={() => onFavorite(car.id)} label={car.model} />
        </div>
        <div className={styles.price}>
          <PriceTag amount={car.price_per_day} />
        </div>
      </div>

      <div className={styles.body}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 className={styles.title}>
          <Link to={detailPath} className={styles.link} aria-label={describe(car, typeLabel, isRented)}>
            {car.model}
          </Link>
        </h2>
        <RatingSummary avg={car.avg_rating} count={car.rating_count} />

        {isRented && (
          <p className={styles.rentedNote}>
            <MdEventAvailable size={16} aria-hidden="true" />
            {rentedText(car)}
          </p>
        )}

        <ul className={styles.specs}>
          {specs.map(({ Icon, text }, i) => (
            <li key={i} className={styles.spec}>
              <Icon size={16} aria-hidden="true" />
              {text ?? MISSING}
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <span className={styles.location} title={car.location}>
            <MdLocationOn size={16} aria-hidden="true" />
            <span className={styles.locationText}>{car.location || MISSING}</span>
          </span>
          <HostChip name={car.owner_name} />
        </div>
      </div>
    </article>
  );
}
