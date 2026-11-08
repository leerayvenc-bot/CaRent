import { useId, useRef } from "react";
import FilterChip from "../FilterChip/FilterChip";
import styles from "./FilterGroup.module.css";

const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREV_KEYS = ["ArrowLeft", "ArrowUp"];

// mode "multi": selected is an array, chips toggle on and off.
// mode "single": selected is one value, chips act as a radio group (arrow keys move).
export default function FilterGroup({ label, options, selected, mode = "multi", onChange }) {
  const legendId = useId();
  const chipRefs = useRef([]);

  if (mode === "multi") {
    const toggle = (value) =>
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

    return (
      <fieldset className={styles.group}>
        <legend className={styles.legend}>{label}</legend>
        <div className={styles.chips}>
          {options.map((o) => (
            <FilterChip
              key={o.value}
              label={o.label}
              selected={selected.includes(o.value)}
              onClick={() => toggle(o.value)}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === selected)
  );

  const handleKeyDown = (e, index) => {
    const step = NEXT_KEYS.includes(e.key) ? 1 : PREV_KEYS.includes(e.key) ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    chipRefs.current[next]?.focus();
  };

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend} id={legendId}>
        {label}
      </legend>
      <div className={styles.chips} role="radiogroup" aria-labelledby={legendId}>
        {options.map((o, i) => (
          <FilterChip
            key={o.value}
            ref={(el) => (chipRefs.current[i] = el)}
            mode="single"
            label={o.label}
            selected={i === selectedIndex}
            tabIndex={i === selectedIndex ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
    </fieldset>
  );
}
