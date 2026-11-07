import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAirlineSeatReclineNormal,
  MdDirectionsCar,
  MdEco,
  MdFavorite,
  MdFavoriteBorder,
  MdGroup,
  MdInventory2,
  MdLocalGasStation,
  MdLocationOn,
  MdOilBarrel,
  MdSettings,
  MdStar,
  MdTerrain,
  MdWbSunny,
  MdWeekend,
} from "react-icons/md";
import Badge from "../../common/Badge/Badge";
import { CAR_STATUS } from "../../../constants/carStatus";
import { SPEC_TYPE } from "../../../constants/carFilters";
import { formatPrice, formatRating } from "../../../utils/formatters";
import styles from "./CarCard.module.css";

const SPEC_ICONS = {
  [SPEC_TYPE.TRANSMISSION]: MdSettings,
  [SPEC_TYPE.FUEL]: MdLocalGasStation,
  [SPEC_TYPE.DIESEL]: MdOilBarrel,
  [SPEC_TYPE.SEATS]: MdAirlineSeatReclineNormal,
  [SPEC_TYPE.GROUP_SEATS]: MdGroup,
  [SPEC_TYPE.CAPTAIN_SEATS]: MdWeekend,
  [SPEC_TYPE.TERRAIN]: MdTerrain,
  [SPEC_TYPE.CARGO]: MdInventory2,
  [SPEC_TYPE.ROOF]: MdWbSunny,
  [SPEC_TYPE.ECO]: MdEco,
};

const STATUS_LABEL = {
  [CAR_STATUS.AVAILABLE]: "Available",
  [CAR_STATUS.RENTED]: "Rented",
};

export default function CarCard({ car, detailPath, isSaved, onToggleSave }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isRented = car.status === CAR_STATUS.RENTED;

  return (
    <article className={`${styles.card} ${isRented ? styles.rented : ""}`}>
      <div className={styles.media}>
        {imageFailed ? (
          <div className={styles.imageFallback} aria-hidden="true">
            <MdDirectionsCar size={48} />
          </div>
        ) : (
          <img
            className={styles.image}
            src={car.imageUrl}
            alt={car.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className={styles.shade} aria-hidden="true" />

        <div className={styles.topRow}>
          <Badge variant={isRented ? "muted" : "active"}>{STATUS_LABEL[car.status]}</Badge>
          <button
            type="button"
            className={`${styles.saveButton} ${isSaved ? styles.saved : ""}`}
            aria-label={isSaved ? "Remove from saved" : "Save listing"}
            aria-pressed={isSaved}
            onClick={() => onToggleSave(car.id)}
          >
            {isSaved ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
          </button>
        </div>

        <div className={styles.price}>
          <span className={styles.priceAmount}>{formatPrice(car.pricePerDay)}</span>
          <span className={styles.priceUnit}>/day</span>
        </div>
      </div>

      <div className={styles.body}>
        <div>
          <span className={styles.tagline}>{car.tagline}</span>
          <h2 className={styles.title}>
            <Link to={detailPath} className={styles.titleLink}>
              {car.title}
            </Link>
          </h2>
          <div className={styles.rating}>
            <MdStar className={styles.star} size={14} aria-hidden="true" />
            <span className={styles.ratingValue}>{formatRating(car.rating)}</span>
            <span className={styles.ratingCount}>({car.ratingCount})</span>
          </div>
        </div>

        <ul className={styles.specs}>
          {car.specs.map((spec) => {
            const Icon = SPEC_ICONS[spec.type] ?? MdSettings;
            return (
              <li key={spec.label} className={styles.spec}>
                <Icon size={16} aria-hidden="true" />
                {spec.label}
              </li>
            );
          })}
        </ul>

        <div className={styles.footer}>
          <span className={styles.location}>
            <MdLocationOn className={styles.pin} size={16} aria-hidden="true" />
            <span className={styles.truncate}>{car.location}</span>
          </span>
          <span className={styles.owner}>{car.ownerName}</span>
        </div>
      </div>
    </article>
  );
}
