import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { CARS_FETCH_LIMIT } from "../constants/carFilters";
import { getSampleCars } from "./sampleCars";

const CARS_COLLECTION = "cars";
const LOAD_ERROR = "Couldn't load cars. Check your connection and try again.";

// Set VITE_USE_SAMPLE_CARS=true in .env to show sample cars instead of Firestore
// (useful until the Create listing form exists). Restart `npm run dev` after changing it.
const USE_SAMPLE_CARS = import.meta.env.VITE_USE_SAMPLE_CARS === "true";

function toDate(value) {
  return typeof value?.toDate === "function" ? value.toDate() : value ?? null;
}

// Plain object with the document id and JS Dates (no Firestore types leak out)
function toCar(snapshot) {
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    available_from: toDate(data.available_from),
    created_at: toDate(data.created_at),
  };
}

// v1: fetch all listings once; search, filters and sort run in the browser.
export async function getAllCars() {
  if (USE_SAMPLE_CARS) return getSampleCars();

  try {
    const snapshot = await getDocs(query(collection(db, CARS_COLLECTION), limit(CARS_FETCH_LIMIT)));
    return snapshot.docs.map(toCar);
  } catch (error) {
    console.error(error);
    throw new Error(LOAD_ERROR);
  }
}
