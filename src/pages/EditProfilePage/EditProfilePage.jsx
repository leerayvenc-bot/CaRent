import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteOutline, MdErrorOutline, MdMailOutline, MdPhotoCamera } from "react-icons/md";
import Avatar from "../../components/profile/Avatar/Avatar";
import FormField from "../../components/common/FormField/FormField";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useEditProfile } from "../../hooks/useEditProfile";
import { ROUTES } from "../../constants/routePaths";
import { DEFAULT_CITY } from "../../constants/carFilters";
import {
  MAX_BIO_LENGTH,
  MAX_CITY_LENGTH,
  MAX_NAME_LENGTH,
  MAX_PHOTO_MB,
  PHOTO_TYPES,
  validateProfileForm,
  validateProfilePhoto,
} from "../../utils/validators";
import styles from "./EditProfilePage.module.css";

// Account settings: the logged-in user edits their photo, name, city and bio.
export default function EditProfilePage() {
  const { user } = useAuth();
  const { save, submitting, error } = useEditProfile();
  const [values, setValues] = useState({
    name: user.name ?? "",
    city: user.city ?? "",
    bio: user.bio ?? "",
    photo: null, // a newly picked File, uploaded on Save
    removePhoto: false,
  });
  const fileInputRef = useRef(null);
  // Why the last picked file was turned down ("" when it was fine)
  const [photoError, setPhotoError] = useState("");
  const clearPhotoError = useCallback(() => setPhotoError(""), []);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Only fields with a problem appear in this object
  const errors = validateProfileForm(values);
  const shown = (field) => (touched[field] || submitted ? (errors[field] ?? "") : "");

  // A temporary address for previewing the picked file. Freed when it changes.
  const previewUrl = useMemo(
    () => (values.photo ? URL.createObjectURL(values.photo) : ""),
    [values.photo],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const savedPhoto = values.removePhoto ? "" : (user.photo_url ?? "");
  const shownPhoto = previewUrl || savedPhoto;

  const handlePickPhoto = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // so choosing the same file again still counts
    if (!picked) return;
    // Check it right away: a file that can't be used never replaces the current photo
    const problem = validateProfilePhoto(picked);
    if (problem) {
      setPhotoError(problem);
      return;
    }
    setPhotoError("");
    setValues((v) => ({ ...v, photo: picked, removePhoto: false }));
  };

  const handleRemovePhoto = () => {
    setPhotoError("");
    setValues((v) => ({ ...v, photo: null, removePhoto: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    save({ ...values, photo_url: user.photo_url ?? "" });
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to={ROUTES.PROFILE} className={styles.crumbLink}>
            My profile
          </Link>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbCurrent} aria-current="page">
            Edit profile
          </span>
        </nav>

        <h1 className={styles.title}>Edit profile</h1>

        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <div className={styles.identity}>
            <Avatar name={values.name || user.name} src={shownPhoto} className={styles.avatar} />
            <div className={styles.identityText}>
              <p className={styles.identityName}>{values.name.trim() || "Your name"}</p>
              <p className={styles.identityEmail}>
                <MdMailOutline size={16} aria-hidden="true" />
                {user.email}
              </p>
              <div className={styles.photoActions}>
                <input
                  ref={fileInputRef}
                  id="profile-photo"
                  type="file"
                  accept={PHOTO_TYPES.join(",")}
                  className={styles.fileInput}
                  onChange={handlePickPhoto}
                  aria-describedby="profile-photo-hint"
                />
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  <MdPhotoCamera size={18} aria-hidden="true" />
                  {shownPhoto ? "Change photo" : "Upload photo"}
                </Button>
                {shownPhoto && (
                  <button type="button" className={styles.removePhoto} onClick={handleRemovePhoto}>
                    <MdDeleteOutline size={18} aria-hidden="true" />
                    Remove
                  </button>
                )}
              </div>
              <p id="profile-photo-hint" className={photoError ? styles.photoError : styles.photoHint}>
                {photoError ||
                  (values.photo
                    ? "New photo picked. It's saved when you click Save changes."
                    : `JPG, PNG or WebP, up to ${MAX_PHOTO_MB} MB.`)}
              </p>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Personal information</h2>

          <div className={styles.grid}>
            <FormField
              label="Full name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shown("name")}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="name"
              required
            />
            <FormField
              label="City"
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shown("city")}
              maxLength={MAX_CITY_LENGTH}
              placeholder={`e.g. ${DEFAULT_CITY}`}
              autoComplete="address-level2"
              optional
            />
          </div>

          <FormField
            as="textarea"
            label="Bio"
            name="bio"
            rows={4}
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shown("bio")}
            hint={`${values.bio.trim().length}/${MAX_BIO_LENGTH} · Shown on your public profile.`}
            maxLength={MAX_BIO_LENGTH}
            placeholder="Tell owners and renters a bit about yourself."
            optional
          />

          {error && (
            <p className={styles.error} role="alert">
              <MdErrorOutline size={18} aria-hidden="true" />
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <Button variant="secondary" to={ROUTES.PROFILE}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save changes
            </Button>
          </div>
        </form>
      </div>

      <Toast message={photoError} onDismiss={clearPhotoError} />
    </main>
  );
}
