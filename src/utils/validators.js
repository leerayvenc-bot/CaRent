//import
import {
  CAR_TYPE_OPTIONS,
  FUEL_OPTIONS,
  PICKUP_AREAS,
  TRANSMISSION_OPTIONS,
} from "../constants/carFilters";

//this is for validating the form inputs for the register and login forms

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export function validateName(name) {
  if (!name.trim()) return "Full name is required.";
  return "";
}

export function validateEmail(email) {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

// Keeps only the fields that have an error message
function collectErrors(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, msg]) => msg));
}

export function validateRegisterForm({
  name,
  email,
  password,
  confirmPassword,
}) {
  return collectErrors({
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });
}

export function validateLoginForm({ email, password }) {
  return collectErrors({
    email: validateEmail(email),
    // Login only checks that a password was typed. It doesn't enforce length.
    password: password ? "" : "Password is required.",
  });
}
// ---- Car listing form ----
export const MAX_MODEL_LENGTH = 60;
export const MAX_TAG_LENGTH = 24;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_PRICE_PER_DAY = 100000;
export const MIN_SEATS = 1;
export const MAX_SEATS = 20;

// The form stores the pickup area's label (e.g. "IT Park") in `location`
const LOCATION_OPTIONS = PICKUP_AREAS.map(({ label }) => ({ value: label }));
const isOneOf = (options, value) => options.some((o) => o.value === value);
const PHOTO_URL_MESSAGE =
  "Enter a full web address starting with http:// or https://.";

export function validateModel(model) {
  const trimmed = model.trim();
  if (!trimmed) return "Car model is required.";
  if (trimmed.length > MAX_MODEL_LENGTH) {
    return `Car model must be ${MAX_MODEL_LENGTH} characters or less.`;
  }
  return "";
}

export function validatePricePerDay(price) {
  const text = String(price ?? "").trim();
  if (!text) return "Price per day is required.";
  const amount = Number(text);
  if (!Number.isInteger(amount) || amount < 1) {
    return "Enter a whole number of pesos, 1 or more.";
  }
  if (amount > MAX_PRICE_PER_DAY) {
    return `Price can't be more than ${MAX_PRICE_PER_DAY.toLocaleString("en-PH")} pesos per day.`;
  }
  return "";
}

export function validateSeats(seats) {
  const text = String(seats ?? "").trim();
  if (!text) return "Number of seats is required.";
  const count = Number(text);
  if (!Number.isInteger(count) || count < MIN_SEATS || count > MAX_SEATS) {
    return `Seats must be a whole number from ${MIN_SEATS} to ${MAX_SEATS}.`;
  }
  return "";
}

export function validateCarType(value) {
  return isOneOf(CAR_TYPE_OPTIONS, value) ? "" : "Choose a car type.";
}

export function validateTransmission(value) {
  return isOneOf(TRANSMISSION_OPTIONS, value) ? "" : "Choose a transmission.";
}

export function validateFuel(value) {
  return isOneOf(FUEL_OPTIONS, value) ? "" : "Choose a fuel type.";
}

export function validateLocation(value) {
  return isOneOf(LOCATION_OPTIONS, value) ? "" : "Choose a pickup area.";
}

export function validateTag(tag) {
  if ((tag ?? "").trim().length > MAX_TAG_LENGTH) {
    return `Tag must be ${MAX_TAG_LENGTH} characters or less.`;
  }
  return "";
}

export function validateDescription(description) {
  if ((description ?? "").trim().length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`;
  }
  return "";
}

// Optional field: empty is fine, anything typed must be a web address
export function validatePhotoUrl(url) {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return "";
  try {
    const { protocol } = new URL(trimmed);
    return protocol === "http:" || protocol === "https:"
      ? ""
      : PHOTO_URL_MESSAGE;
  } catch {
    return PHOTO_URL_MESSAGE;
  }
}

// values: the form's fields, all as strings. Returns { field: message } for the bad ones.
export function validateCarForm(values) {
  return collectErrors({
    model: validateModel(values.model),
    price_per_day: validatePricePerDay(values.price_per_day),
    car_type: validateCarType(values.car_type),
    transmission: validateTransmission(values.transmission),
    fuel: validateFuel(values.fuel),
    seats: validateSeats(values.seats),
    location: validateLocation(values.location),
    tag: validateTag(values.tag),
    description: validateDescription(values.description),
    photo_url: validatePhotoUrl(values.photo_url),
  });
}
export const MAX_MESSAGE_LENGTH = 500;

export function validateMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return "Message can't be empty.";
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or less.`;
  }
  return "";
}
