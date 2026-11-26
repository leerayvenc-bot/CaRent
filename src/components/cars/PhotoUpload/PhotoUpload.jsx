import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import CarPhoto from "../CarPhoto/CarPhoto";
import { MAX_PHOTO_MB, PHOTO_TYPES } from "../../../utils/validators";
import styles from "./PhotoUpload.module.css";

// Photo picker for the listing form. It only picks a file and shows a preview.
// The page decides when the upload happens.
//   file        the File picked in this session, or null
//   currentUrl  the saved photo when editing ("" when creating)
//   error       message to show, if any
//   onChange    called with a File, or null when the pick is removed
export default function PhotoUpload({
  name,
  file,
  currentUrl = "",
  error = "",
  onChange,
  onBlur,
}) {
  const id = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // A temporary address for showing the picked file. Freed when it changes.
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const shownSrc = previewUrl || currentUrl;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = ""; // so choosing the same file again still counts
    if (picked) onChange(picked);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onChange(dropped);
  };

    const dropzoneClass = `${styles.dropzone} ${dragging ? styles.dragging : ""}`;

  return (
   <div className={`${styles.field} ${error ? styles.invalid : ""}`}>
      <label id={labelId} className={styles.label} htmlFor={id}>
        Photo
      </label>

      {/* Hidden but still focusable, so the form can jump to it on errors */}
      <input
        ref={inputRef}
        id={id}
        className={styles.input}
        type="file"
        name={name}
        accept={PHOTO_TYPES.join(",")}
        tabIndex={shownSrc ? -1 : 0}
        aria-labelledby={labelId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        onChange={handlePick}
        onBlur={onBlur}
      />

      {shownSrc ? (
        <div className={styles.preview}>
          <div className={styles.frame}>
            <CarPhoto src={shownSrc} alt="Preview of your car photo" />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => inputRef.current?.click()}
            >
              {file ? "Choose a different photo" : "Replace photo"}
            </button>
            {file && (
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => onChange(null)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={dropzoneClass}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <MdAddPhotoAlternate className={styles.icon} aria-hidden="true" />
          <span className={styles.title}>Add a photo of your car</span>
          <span className={styles.dropHint}>
            Click to choose a file or drag it here
          </span>
        </label>
      )}

      <p id={hintId} className={styles.hint}>
        JPG, PNG or WebP, up to {MAX_PHOTO_MB} MB. Use a clear photo of the
        outside of the car.
      </p>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}