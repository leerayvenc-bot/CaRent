// Values used by the Browse filters, sort menu, and car listings.

export const CAR_CATEGORY = {
  SUV: "suv",
  SEDAN: "sedan",
  VAN: "van",
  PICKUP: "pickup",
};

export const TRANSMISSION = {
  AUTOMATIC: "automatic",
  MANUAL: "manual",
};

// Spec types a listing can show under its title (icons are picked in CarCard)
export const SPEC_TYPE = {
  TRANSMISSION: "transmission",
  FUEL: "fuel",
  DIESEL: "diesel",
  SEATS: "seats",
  GROUP_SEATS: "groupSeats",
  CAPTAIN_SEATS: "captainSeats",
  TERRAIN: "terrain",
  CARGO: "cargo",
  ROOF: "roof",
  ECO: "eco",
};

export const BUDGET_MAX_PRICE = 2000;

export const FILTER = {
  ALL: "all",
  AVAILABLE: "available",
  RENTED: "rented",
  BUDGET: "budget",
  SUV: "suv",
  SEDAN: "sedan",
  AUTOMATIC: "automatic",
};

export const SORT = {
  RECOMMENDED: "recommended",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
  RATING: "rating",
};

export const SORT_OPTIONS = [
  { value: SORT.RECOMMENDED, label: "Recommended" },
  { value: SORT.PRICE_LOW, label: "Price: Low to High" },
  { value: SORT.PRICE_HIGH, label: "Price: High to Low" },
  { value: SORT.RATING, label: "Top Rated Hosts" },
];
