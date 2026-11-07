const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

// 3800 -> "₱3,800"
export function formatPrice(amount) {
  return pesoFormatter.format(amount);
}

// 4.95 -> "4.95", 4.9 -> "4.9", 5 -> "5.0"
export function formatRating(rating) {
  return Number.isInteger(rating) ? rating.toFixed(1) : String(rating);
}
