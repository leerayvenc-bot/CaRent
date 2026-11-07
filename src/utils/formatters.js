const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const MAX_HOST_NAME_LENGTH = 16;

// 3800 -> "₱3,800"
export function formatPrice(amount) {
  return pesoFormatter.format(amount);
}

// Truncates to one decimal: 4.95 -> "4.9", 5 -> "5.0"
export function formatRating(rating) {
  return (Math.floor(rating * 10) / 10).toFixed(1);
}

// 34 -> "34", 1234 -> "1.2k"
export function formatCount(count) {
  if (count <= 999) return String(count);
  return `${(Math.floor(count / 100) / 10).toFixed(1).replace(/\.0$/, "")}k`;
}

// "Nov 12" in the current year, "Nov 12, 2027" otherwise
export function formatDate(date, now = new Date()) {
  const options = { month: "short", day: "numeric" };
  if (date.getFullYear() !== now.getFullYear()) options.year = "numeric";
  return date.toLocaleDateString("en-US", options);
}

// "Marco Polo Reyes" -> "Marco R.", capped at 16 characters
export function formatHostName(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Host";
  const first = parts[0];
  const last = parts.length > 1 ? ` ${parts[parts.length - 1][0].toUpperCase()}.` : "";
  const name = `${first}${last}`;
  return name.length > MAX_HOST_NAME_LENGTH
    ? `${name.slice(0, MAX_HOST_NAME_LENGTH - 1)}…`
    : name;
}

// "Marco Reyes" -> "MR"
export function getInitials(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
