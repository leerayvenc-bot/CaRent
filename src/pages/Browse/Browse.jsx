import {
  MdExplore,
  MdFlightTakeoff,
  MdKey,
  MdNearMe,
  MdVerifiedUser,
} from "react-icons/md";
import CarFilters from "../../components/cars/CarFilters/CarFilters";
import CarGrid from "../../components/cars/CarGrid/CarGrid";
import Spinner from "../../components/common/Spinner/Spinner";
import { useListings } from "../../hooks/useListings";
import { useLoginPrompt } from "../../hooks/useLoginPrompt";
import { buildPath } from "../../constants/routePaths";
import styles from "./Browse.module.css";

const DELIVERY_MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACjTQMqC1C8j-7mip51y9jldAFaFHlFZPc498euKCCKnDJYGMdwVO46rgu18_Kb5AlD9u_mSwlNhJPqpwipnhmBHF2CSal885k8NW-mSHffI7kECpP87mzAs2zGggas-21NMuBsADlQPM0VwRQtE5LlrYCzycD9NjpFKmA96XagnTlGJg2_fETNM3GMgJggsEulx7I8_SepG7sQ5s-i00mpL5cFT84TfWvS2yX7WEhfoPvc8DwrkYu";

export default function Browse() {
  const {
    loading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    visibleListings,
    totalCount,
    hostCount,
    savedIds,
    toggleSaved,
  } = useListings();
  const { requireLogin } = useLoginPrompt();

  const handleToggleSave = (carId) => {
    if (requireLogin("Log in to save cars you like.")) toggleSaved(carId);
  };

  const resultCount = visibleListings.length;

  return (
    <main className={styles.page}>
      <section className={styles.controls}>
        <div className={styles.hub}>
          <div className={styles.hubInfo}>
            <span className={styles.hubIcon} aria-hidden="true">
              <MdNearMe size={20} />
            </span>
            <div>
              <span className={styles.eyebrow}>Verified Community Hub</span>
              <p className={styles.hubTitle}>Cebu City • Instant Drive Marketplace</p>
            </div>
          </div>
          <div className={styles.hubMeta}>
            <span className={styles.liveChip}>
              <span className={styles.liveDot} aria-hidden="true" />
              {hostCount} hosts sharing cars
            </span>
            <span className={styles.hideOnMobile} aria-hidden="true">•</span>
            <span className={styles.hideOnMobile}>Self-pickup &amp; Delivery Ready</span>
          </div>
        </div>

        <CarFilters
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          totalCount={totalCount}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.heading}>
          <div className={styles.headingMain}>
            <h1 className={styles.title}>Available Cars in Cebu City</h1>
            {!loading && !error && (
              <span className={styles.resultCount}>
                ({resultCount} {resultCount === 1 ? "listing" : "listings"} found)
              </span>
            )}
          </div>
          <span className={styles.trust}>
            <MdVerifiedUser size={16} aria-hidden="true" />
            Peer-Insured • Verified Host IDs
          </span>
        </div>
      </section>

      <section className={`${styles.section} ${styles.results}`}>
        {loading && <Spinner />}
        {!loading && error && (
          <p className={styles.message} role="alert">
            {error}
          </p>
        )}
        {!loading && !error && resultCount === 0 && (
          <p className={styles.message}>No cars match this filter yet. Try another one.</p>
        )}
        {!loading && !error && resultCount > 0 && (
          <CarGrid
            listings={visibleListings}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            getDetailPath={buildPath.listing}
          />
        )}
      </section>

      <section className={`${styles.section} ${styles.results}`}>
        <div className={styles.delivery}>
          <div className={styles.deliveryText}>
            <span className={styles.eyebrowStrong}>Instant Delivery Zones</span>
            <h3 className={styles.deliveryTitle}>
              Mactan-Cebu International Airport (MCIA) &amp; Hotel Hand-off
            </h3>
            <p className={styles.deliveryBody}>
              Select hosts offer zero-fee delivery to MCIA Terminals 1–2, IT Park, and Cebu
              Business Park within 2 hours of reservation confirmation.
            </p>
            <div className={styles.deliveryTags}>
              <span className={styles.tag}>
                <MdFlightTakeoff size={16} aria-hidden="true" />
                MCIA Terminal Delivery
              </span>
              <span className={styles.tag}>
                <MdKey size={16} aria-hidden="true" />
                Keyless Self-Pickup
              </span>
            </div>
          </div>
          <div
            className={styles.map}
            style={{ backgroundImage: `url("${DELIVERY_MAP_IMAGE}")` }}
            role="img"
            aria-label="Map of the Cebu delivery area"
          >
            <span className={styles.mapLabel}>
              <MdExplore size={14} aria-hidden="true" />
              Active Cebu Radius
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
