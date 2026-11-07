// Pure helpers for filtering and sorting car listings on the Browse page.
import { CAR_STATUS } from "../constants/carStatus";
import {
  BUDGET_MAX_PRICE,
  CAR_CATEGORY,
  FILTER,
  SORT,
  TRANSMISSION,
} from "../constants/carFilters";

const FILTER_TESTS = {
  [FILTER.ALL]: () => true,
  [FILTER.AVAILABLE]: (car) => car.status === CAR_STATUS.AVAILABLE,
  [FILTER.RENTED]: (car) => car.status === CAR_STATUS.RENTED,
  [FILTER.BUDGET]: (car) => car.pricePerDay < BUDGET_MAX_PRICE,
  [FILTER.SUV]: (car) => car.category === CAR_CATEGORY.SUV,
  [FILTER.SEDAN]: (car) => car.category === CAR_CATEGORY.SEDAN,
  [FILTER.AUTOMATIC]: (car) => car.transmission === TRANSMISSION.AUTOMATIC,
};

const SORT_COMPARE = {
  [SORT.RECOMMENDED]: null, // keep the original order
  [SORT.PRICE_LOW]: (a, b) => a.pricePerDay - b.pricePerDay,
  [SORT.PRICE_HIGH]: (a, b) => b.pricePerDay - a.pricePerDay,
  [SORT.RATING]: (a, b) => b.rating - a.rating,
};

export function filterListings(listings, filter) {
  const test = FILTER_TESTS[filter] ?? FILTER_TESTS[FILTER.ALL];
  return listings.filter(test);
}

export function sortListings(listings, sort) {
  const compare = SORT_COMPARE[sort];
  return compare ? [...listings].sort(compare) : listings;
}

export function countHosts(listings) {
  return new Set(listings.map((car) => car.ownerId)).size;
}
