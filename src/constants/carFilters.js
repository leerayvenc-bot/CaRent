// The one source for car field values, filter chips, sort options,
// pickup areas, and the URL query param names used on the Browse page.

export const CAR_TYPE = {
  SUV: "suv",
  SEDAN: "sedan",
  VAN: "van",
  PICKUP: "pickup",
};

export const CAR_TYPE_OPTIONS = [
  { value: CAR_TYPE.SUV, label: "SUV" },
  { value: CAR_TYPE.SEDAN, label: "Sedan" },
  { value: CAR_TYPE.VAN, label: "Van" },
  { value: CAR_TYPE.PICKUP, label: "Pickup" },
];

export const TRANSMISSION = {
  AUTOMATIC: "automatic",
  MANUAL: "manual",
};

export const TRANSMISSION_OPTIONS = [
  { value: TRANSMISSION.AUTOMATIC, label: "Automatic" },
  { value: TRANSMISSION.MANUAL, label: "Manual" },
];

export const FUEL = {
  GASOLINE: "gasoline",
  DIESEL: "diesel",
  HYBRID: "hybrid",
  ELECTRIC: "electric",
};

export const FUEL_OPTIONS = [
  { value: FUEL.GASOLINE, label: "Gasoline" },
  { value: FUEL.DIESEL, label: "Diesel" },
  { value: FUEL.HYBRID, label: "Hybrid" },
  { value: FUEL.ELECTRIC, label: "Electric" },
];

// Price bands in whole pesos per day (max is inclusive)
export const PRICE_BANDS = [
  { value: "under-2000", label: "Under ₱2,000", min: 0, max: 1999 },
  { value: "2000-3500", label: "₱2,000–3,500", min: 2000, max: 3500 },
  { value: "over-3500", label: "Over ₱3,500", min: 3501, max: Infinity },
];

export const PICKUP_AREAS = [
  { value: "cebu-business-park", label: "Cebu Business Park" },
  { value: "it-park", label: "IT Park" },
  { value: "mandaue-city", label: "Mandaue City" },
  { value: "lapu-lapu-mactan", label: "Lapu-Lapu / Mactan" },
  { value: "other", label: "Other" },
];

export const OTHER_AREA = "other";

export const SORT = {
  RECOMMENDED: "recommended", // newest first
  PRICE_ASC: "price-asc",
  PRICE_DESC: "price-desc",
  RATING: "rating",
};

export const SORT_OPTIONS = [
  { value: SORT.RECOMMENDED, label: "Recommended" },
  { value: SORT.PRICE_ASC, label: "Price: low to high" },
  { value: SORT.PRICE_DESC, label: "Price: high to low" },
  { value: SORT.RATING, label: "Top rated" },
];

// URL query param names, e.g. /?type=suv,van&trans=automatic&avail=1&sort=price-asc
export const FILTER_PARAM = {
  TYPE: "type",
  PRICE: "price",
  TRANSMISSION: "trans",
  AVAILABLE: "avail",
  SORT: "sort",
  AREA: "area",
  QUERY: "q",
};

// "No choice" for single-choice groups (price, transmission, area)
export const ANY = "";

export const DEFAULT_CITY = "Cebu City";
export const PAGE_SIZE = 12;
export const CARS_FETCH_LIMIT = 200;
export const SEARCH_DEBOUNCE_MS = 300;
export const RESULT_ANNOUNCE_DELAY_MS = 500;
export const SLOW_LOADING_MS = 10000;
