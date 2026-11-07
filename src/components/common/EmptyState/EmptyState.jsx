import { MdDirectionsCar, MdSearchOff } from "react-icons/md";
import Button from "../Button/Button";
import styles from "./EmptyState.module.css";

// variant: "no-results" (filters hide everything) or "no-listings" (nothing listed yet)
export default function EmptyState({ variant, city, onClear, createListingPath }) {
  const noResults = variant === "no-results";
  const Icon = noResults ? MdSearchOff : MdDirectionsCar;

  return (
    <div className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        <Icon size={32} />
      </span>
      <p className={styles.title}>
        {noResults ? "No cars match these filters" : `No cars listed in ${city} yet`}
      </p>
      {noResults ? (
        <Button variant="secondary" onClick={onClear}>
          Clear filters
        </Button>
      ) : (
        <Button to={createListingPath}>Create listing</Button>
      )}
    </div>
  );
}
