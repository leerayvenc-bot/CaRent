import { CAR_STATUS } from "../constants/carStatus";

// Combines the ratings of all of an owner's listings.
// Returns { avg, count }; avg is null when nobody has rated any of them yet.
export function summarizeRatings(cars) {
  let count = 0;
  let total = 0;
  for (const car of cars) {
    if (car.rating_count && car.avg_rating != null) {
      count += car.rating_count;
      total += car.avg_rating * car.rating_count;
    }
  }
  return { avg: count ? total / count : null, count };
}

export function countAvailable(cars) {
  return cars.filter((car) => car.status === CAR_STATUS.AVAILABLE).length;
}
