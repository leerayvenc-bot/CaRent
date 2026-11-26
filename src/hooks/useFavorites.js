import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import {
  addFavorite,
  clearFavorites,
  getFavorites,
  removeFavorite,
} from "../services/favoritesService";

const SAVE_ERROR = "Couldn't save. Try again.";
const NO_FAVORITES = new Map();

// The logged-in user's saved cars (carId -> savedAt), with an optimistic toggle.
export function useFavorites() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  // Remember whose favorites these are, so a different user never sees them.
  const [saved, setSaved] = useState({ uid: null, items: NO_FAVORITES });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) return undefined;
    let ignore = false;

    getFavorites(uid)
      .then((list) => {
        if (!ignore) {
          setSaved({ uid, items: new Map(list.map((f) => [f.carId, f.savedAt])) });
        }
      })
      .catch(() => {
        // Hearts just start empty; saving still works.
        if (!ignore) setSaved({ uid, items: new Map() });
      });

    return () => {
      ignore = true;
    };
  }, [uid]);

  const ready = Boolean(uid) && saved.uid === uid;
  const items = ready ? saved.items : NO_FAVORITES;
  const favoriteIds = useMemo(() => new Set(items.keys()), [items]);

  const setOne = useCallback(
    (carId, isSaved, savedAt = new Date()) => {
      setSaved((prev) => {
        const next = new Map(prev.uid === uid ? prev.items : []);
        if (isSaved) next.set(carId, savedAt);
        else next.delete(carId);
        return { uid, items: next };
      });
    },
    [uid]
  );

  const toggleFavorite = useCallback(
    async (carId) => {
      if (!uid) return;
      const willSave = !items.has(carId);
      const previous = items.get(carId);
      setOne(carId, willSave); // update the heart right away
      try {
        if (willSave) await addFavorite(uid, carId);
        else await removeFavorite(uid, carId);
      } catch {
        setOne(carId, !willSave, previous); // put it back
        setError(SAVE_ERROR);
      }
    },
    [uid, items, setOne]
  );

  const clearAll = useCallback(async () => {
    if (!uid) return;
    const previous = items;
    setSaved({ uid, items: new Map() });
    try {
      await clearFavorites(uid, [...previous.keys()]);
    } catch {
      setSaved({ uid, items: previous }); // put everything back
      setError(SAVE_ERROR);
    }
  }, [uid, items]);

  const clearError = useCallback(() => setError(""), []);

  return { favoriteIds, savedAt: items, ready, toggleFavorite, clearAll, error, clearError };
}