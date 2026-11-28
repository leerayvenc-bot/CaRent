import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useCar } from "./useCar";
import { updateCar } from "../services/carService";
import { buildPath } from "../constants/routePaths";

// Everything the Edit listing page needs: the car, whether this user may edit it,
// and a save action. save(values) never throws: a failed save sets `saveError`.
// (The Firestore rules also block anyone who isn't the owner. This check
// only decides what the page shows.)
export function useEditCar(carId) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { car, status, error, retry } = useCar(carId);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const canEdit = Boolean(user) && Boolean(car) && car.owner_id === user.uid;

  const save = useCallback(
    async (values) => {
      if (!canEdit || saving) return; // safety net: the page never offers this otherwise
      setSaving(true);
      setSaveError("");
      try {
        await updateCar(carId, values);
        navigate(buildPath.listing(carId));
      } catch (err) {
        setSaveError(err.message);
        setSaving(false); // stay on the form so nothing typed is lost
      }
    },
    [canEdit, saving, carId, navigate]
  );

  return { car, status, error, retry, canEdit, save, saving, saveError };
}
