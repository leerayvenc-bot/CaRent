import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const USERS_COLLECTION = "users";
const LOAD_ERROR = "Couldn't load this profile. Please try again.";

function toDate(value) {
  return typeof value?.toDate === "function" ? value.toDate() : null;
}

// What anyone may see about a user. Email stays private.
function toPublicProfile(uid, data) {
  return {
    uid,
    name: data.name ?? "",
    city: data.city ?? "",
    bio: data.bio ?? "",
    photo_url: data.photo_url ?? "",
    created_at: toDate(data.created_at),
  };
}

// Returns the public profile, or null if the user has no profile document.
export async function getPublicProfile(uid) {
  try {
    const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
    return snapshot.exists() ? toPublicProfile(uid, snapshot.data()) : null;
  } catch (error) {
    console.error(error);
    throw new Error(LOAD_ERROR, { cause: error });
  }
}
