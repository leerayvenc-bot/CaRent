// Turns stored car values into the words people read.
import {
  CAR_TYPE_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "../constants/carFilters";
import { formatDate } from "./formatters";

const labelFor = (options, value) =>
  options.find((o) => o.value === value)?.label;

export const carTypeLabel = (value) => labelFor(CAR_TYPE_OPTIONS, value);
export const transmissionLabel = (value) =>
  labelFor(TRANSMISSION_OPTIONS, value);
export const fuelLabel = (value) => labelFor(FUEL_OPTIONS, value);

// "Available from Nov 12" when the owner set a return date, otherwise "Currently rented"
export function rentedText(car) {
  return car.available_from instanceof Date
    ? `Available from ${formatDate(car.available_from)}`
    : "Currently rented";
}
