import FilterGroup from "../FilterGroup/FilterGroup";
import AvailableToggle from "../AvailableToggle/AvailableToggle";
import ClearFilters from "../ClearFilters/ClearFilters";
import SortSelect from "../SortSelect/SortSelect";
import { ANY, CAR_TYPE_OPTIONS, PRICE_BANDS, TRANSMISSION_OPTIONS } from "../../../constants/carFilters";
import styles from "./FilterBar.module.css";

const ANY_OPTION = { value: ANY, label: "Any" };
const PRICE_OPTIONS = [ANY_OPTION, ...PRICE_BANDS];
const TRANS_OPTIONS = [ANY_OPTION, ...TRANSMISSION_OPTIONS];

// onChange(name, value) where name is "types", "price", "transmission",
// "availableOnly" or "sort"
export default function FilterBar({ filters, onChange, onClear, showClear }) {
  return (
    <div className={styles.bar}>
      <div className={styles.groups}>
        <FilterGroup
          label="Type"
          mode="multi"
          options={CAR_TYPE_OPTIONS}
          selected={filters.types}
          onChange={(value) => onChange("types", value)}
        />
        <FilterGroup
          label="Price per day"
          mode="single"
          options={PRICE_OPTIONS}
          selected={filters.price}
          onChange={(value) => onChange("price", value)}
        />
        <FilterGroup
          label="Transmission"
          mode="single"
          options={TRANS_OPTIONS}
          selected={filters.transmission}
          onChange={(value) => onChange("transmission", value)}
        />
      </div>

      <div className={styles.controls}>
        <AvailableToggle
          checked={filters.availableOnly}
          onChange={(value) => onChange("availableOnly", value)}
        />
        {showClear && <ClearFilters onClick={onClear} />}
        <div className={styles.sort}>
          <SortSelect value={filters.sort} onChange={(value) => onChange("sort", value)} />
        </div>
      </div>
    </div>
  );
}
