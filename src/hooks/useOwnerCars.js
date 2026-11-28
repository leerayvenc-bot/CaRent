import { useCallback, useEffect, useState } from "react";
import { getCarsByOwner } from "../services/carService";
import { LOAD_STATUS } from "../constants/loadStatus";

// One user's listings, newest first. status: "loading" | "ready" | "error".
export function useOwnerCars(uid) {
  const [attempt, setAttempt] = useState(0);
  const key = `${uid}:${attempt}`;
  // Remember which request the result belongs to, so another user's cars never show
  const [result, setResult] = useState({ key: null, cars: [], error: "" });

  useEffect(() => {
    if (!uid) return undefined;
    let ignore = false;

    getCarsByOwner(uid)
      .then((cars) => {
        if (!ignore) setResult({ key, cars, error: "" });
      })
      .catch((err) => {
        if (!ignore) setResult({ key, cars: [], error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [uid, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const settled = result.key === key;
  const status = !settled
    ? LOAD_STATUS.LOADING
    : result.error
      ? LOAD_STATUS.ERROR
      : LOAD_STATUS.READY;

  return { cars: settled ? result.cars : [], status, error: settled ? result.error : "", retry };
}
