import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../config/firebase";

const PHOTO_FOLDER = "car-photos";
const PROFILE_PHOTO_FOLDER = "profile-photos";
const UPLOAD_ERROR = "Photo upload failed. Check your connection and try again.";
const LOGIN_ERROR = "Please log in to upload a photo.";
const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// Uploads to {folder}/{uid}/{random}.ext and returns the public URL.
async function uploadPhoto(folder, file) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error(LOGIN_ERROR);

  const extension = EXTENSIONS[file.type] ?? "jpg";
  const photoRef = ref(storage, `${folder}/${uid}/${crypto.randomUUID()}.${extension}`);

  try {
    await uploadBytes(photoRef, file, { contentType: file.type });
    return await getDownloadURL(photoRef);
  } catch (error) {
    console.error(error);
    throw new Error(UPLOAD_ERROR, { cause: error });
  }
}

export function uploadCarPhoto(file) {
  return uploadPhoto(PHOTO_FOLDER, file);
}

export function uploadProfilePhoto(file) {
  return uploadPhoto(PROFILE_PHOTO_FOLDER, file);
}

// Best effort: never throws. Links that aren't ours (sample cars) are ignored.
export async function deletePhotoByUrl(url) {
  if (!url) return;
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // not a Firebase Storage link, or already deleted
  }
}