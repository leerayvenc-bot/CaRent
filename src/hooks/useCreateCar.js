import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { createCar } from "../services/carService";
import { buildPath } from "../constants/routePaths";

const FALLBACK_OWNER_NAME = "Owner";

// Saves a new listing for the logged-in user, then opens it.
// create(values) never throws: a failed save sets `error` for the page to show.
export function useCreateCar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const create = useCallback(
    async (values) => {
      if (!user || submitting) return; // the route is protected; this is a safety net
      setSubmitting(true);
      setError("");
      try {
        const carId = await createCar(values, {
          uid: user.uid,
          name: user.name || FALLBACK_OWNER_NAME,
        });
        navigate(buildPath.listing(carId));
      } catch (err) {
        setError(err.message);
        setSubmitting(false); // stay on the form so nothing typed is lost
      }
    },
    [user, submitting, navigate],
  );

  return { create, submitting, error };
}
