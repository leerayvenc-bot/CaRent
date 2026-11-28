import { useState } from "react";
import { getInitials } from "../../../utils/formatters";
import styles from "./Avatar.module.css";

// A round profile picture, or the person's initials when there's no photo
// (or it fails to load). The parent sets the size and colors with className.
//   name       used for the initials
//   src        photo URL, or "" for none
//   className  size, background and font from the parent
export default function Avatar({ name, src = "", className = "" }) {
  const [failedSrc, setFailedSrc] = useState("");
  const showImage = src && failedSrc !== src;

  return (
    <span className={`${styles.avatar} ${className}`} aria-hidden="true">
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
