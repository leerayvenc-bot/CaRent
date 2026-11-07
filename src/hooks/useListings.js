import { useCallback, useEffect, useMemo, useState } from "react";
// TODO: replace with the real Firestore listingService when it is ready.
import { getListings } from "../services/mockListingService";
import { FILTER, SORT } from "../constants/carFilters";
import { countHosts, filterListings, sortListings } from "../utils/listingFilters";

const LOAD_ERROR = "We couldn't load the cars right now. Please try again.";

// Loads listings and keeps the Browse page's filter, sort, and saved state.
export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(FILTER.ALL);
  const [sort, setSort] = useState(SORT.RECOMMENDED);
  // TODO: load and store saved listings with a saveService instead of local state.
  const [savedIds, setSavedIds] = useState(() => new Set());

  useEffect(() => {
    let ignore = false;

    getListings()
      .then((data) => {
        if (!ignore) setListings(data);
      })
      .catch(() => {
        if (!ignore) setError(LOAD_ERROR);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const visibleListings = useMemo(
    () => sortListings(filterListings(listings, filter), sort),
    [listings, filter, sort]
  );

  const toggleSaved = useCallback((carId) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      return next;
    });
  }, []);

  return {
    loading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    visibleListings,
    totalCount: listings.length,
    hostCount: countHosts(listings),
    savedIds,
    toggleSaved,
  };
}
