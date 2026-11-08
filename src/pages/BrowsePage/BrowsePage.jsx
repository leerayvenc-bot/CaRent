import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/cars/SearchBar/SearchBar";
import FilterBar from "../../components/cars/FilterBar/FilterBar";
import ResultsHeader from "../../components/cars/ResultsHeader/ResultsHeader";
import CarGrid from "../../components/cars/CarGrid/CarGrid";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useCars } from "../../hooks/useCars";
import { useCarFilters } from "../../hooks/useCarFilters";
import { useFavorites } from "../../hooks/useFavorites";
import { filterCars, sortCars } from "../../utils/filterCars";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { AUTH_REASON, AUTH_REASON_TEXT } from "../../constants/authReasons";
import { LOAD_STATUS } from "../../constants/loadStatus";
import {
  ANY,
  DEFAULT_CITY,
  OTHER_AREA,
  PAGE_SIZE,
  PICKUP_AREAS,
  SEARCH_DEBOUNCE_MS,
  SLOW_LOADING_MS,
} from "../../constants/carFilters";
import styles from "./BrowsePage.module.css";

function headingFor(area) {
  if (area === ANY) return `Cars in ${DEFAULT_CITY}`;
  if (area === OTHER_AREA) return "Cars in other areas";
  return `Cars near ${PICKUP_AREAS.find((a) => a.value === area).label}`;
}

export default function BrowsePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { cars, status, retry, attempt } = useCars();
  const {
    filters,
    filterKey,
    hasActiveFilters,
    setQuery,
    setArea,
    setTypes,
    setPrice,
    setTransmission,
    setAvailableOnly,
    setSort,
    clearFilters,
  } = useCarFilters();
  const { favoriteIds, toggleFavorite, error: favoriteError, clearError } = useFavorites();
  const headingRef = useRef(null);

  // Search box text. Typing updates the URL after a short pause;
  // Enter or the Search button applies it right away.
  const [searchText, setSearchText] = useState(filters.query);
  const [syncedQuery, setSyncedQuery] = useState(filters.query);
  if (filters.query !== syncedQuery) {
    // The URL changed from outside (Back button, shared link): show its value
    setSyncedQuery(filters.query);
    if (filters.query !== searchText.trim()) setSearchText(filters.query);
  }

  useEffect(() => {
    if (searchText.trim() === filters.query) return undefined;
    const timer = setTimeout(() => setQuery(searchText, { replace: true }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchText, filters.query, setQuery]);

  const handleSearchChange = (name, value) => {
    if (name === "query") setSearchText(value);
    else setArea(value);
  };

  const handleSearchSubmit = () => {
    setQuery(searchText);
    headingRef.current?.focus();
  };

  const filterSetters = {
    types: setTypes,
    price: setPrice,
    transmission: setTransmission,
    availableOnly: setAvailableOnly,
    sort: setSort,
  };
  const handleFilterChange = (name, value) => filterSetters[name](value);

  // Results
  const results = useMemo(() => sortCars(filterCars(cars, filters), filters.sort), [cars, filters]);

  // Load more: 12 at a time, starting over whenever search, filters or sort change
  const [shown, setShown] = useState({ key: filterKey, count: PAGE_SIZE });
  const visibleCount = shown.key === filterKey ? shown.count : PAGE_SIZE;
  const visibleCars = results.slice(0, visibleCount);
  const loadMore = () => setShown({ key: filterKey, count: visibleCount + PAGE_SIZE });

  // "Still loading…" after 10 seconds
  const [slowAttempt, setSlowAttempt] = useState(null);
  useEffect(() => {
    if (status !== LOAD_STATUS.LOADING) return undefined;
    const timer = setTimeout(() => setSlowAttempt(attempt), SLOW_LOADING_MS);
    return () => clearTimeout(timer);
  }, [status, attempt]);
  const showSlowNotice = status === LOAD_STATUS.LOADING && slowAttempt === attempt;

  // Guests go to Login, then come back here
  const handleFavorite = (carId) => {
    if (authLoading) return;
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, {
        state: {
          from: location,
          reason: AUTH_REASON.SAVE,
          message: AUTH_REASON_TEXT[AUTH_REASON.SAVE],
        },
      });
      return;
    }
    toggleFavorite(carId);
  };

  const isReady = status === LOAD_STATUS.READY;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <SearchBar
          value={{ query: searchText, area: filters.area }}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onClear={clearFilters}
          showClear={hasActiveFilters}
        />

        <section className={styles.results} aria-labelledby="results-heading">
          <ResultsHeader
            ref={headingRef}
            id="results-heading"
            heading={headingFor(filters.area)}
            count={isReady ? results.length : null}
            slowNotice={showSlowNotice}
          />

          <CarGrid
            cars={visibleCars}
            status={status}
            emptyVariant={cars.length === 0 ? "no-listings" : "no-results"}
            city={DEFAULT_CITY}
            favoriteIds={favoriteIds}
            onFavorite={handleFavorite}
            onClear={clearFilters}
            onRetry={retry}
            getDetailPath={buildPath.listing}
            createListingPath={ROUTES.CREATE_LISTING}
          />

          {isReady && results.length > PAGE_SIZE && (
            <div className={styles.more}>
              <p className={styles.moreText}>
                Showing {visibleCars.length} of {results.length}
              </p>
              {visibleCars.length < results.length && (
                <Button variant="secondary" onClick={loadMore}>
                  Load more
                </Button>
              )}
            </div>
          )}
        </section>
      </div>

      <Toast message={favoriteError} onDismiss={clearError} />
    </main>
  );
}
