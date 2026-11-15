import { useCallback, useEffect, useState } from "react";
import { getCarById } from "../services/carService";
import { LOAD_STATUS } from "../constants/loadStatus";

// Loads one listing. status: "loading" | "ready" | "error".
// When status is "ready" and car is null, no listing has that id.
export function useCar(carId) {
  const [attempt, setAttempt] = useState(0);
  const key = `${carId}:${attempt}`;
  // Remember which request the result belongs to, so a car you just left never shows
  const [result, setResult] = useState({ key: null, car: null, error: "" });

  useEffect(() => {
    if (!carId) return undefined;
    let ignore = false;

    getCarById(carId)
      .then((car) => {
        if (!ignore) setResult({ key, car, error: "" });
      })
      .catch((err) => {
        if (!ignore) setResult({ key, car: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [carId, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const settled = result.key === key;
  const status = !settled
    ? LOAD_STATUS.LOADING
    : result.error
      ? LOAD_STATUS.ERROR
      : LOAD_STATUS.READY;

  return {
    car: settled ? result.car : null,
    status,
    error: settled ? result.error : "",
    retry,
  };
}
