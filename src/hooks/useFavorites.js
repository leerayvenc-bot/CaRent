import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { addFavorite, getFavoriteIds, removeFavorite } from "../services/favoritesService";

const SAVE_ERROR = "Couldn't save. Try again.";
const NO_FAVORITES = new Set();

// The logged-in user's saved cars, with an optimistic toggle.
export function useFavorites() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  // Remember whose favorites these are, so a different user never sees them.
  const [saved, setSaved] = useState({ uid: null, ids: NO_FAVORITES });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) return undefined;
    let ignore = false;

    getFavoriteIds(uid)
      .then((ids) => {
        if (!ignore) setSaved({ uid, ids: new Set(ids) });
      })
      .catch(() => {
        // Hearts just start empty; saving still works.
      });

    return () => {
      ignore = true;
    };
  }, [uid]);

  const favoriteIds = saved.uid === uid && uid ? saved.ids : NO_FAVORITES;

  const setOne = useCallback(
    (carId, isSaved) => {
      setSaved((prev) => {
        const ids = new Set(prev.uid === uid ? prev.ids : []);
        if (isSaved) ids.add(carId);
        else ids.delete(carId);
        return { uid, ids };
      });
    },
    [uid]
  );

  const toggleFavorite = useCallback(
    async (carId) => {
      if (!uid) return;
      const willSave = !favoriteIds.has(carId);
      setOne(carId, willSave); // update the heart right away
      try {
        if (willSave) await addFavorite(uid, carId);
        else await removeFavorite(uid, carId);
      } catch {
        setOne(carId, !willSave); // put it back
        setError(SAVE_ERROR);
      }
    },
    [uid, favoriteIds, setOne]
  );

  const clearError = useCallback(() => setError(""), []);

  return { favoriteIds, toggleFavorite, error, clearError };
}
