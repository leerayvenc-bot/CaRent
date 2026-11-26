import { CAR_STATUS } from "./carStatus";
import { SORT } from "./carFilters";

export const SAVED_FILTER = {
  ALL: "all",
  AVAILABLE: "available",
  RENTED: "rented",
};

// status is the car status each chip filters by (null = everything)
export const SAVED_FILTER_OPTIONS = [
  { value: SAVED_FILTER.ALL, label: "All", status: null },
  { value: SAVED_FILTER.AVAILABLE, label: "Available", status: CAR_STATUS.AVAILABLE },
  { value: SAVED_FILTER.RENTED, label: "Rented", status: CAR_STATUS.RENTED },
];

export const SAVED_SORT_RECENT = "recent";

export const SAVED_SORT_OPTIONS = [
  { value: SAVED_SORT_RECENT, label: "Recently saved" },
  { value: SORT.PRICE_ASC, label: "Price: low to high" },
  { value: SORT.PRICE_DESC, label: "Price: high to low" },
  { value: SORT.RATING, label: "Highest rated" },
];