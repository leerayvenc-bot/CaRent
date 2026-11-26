import { useMemo } from "react";
import { useCars } from "./useCars";
import { useFavorites } from "./useFavorites";
import { LOAD_STATUS } from "../constants/loadStatus";

// The user's saved cars, newest saved first.
export function useSavedCars() {
  const { cars, status: carsStatus, retry } = useCars();
  const { favoriteIds, savedAt, ready, toggleFavorite, clearAll, error, clearError } =
    useFavorites();

  const savedCars = useMemo(
    () =>
      cars
        .filter((car) => favoriteIds.has(car.id))
        .sort((a, b) => (savedAt.get(b.id)?.getTime() ?? 0) - (savedAt.get(a.id)?.getTime() ?? 0)),
    [cars, favoriteIds, savedAt]
  );

  // Don't show "No saved cars yet" while the favorites are still loading
  const status =
    carsStatus === LOAD_STATUS.READY && !ready ? LOAD_STATUS.LOADING : carsStatus;

  return { savedCars, allCars: cars, favoriteIds, status, retry, toggleFavorite, clearAll, error, clearError };
}