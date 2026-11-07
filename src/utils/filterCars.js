// Pure helpers that search, filter, and sort cars in the browser.
import { CAR_STATUS } from "../constants/carStatus";
import { ANY, OTHER_AREA, PICKUP_AREAS, PRICE_BANDS, SORT } from "../constants/carFilters";

const KNOWN_AREA_LABELS = PICKUP_AREAS.filter((a) => a.value !== OTHER_AREA).map((a) => a.label);

function matchesQuery(car, query) {
  if (!query) return true;
  const text = `${car.model ?? ""} ${car.location ?? ""}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

function matchesArea(car, area) {
  if (area === ANY) return true;
  if (area === OTHER_AREA) return !KNOWN_AREA_LABELS.includes(car.location);
  const label = PICKUP_AREAS.find((a) => a.value === area)?.label;
  return car.location === label;
}

function matchesPrice(car, price) {
  if (price === ANY) return true;
  const band = PRICE_BANDS.find((b) => b.value === price);
  return car.price_per_day >= band.min && car.price_per_day <= band.max;
}

export function filterCars(cars, filters) {
  return cars.filter(
    (car) =>
      matchesQuery(car, filters.query) &&
      matchesArea(car, filters.area) &&
      (filters.types.length === 0 || filters.types.includes(car.car_type)) &&
      matchesPrice(car, filters.price) &&
      (filters.transmission === ANY || car.transmission === filters.transmission) &&
      (!filters.availableOnly || car.status === CAR_STATUS.AVAILABLE)
  );
}

const time = (date) => (date instanceof Date ? date.getTime() : 0);

const SORT_COMPARE = {
  [SORT.RECOMMENDED]: (a, b) => time(b.created_at) - time(a.created_at),
  [SORT.PRICE_ASC]: (a, b) => a.price_per_day - b.price_per_day,
  [SORT.PRICE_DESC]: (a, b) => b.price_per_day - a.price_per_day,
  // Cars without ratings ("New") go last
  [SORT.RATING]: (a, b) => (b.avg_rating ?? -1) - (a.avg_rating ?? -1),
};

export function sortCars(cars, sort) {
  const compare = SORT_COMPARE[sort] ?? SORT_COMPARE[SORT.RECOMMENDED];
  return [...cars].sort(compare);
}
