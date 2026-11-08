import CarCard from "../CarCard/CarCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import EmptyState from "../../common/EmptyState/EmptyState";
import ErrorState from "../../common/ErrorState/ErrorState";
import { LOAD_STATUS } from "../../../constants/loadStatus";
import styles from "./CarGrid.module.css";

const SKELETON_COUNT = 8; // CSS shows 4 on phones

// Shows cards, skeletons, an empty state, or an error state depending on status.
export default function CarGrid({
  cars,
  status,
  emptyVariant,
  city,
  favoriteIds,
  onFavorite,
  onClear,
  onRetry,
  getDetailPath,
  createListingPath,
}) {
  if (status === LOAD_STATUS.ERROR) return <ErrorState onRetry={onRetry} />;

  if (status === LOAD_STATUS.LOADING) {
    return (
      <ul className={styles.grid} aria-busy="true" aria-label="Loading cars">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <li key={i} className={styles.item}>
            <SkeletonCard />
          </li>
        ))}
      </ul>
    );
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        variant={emptyVariant}
        city={city}
        onClear={onClear}
        createListingPath={createListingPath}
      />
    );
  }

  return (
    <ul className={styles.grid}>
      {cars.map((car) => (
        <li key={car.id} className={styles.item}>
          <CarCard
            car={car}
            detailPath={getDetailPath(car.id)}
            isFavorite={favoriteIds.has(car.id)}
            onFavorite={onFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
