import { forwardRef, useEffect, useState } from "react";
import { RESULT_ANNOUNCE_DELAY_MS } from "../../../constants/carFilters";
import { pluralize } from "../../../utils/formatters";
import styles from "./ResultsHeader.module.css";

// heading: "Cars in Cebu City" or "Cars near IT Park".
// count is null while loading. The ref goes on the h1 so search can focus it.
const ResultsHeader = forwardRef(function ResultsHeader({ id, heading, count, slowNotice }, ref) {
  const [announcement, setAnnouncement] = useState("");

  // Screen readers hear "8 cars found" once the count settles
  useEffect(() => {
    if (count == null) return undefined;
    const timer = setTimeout(
      () => setAnnouncement(`${pluralize(count, "car")} found`),
      RESULT_ANNOUNCE_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className={styles.header}>
      <h1 ref={ref} id={id} tabIndex={-1} className={styles.heading}>
        {heading}
      </h1>
      {count != null && <span className={styles.count}>{pluralize(count, "car")}</span>}
      {slowNotice && <p className={styles.slow}>Still loading…</p>}
      <span className={styles.srOnly} aria-live="polite">
        {announcement}
      </span>
    </div>
  );
});

export default ResultsHeader;
