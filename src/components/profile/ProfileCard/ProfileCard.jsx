import { Link } from "react-router-dom";
import { MdLocationOn, MdMailOutline, MdPhotoCamera } from "react-icons/md";
import Avatar from "../Avatar/Avatar";
import { formatMonthYear } from "../../../utils/formatters";
import styles from "./ProfileCard.module.css";

// The left-hand card on My profile: avatar, name, details and an action.
//   profile        { name, email, city, bio, photo_url, created_at }
//   photoEditPath  where the camera button on the avatar goes (omit to hide it)
//   children       actions shown under the name (e.g. an Edit profile button)
export default function ProfileCard({ profile, photoEditPath, children }) {
  const { name, email, city, bio, photo_url: photoUrl, created_at: createdAt } = profile;
  const meta = [city, createdAt instanceof Date && `Member since ${formatMonthYear(createdAt)}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className={styles.card} aria-labelledby="profile-name">
      <div className={styles.identity}>
        <div className={styles.avatarWrap}>
          <Avatar name={name} src={photoUrl} className={styles.avatar} />
          {photoEditPath && (
            <Link to={photoEditPath} className={styles.photoButton} aria-label="Change profile photo">
              <MdPhotoCamera size={18} aria-hidden="true" />
            </Link>
          )}
        </div>
        <div>
          <h1 id="profile-name" className={styles.name}>
            {name || "Your name"}
          </h1>
          {meta && <p className={styles.meta}>{meta}</p>}
        </div>
      </div>

      {children && <div className={styles.actions}>{children}</div>}

      <dl className={styles.details}>
        {email && (
          <div className={styles.row}>
            <dt className={styles.term}>
              <MdMailOutline size={16} aria-hidden="true" /> Email
            </dt>
            <dd className={styles.value}>{email}</dd>
          </div>
        )}
        <div className={styles.row}>
          <dt className={styles.term}>
            <MdLocationOn size={16} aria-hidden="true" /> City
          </dt>
          <dd className={styles.value}>{city || "Not set"}</dd>
        </div>
      </dl>

      <div className={styles.about}>
        <h2 className={styles.aboutTitle}>About</h2>
        <p className={bio ? styles.bio : styles.muted}>
          {bio || "Add a short bio so owners and renters know who they're talking to."}
        </p>
      </div>
    </section>
  );
}
