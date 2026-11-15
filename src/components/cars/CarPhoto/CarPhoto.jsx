import { useState } from "react";
import { MdDirectionsCar } from "react-icons/md";
import styles from "./CarPhoto.module.css";

// The big photo on the detail page. Shows a car icon if there is no photo
// or the link is broken.
export default function CarPhoto({ src, alt }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = src && failedSrc !== src;

  return (
    <div className={styles.frame}>
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div
          className={styles.placeholder}
          role="img"
          aria-label="No photo available"
        >
          <MdDirectionsCar size={72} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
