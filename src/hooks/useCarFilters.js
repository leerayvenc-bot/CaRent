import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ANY,
  CAR_TYPE_OPTIONS,
  FILTER_PARAM,
  PICKUP_AREAS,
  PRICE_BANDS,
  SORT,
  SORT_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "../constants/carFilters";

const valuesOf = (options) => new Set(options.map((o) => o.value));
const TYPE_VALUES = valuesOf(CAR_TYPE_OPTIONS);
const PRICE_VALUES = valuesOf(PRICE_BANDS);
const TRANSMISSION_VALUES = valuesOf(TRANSMISSION_OPTIONS);
const SORT_VALUES = valuesOf(SORT_OPTIONS);
const AREA_VALUES = valuesOf(PICKUP_AREAS);

// Unknown values in the URL are ignored, so a bad link still shows a valid page.
function pick(params, key, allowed, fallback) {
  const value = params.get(key);
  return allowed.has(value) ? value : fallback;
}

function readFilters(params) {
  return {
    query: params.get(FILTER_PARAM.QUERY) ?? "",
    area: pick(params, FILTER_PARAM.AREA, AREA_VALUES, ANY),
    types: (params.get(FILTER_PARAM.TYPE) ?? "").split(",").filter((t) => TYPE_VALUES.has(t)),
    price: pick(params, FILTER_PARAM.PRICE, PRICE_VALUES, ANY),
    transmission: pick(params, FILTER_PARAM.TRANSMISSION, TRANSMISSION_VALUES, ANY),
    availableOnly: params.get(FILTER_PARAM.AVAILABLE) === "1",
    sort: pick(params, FILTER_PARAM.SORT, SORT_VALUES, SORT.RECOMMENDED),
  };
}

function writeParam(params, key, value) {
  const isEmpty =
    value === ANY || value == null || value === false || (Array.isArray(value) && value.length === 0);
  if (isEmpty) params.delete(key);
  else if (value === true) params.set(key, "1");
  else params.set(key, Array.isArray(value) ? value.join(",") : String(value));
}

// Keeps search, filter and sort values in the URL query params, so refresh,
// Back, and shared links restore the same view.
export function useCarFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);

  const update = useCallback(
    (changes, { replace = false } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => writeParam(next, key, value));
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  const setQuery = useCallback(
    (query, options) => update({ [FILTER_PARAM.QUERY]: query.trim() }, options),
    [update]
  );
  const setArea = useCallback((area) => update({ [FILTER_PARAM.AREA]: area }), [update]);
  const setTypes = useCallback((types) => update({ [FILTER_PARAM.TYPE]: types }), [update]);
  const setPrice = useCallback((price) => update({ [FILTER_PARAM.PRICE]: price }), [update]);
  const setTransmission = useCallback(
    (transmission) => update({ [FILTER_PARAM.TRANSMISSION]: transmission }),
    [update]
  );
  const setAvailableOnly = useCallback(
    (availableOnly) => update({ [FILTER_PARAM.AVAILABLE]: availableOnly }),
    [update]
  );
  const setSort = useCallback(
    (sort) => update({ [FILTER_PARAM.SORT]: sort === SORT.RECOMMENDED ? ANY : sort }),
    [update]
  );

  // Resets filters only. Search text, pickup area and sort stay.
  const clearFilters = useCallback(
    () =>
      update({
        [FILTER_PARAM.TYPE]: ANY,
        [FILTER_PARAM.PRICE]: ANY,
        [FILTER_PARAM.TRANSMISSION]: ANY,
        [FILTER_PARAM.AVAILABLE]: ANY,
      }),
    [update]
  );

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.price !== ANY ||
    filters.transmission !== ANY ||
    filters.availableOnly;

  return {
    filters,
    filterKey: params.toString(),
    hasActiveFilters,
    setQuery,
    setArea,
    setTypes,
    setPrice,
    setTransmission,
    setAvailableOnly,
    setSort,
    clearFilters,
  };
}
