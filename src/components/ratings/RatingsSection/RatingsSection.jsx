import { MdInfoOutline, MdRateReview, MdStar, MdStarBorder } from "react-icons/md";
import RatingSummary from "../RatingSummary/RatingSummary";
import { formatHostName, formatTimeAgo, getInitials } from "../../../utils/formatters";
import styles from "./RatingsSection.module.css";

const MAX_STARS = 5;

// The "Ratings" card on the Listing detail page.
//   avg, count   the listing's average rating and number of ratings
//   ratings      [{ id, author_name, stars, comment, created_at }] (empty until
//                the ratings backend exists)
//   isOwner      owners can't rate their own car, so the rate controls are hidden
export default function RatingsSection({ avg, count, ratings = [], isOwner }) {
  return (
    <section className={styles.card} aria-labelledby="ratings-heading">
      <header className={styles.header}>
        <h2 id="ratings-heading" className={styles.title}>
          Ratings
          <span className={styles.summary}>
            <RatingSummary avg={avg} count={count} />
          </span>
        </h2>

        {!isOwner && (
          <button
            type="button"
            className={styles.rate}
            disabled
            aria-describedby="ratings-rule"
          >
            <MdRateReview size={16} aria-hidden="true" />
            Rate this car
          </button>
        )}
      </header>

      {!isOwner && (
        <p id="ratings-rule" className={styles.rule}>
          <MdInfoOutline size={16} aria-hidden="true" />
          Message the owner first to leave a rating.
        </p>
      )}

      {ratings.length > 0 ? (
        <ul className={styles.list}>
          {ratings.map((rating) => (
            <li key={rating.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.avatar} aria-hidden="true">
                  {getInitials(rating.author_name)}
                </span>
                <span className={styles.author}>
                  <span className={styles.name}>{formatHostName(rating.author_name)}</span>
                  <Stars value={rating.stars} />
                </span>
                {rating.created_at instanceof Date && (
                  <span className={styles.date}>{formatTimeAgo(rating.created_at)}</span>
                )}
              </div>
              {rating.comment && <p className={styles.comment}>{rating.comment}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          {count
            ? "Renters' comments will show here soon."
            : "No ratings yet. Renters who chat with the owner can rate this car."}
        </p>
      )}
    </section>
  );
}

function Stars({ value }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${value} out of ${MAX_STARS} stars`}>
      {Array.from({ length: MAX_STARS }, (_, i) =>
        i < value ? <MdStar key={i} size={14} /> : <MdStarBorder key={i} size={14} />,
      )}
    </span>
  );
}
