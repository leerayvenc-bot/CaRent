import { forwardRef } from "react";
import { MdCheck } from "react-icons/md";
import styles from "./FilterChip.module.css";

// mode "multi": toggle button with aria-pressed.
// mode "single": a radio inside its FilterGroup's radiogroup.
const FilterChip = forwardRef(function FilterChip(
  { label, selected, mode = "multi", onClick, tabIndex, onKeyDown },
  ref
) {
  const a11y =
    mode === "single"
      ? { role: "radio", "aria-checked": selected, tabIndex }
      : { "aria-pressed": selected };

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ""}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...a11y}
    >
      {selected && <MdCheck size={16} aria-hidden="true" />}
      {label}
    </button>
  );
});

export default FilterChip;
