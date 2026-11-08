import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Favorites live at users/{uid}/favorites/{carId}
const favoritesCollection = (uid) => collection(db, "users", uid, "favorites");
const favoriteDoc = (uid, carId) => doc(db, "users", uid, "favorites", carId);

const SAVE_ERROR = "Couldn't save. Try again.";
const LOAD_ERROR = "Couldn't load your saved cars.";

export async function getFavoriteIds(uid) {
  try {
    const snapshot = await getDocs(favoritesCollection(uid));
    return snapshot.docs.map((d) => d.id);
  } catch (error) {
    console.error(error);
    throw new Error(LOAD_ERROR);
  }
}

export async function addFavorite(uid, carId) {
  try {
    await setDoc(favoriteDoc(uid, carId), { created_at: serverTimestamp() });
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR);
  }
}

export async function removeFavorite(uid, carId) {
  try {
    await deleteDoc(favoriteDoc(uid, carId));
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR);
  }
}
