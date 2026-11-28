import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { deleteCar, getCarsByOwner, setCarStatus } from "../services/carService";
import { CAR_STATUS } from "../constants/carStatus";
import { LOAD_STATUS } from "../constants/loadStatus";

// The logged-in user's own listings, plus the actions on them.
// markRented / markAvailable / remove return true when they worked.
// When one fails, `actionError` holds a message to show in a toast.
export function useMyCars() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [attempt, setAttempt] = useState(0);
  const key = `${uid}:${attempt}`;
  // Remember which request the result belongs to, so another user's cars never show
  const [result, setResult] = useState({ key: null, cars: [], error: "" });
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

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
  const clearActionError = useCallback(() => setActionError(""), []);

  // Runs one action on one car, then updates the list here instead of reloading it
  const runOnCar = useCallback(async (carId, action, applyToList) => {
    setBusyId(carId);
    setActionError("");
    try {
      await action();
      setResult((prev) => ({ ...prev, cars: applyToList(prev.cars) }));
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setBusyId(null);
    }
  }, []);

  const changeStatus = useCallback(
    (car, status, availableFrom = null) =>
      runOnCar(
        car.id,
        () => setCarStatus(car.id, status, availableFrom),
        (cars) =>
          cars.map((c) =>
            c.id === car.id
              ? { ...c, status, available_from: status === CAR_STATUS.RENTED ? availableFrom : null }
              : c
          )
      ),
    [runOnCar]
  );

  const markRented = useCallback(
    (car, availableFrom) => changeStatus(car, CAR_STATUS.RENTED, availableFrom),
    [changeStatus]
  );
  const markAvailable = useCallback(
    (car) => changeStatus(car, CAR_STATUS.AVAILABLE),
    [changeStatus]
  );
  const remove = useCallback(
    (car) =>
      runOnCar(
        car.id,
        () => deleteCar(car.id),
        (cars) => cars.filter((c) => c.id !== car.id)
      ),
    [runOnCar]
  );

  const settled = result.key === key;
  const status = !settled
    ? LOAD_STATUS.LOADING
    : result.error
      ? LOAD_STATUS.ERROR
      : LOAD_STATUS.READY;

  return {
    cars: settled ? result.cars : [],
    status,
    error: settled ? result.error : "",
    retry,
    busyId,
    actionError,
    clearActionError,
    markRented,
    markAvailable,
    remove,
  };
}
