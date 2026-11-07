import { useId } from "react";
import { MdLocationOn, MdSearch } from "react-icons/md";
import Button from "../../common/Button/Button";
import { ANY, PICKUP_AREAS } from "../../../constants/carFilters";
import styles from "./SearchBar.module.css";

// value: { query, area }. onChange(name, value) with name "query" or "area".
export default function SearchBar({ value, onChange, onSubmit }) {
  const queryId = useId();
  const areaId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <div className={`${styles.field} ${styles.queryField}`}>
        <label htmlFor={queryId} className={styles.label}>
          Car model
        </label>
        <div className={styles.inputWrap}>
          <MdSearch className={styles.icon} size={20} aria-hidden="true" />
          <input
            id={queryId}
            type="search"
            className={styles.input}
            placeholder="e.g. Fortuner, Vios"
            value={value.query}
            onChange={(e) => onChange("query", e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className={`${styles.field} ${styles.areaField}`}>
        <label htmlFor={areaId} className={styles.label}>
          Pickup area
        </label>
        <div className={styles.inputWrap}>
          <MdLocationOn className={styles.icon} size={20} aria-hidden="true" />
          <select
            id={areaId}
            className={`${styles.input} ${styles.select}`}
            value={value.area}
            onChange={(e) => onChange("area", e.target.value)}
          >
            <option value={ANY}>All areas</option>
            {PICKUP_AREAS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" className={styles.submit}>
        Search
      </Button>
    </form>
  );
}
