// Helpers for the "available again on" date field.
// An <input type="date"> holds its value as text like "2026-11-12".
const pad = (n) => String(n).padStart(2, "0");

export function toInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayInputValue(now = new Date()) {
  return toInputValue(now);
}

// "2026-11-12" -> a Date at midnight in the user's own time zone. Empty -> null.
export function fromInputValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Optional field: empty is fine. If filled, it must be today or later.
export function validateAvailableFrom(value, now = new Date()) {
  if (!value) return "";
  if (Number.isNaN(fromInputValue(value).getTime())) return "Enter a valid date.";
  if (value < todayInputValue(now)) return "Pick today or a later date.";
  return "";
}
