import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteSweep, MdFavoriteBorder, MdDirectionsCar, MdInfoOutline } from "react-icons/md";
import CarGrid from "../../components/cars/CarGrid/CarGrid";
import FilterChip from "../../components/cars/FilterChip/FilterChip";
import SortSelect from "../../components/cars/SortSelect/SortSelect";
import Button from "../../components/common/Button/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import Toast from "../../components/common/Toast/Toast";
import { useSavedCars } from "../../hooks/useSavedCars";
import { useStartChat } from "../../hooks/useStartChat";
import { sortCars } from "../../utils/filterCars";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { CAR_STATUS } from "../../constants/carStatus";
import { LOAD_STATUS } from "../../constants/loadStatus";
import { SORT } from "../../constants/carFilters";
import {
  SAVED_FILTER,
  SAVED_FILTER_OPTIONS,
  SAVED_SORT_OPTIONS,
  SAVED_SORT_RECENT,
} from "../../constants/savedFilters";
import styles from "./SavedPage.module.css";

const POPULAR_COUNT = 3;

export default function SavedPage() {
  const {
    savedCars,
    allCars,
    favoriteIds,
    status,
    retry,
    toggleFavorite,
    clearAll,
    error: favoriteError,
    clearError,
  } = useSavedCars();
  const { startChat, error: chatError } = useStartChat();

  const [filter, setFilter] = useState(SAVED_FILTER.ALL);
  const [sort, setSort] = useState(SAVED_SORT_RECENT);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isReady = status === LOAD_STATUS.READY;
  const isEmpty = isReady && savedCars.length === 0;

  // Number shown on each chip
  const counts = useMemo(
    () =>
      SAVED_FILTER_OPTIONS.reduce((acc, option) => {
        acc[option.value] = option.status
          ? savedCars.filter((car) => car.status === option.status).length
          : savedCars.length;
        return acc;
      }, {}),
    [savedCars]
  );

  // Filter by chip, then sort ("Recently saved" keeps the order from the hook)
  const visibleCars = useMemo(() => {
    const wanted = SAVED_FILTER_OPTIONS.find((o) => o.value === filter)?.status;
    const list = wanted ? savedCars.filter((car) => car.status === wanted) : savedCars;
    return sort === SAVED_SORT_RECENT ? list : sortCars(list, sort);
  }, [savedCars, filter, sort]);

  // Empty state: best-rated available cars
  const popularCars = useMemo(
    () =>
      sortCars(
        allCars.filter((car) => car.status === CAR_STATUS.AVAILABLE),
        SORT.RATING
      ).slice(0, POPULAR_COUNT),
    [allCars]
  );

  const handleConfirmClear = () => {
    setConfirmOpen(false);
    setFilter(SAVED_FILTER.ALL);
    clearAll();
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to={ROUTES.BROWSE} className={styles.crumbLink}>
            Marketplace
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Saved Cars</span>
        </nav>

        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Saved cars
              {isReady && <span className={styles.count}>{savedCars.length} saved</span>}
            </h1>
            <p className={styles.subtitle}>
              Vehicles you&apos;ve favorited for your trips around Cebu City and Central Visayas.
            </p>
          </div>

          {isReady && !isEmpty && (
            <div className={styles.controls}>
              <SortSelect value={sort} onChange={setSort} options={SAVED_SORT_OPTIONS} />
              <button type="button" className={styles.clearAll} onClick={() => setConfirmOpen(true)}>
                <MdDeleteSweep size={18} aria-hidden="true" />
                Clear all saved
              </button>
            </div>
          )}
        </header>

        {isEmpty ? (
          <>
            <section className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <MdFavoriteBorder size={32} />
              </span>
              <h2 className={styles.emptyTitle}>No saved cars yet</h2>
              <p className={styles.emptyText}>
                When you find a car you like while browsing Cebu listings, click the heart icon to
                save it here for quick access later.
              </p>
              <Button to={ROUTES.BROWSE}>Browse cars</Button>
            </section>

            {popularCars.length > 0 && (
              <section className={styles.popular} aria-labelledby="popular-heading">
                <div className={styles.popularHeader}>
                  <h2 id="popular-heading" className={styles.popularTitle}>
                    Popular cars in Cebu right now
                  </h2>
                  <Link to={ROUTES.BROWSE} className={styles.viewAll}>
                    View all
                  </Link>
                </div>
                <CarGrid
                  cars={popularCars}
                  status={LOAD_STATUS.READY}
                  favoriteIds={favoriteIds}
                  onFavorite={toggleFavorite}
                  getDetailPath={buildPath.listing}
                />
              </section>
            )}
          </>
        ) : (
          <>
            {isReady && (
              <div className={styles.chips} role="group" aria-label="Filter saved cars">
                {SAVED_FILTER_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={`${option.label} (${counts[option.value]})`}
                    selected={filter === option.value}
                    onClick={() => setFilter(option.value)}
                  />
                ))}
              </div>
            )}

            <CarGrid
              cars={visibleCars}
              status={status}
              emptyVariant="no-results"
              favoriteIds={favoriteIds}
              onFavorite={toggleFavorite}
              onMessage={startChat}
              onClear={() => setFilter(SAVED_FILTER.ALL)}
              onRetry={retry}
              getDetailPath={buildPath.listing}
            />

            {isReady && (
              <aside className={styles.tip}>
                <span className={styles.tipIcon} aria-hidden="true">
                  <MdDirectionsCar size={22} />
                </span>
                <p className={styles.tipText}>
                  <MdInfoOutline size={16} aria-hidden="true" />
                  <strong>Tip:</strong> Saved cars remain in your list until you unfavorite them.
                  Prices and dates are set directly by local Cebu hosts.
                </p>
                <Button to={ROUTES.BROWSE}>Browse more cars</Button>
              </aside>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Clear all saved cars?"
        message="This removes every car from your saved list. You can save them again any time."
        confirmLabel="Clear all"
        onConfirm={handleConfirmClear}
        onCancel={() => setConfirmOpen(false)}
      />

      <Toast message={favoriteError || chatError} onDismiss={clearError} />
    </main>
  );
}