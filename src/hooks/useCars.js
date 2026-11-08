import { useCallback, useEffect, useState } from "react";
import { getAllCars } from "../services/carService";
import { LOAD_STATUS } from "../constants/loadStatus";

// Loads every listing once. status: "loading" | "ready" | "error"
export function useCars() {
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState(LOAD_STATUS.LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    getAllCars()
      .then((data) => {
        if (ignore) return;
        setCars(data);
        setStatus(LOAD_STATUS.READY);
      })
      .catch(() => {
        if (!ignore) setStatus(LOAD_STATUS.ERROR);
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus(LOAD_STATUS.LOADING);
    setAttempt((n) => n + 1);
  }, []);

  return { cars, status, retry, attempt };
}
