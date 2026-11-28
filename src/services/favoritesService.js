import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Favorites live at users/{uid}/favorites/{carId}
const favoritesCollection = (uid) => collection(db, "users", uid, "favorites");
const favoriteDoc = (uid, carId) => doc(db, "users", uid, "favorites", carId);

const SAVE_ERROR = "Couldn't save. Try again.";
const LOAD_ERROR = "Couldn't load your saved cars.";
const BATCH_LIMIT = 400; // Firestore allows 500 writes per batch

// Returns [{ carId, savedAt }]. savedAt is a Date, or null for older entries.
export async function getFavorites(uid) {
  try {
    const snapshot = await getDocs(favoritesCollection(uid));
    return snapshot.docs.map((d) => ({
      carId: d.id,
      savedAt: d.data().created_at?.toDate?.() ?? null,
    }));
  } catch (error) {
    console.error(error);
    throw new Error(LOAD_ERROR, { cause: error });
  }
}

export async function getFavoriteIds(uid) {
  const favorites = await getFavorites(uid);
  return favorites.map((f) => f.carId);
}

export async function addFavorite(uid, carId) {
  try {
    await setDoc(favoriteDoc(uid, carId), { created_at: serverTimestamp() });
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR, { cause: error });
  }
}

export async function removeFavorite(uid, carId) {
  try {
    await deleteDoc(favoriteDoc(uid, carId));
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR, { cause: error });
  }
}

// Removes every saved car in the list
export async function clearFavorites(uid, carIds) {
  try {
    for (let i = 0; i < carIds.length; i += BATCH_LIMIT) {
      const batch = writeBatch(db);
      carIds.slice(i, i + BATCH_LIMIT).forEach((id) => batch.delete(favoriteDoc(uid, id)));
      await batch.commit();
    }
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR, { cause: error });
  }
}