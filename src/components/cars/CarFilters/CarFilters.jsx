import { MdDirectionsCar, MdSavings, MdSwapVert, MdTune } from "react-icons/md";
import { BUDGET_MAX_PRICE, FILTER, SORT_OPTIONS } from "../../../constants/carFilters";
import { formatPrice } from "../../../utils/formatters";
import styles from "./CarFilters.module.css";

// dot: "active" or "muted" shows a small colored dot instead of an icon
const FILTER_CHIPS = [
  { value: FILTER.ALL, label: "All", Icon: MdDirectionsCar, showCount: true },
  { value: FILTER.AVAILABLE, label: "Available", dot: "active" },
  { value: FILTER.RENTED, label: "Rented", dot: "muted" },
  { value: FILTER.BUDGET, label: `Under ${formatPrice(BUDGET_MAX_PRICE)}/day`, Icon: MdSavings },
  { value: FILTER.SUV, label: "SUVs" },
  { value: FILTER.SEDAN, label: "Sedans" },
  { value: FILTER.AUTOMATIC, label: "Automatic Transmission", Icon: MdTune },
];

export default function CarFilters({ filter, onFilterChange, sort, onSortChange, totalCount }) {
  return (
    <div className={styles.row}>
      <div className={styles.chips} role="group" aria-label="Filter cars">
        {FILTER_CHIPS.map(({ value, label, Icon, dot, showCount }) => {
          const isActive = filter === value;
          return (
            <button
              key={value}
              type="button"
              className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
              aria-pressed={isActive}
              onClick={() => onFilterChange(value)}
            >
              {Icon && <Icon size={16} aria-hidden="true" />}
              {dot && <span className={`${styles.dot} ${styles[dot]}`} aria-hidden="true" />}
              {label}
              {showCount && <span className={styles.count}>{totalCount}</span>}
            </button>
          );
        })}
      </div>

      <label className={styles.sort}>
        <MdSwapVert className={styles.sortIcon} size={18} aria-hidden="true" />
        <span className={styles.sortLabel}>Sort:</span>
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
