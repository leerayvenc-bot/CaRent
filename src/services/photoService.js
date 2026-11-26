import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../config/firebase";

const PHOTO_FOLDER = "car-photos";
const UPLOAD_ERROR = "Photo upload failed. Check your connection and try again.";
const LOGIN_ERROR = "Please log in to upload a photo.";
const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// Uploads to car-photos/{uid}/{random}.ext and returns the public URL.
export async function uploadCarPhoto(file) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error(LOGIN_ERROR);

  const extension = EXTENSIONS[file.type] ?? "jpg";
  const photoRef = ref(
    storage,
    `${PHOTO_FOLDER}/${uid}/${crypto.randomUUID()}.${extension}`,
  );

  try {
    await uploadBytes(photoRef, file, { contentType: file.type });
    return await getDownloadURL(photoRef);
  } catch (error) {
    console.error(error);
    throw new Error(UPLOAD_ERROR, { cause: error });
  }
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