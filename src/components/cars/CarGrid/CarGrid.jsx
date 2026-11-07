import CarCard from "../CarCard/CarCard";
import styles from "./CarGrid.module.css";

// Responsive grid of car cards: 1 column on phones up to 4 on wide screens.
export default function CarGrid({ listings, savedIds, onToggleSave, getDetailPath }) {
  return (
    <div className={styles.grid}>
      {listings.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          detailPath={getDetailPath(car.id)}
          isSaved={savedIds.has(car.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
