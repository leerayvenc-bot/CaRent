import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { CARS_FETCH_LIMIT } from "../constants/carFilters";
import { CAR_STATUS } from "../constants/carStatus";
import { getSampleCars } from "./sampleCars";

const CARS_COLLECTION = "cars";
const LOAD_ERROR = "Couldn't load cars. Check your connection and try again.";
const ONE_LOAD_ERROR = "Couldn't load this listing. Please try again.";
const SAVE_ERROR = "Couldn't save the listing. Please try again.";
const DELETE_ERROR = "Couldn't delete the listing. Please try again.";
const STATUS_ERROR = "Couldn't update the status. Please try again.";

// Set VITE_USE_SAMPLE_CARS=true in .env to show sample cars instead of Firestore
// (useful until the Create listing form exists). Restart `npm run dev` after changing it.
const USE_SAMPLE_CARS = import.meta.env.VITE_USE_SAMPLE_CARS === "true";

function toDate(value) {
  return typeof value?.toDate === "function" ? value.toDate() : (value ?? null);
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

// The fields an owner can type into the form. Nothing else can be edited.
// Firestore rejects `undefined`, so optional text falls back to "".
function toEditableFields(values) {
  return {
    model: values.model.trim(),
    price_per_day: Number(values.price_per_day),
    description: values.description?.trim() ?? "",
    car_type: values.car_type,
    transmission: values.transmission,
    fuel: values.fuel,
    seats: Number(values.seats),
    location: values.location,
    tag: values.tag?.trim() ?? "",
    photo_url: values.photo_url?.trim() ?? "",
  };
}

// v1: fetch all listings once; search, filters and sort run in the browser.
export async function getAllCars() {
  if (USE_SAMPLE_CARS) return getSampleCars();

  try {
    const snapshot = await getDocs(
      query(collection(db, CARS_COLLECTION), limit(CARS_FETCH_LIMIT)),
    );
    return snapshot.docs.map(toCar);
  } catch (error) {
    console.error(error);
    throw new Error(LOAD_ERROR, { cause: error });
  }
}

// Returns the car, or null if it doesn't exist.
export async function getCarById(carId) {
  if (USE_SAMPLE_CARS)
    return (await getSampleCars()).find((c) => c.id === carId) ?? null;

  try {
    const snapshot = await getDoc(doc(db, CARS_COLLECTION, carId));
    return snapshot.exists() ? toCar(snapshot) : null;
  } catch (error) {
    console.error(error);
    throw new Error(ONE_LOAD_ERROR, { cause: error });
  }
}

// One user's listings, newest first.
export async function getCarsByOwner(uid) {
  try {
    const snapshot = await getDocs(
      query(collection(db, CARS_COLLECTION), where("owner_id", "==", uid)),
    );
    return snapshot.docs
      .map(toCar)
      .sort(
        (a, b) =>
          (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0),
      );
  } catch (error) {
    console.error(error);
    throw new Error(LOAD_ERROR, { cause: error });
  }
}

// owner: { uid, name }. Returns the new listing's id.
export async function createCar(values, owner) {
  try {
    const ref = await addDoc(collection(db, CARS_COLLECTION), {
      ...toEditableFields(values),
      status: CAR_STATUS.AVAILABLE,
      available_from: null,
      owner_id: owner.uid,
      owner_name: owner.name,
      avg_rating: null,
      rating_count: 0,
      created_at: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR, { cause: error });
  }
}

export async function updateCar(carId, values) {
  try {
    await updateDoc(doc(db, CARS_COLLECTION, carId), toEditableFields(values));
  } catch (error) {
    console.error(error);
    throw new Error(SAVE_ERROR, { cause: error });
  }
}

// availableFrom (a Date) is only kept while the car is rented.
export async function setCarStatus(carId, status, availableFrom = null) {
  const isRented = status === CAR_STATUS.RENTED;
  try {
    await updateDoc(doc(db, CARS_COLLECTION, carId), {
      status,
      available_from: isRented ? availableFrom : null,
    });
  } catch (error) {
    console.error(error);
    throw new Error(STATUS_ERROR, { cause: error });
  }
}

export async function deleteCar(carId) {
  try {
    await deleteDoc(doc(db, CARS_COLLECTION, carId));
  } catch (error) {
    console.error(error);
    throw new Error(DELETE_ERROR, { cause: error });
  }
}
