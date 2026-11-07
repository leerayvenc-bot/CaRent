import { useId } from "react";
import { MdSwapVert } from "react-icons/md";
import { SORT_OPTIONS } from "../../../constants/carFilters";
import styles from "./SortSelect.module.css";

export default function SortSelect({ value, onChange }) {
  const id = useId();
  return (
    <div className={styles.sort}>
      <label htmlFor={id} className={styles.label}>
        <MdSwapVert size={18} aria-hidden="true" />
        <span className={styles.labelText}>Sort</span>
      </label>
      <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
