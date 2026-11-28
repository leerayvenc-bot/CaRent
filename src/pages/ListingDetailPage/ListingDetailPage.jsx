import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdSearchOff } from "react-icons/md";
import CarPhoto from "../../components/cars/CarPhoto/CarPhoto";
import FavoriteButton from "../../components/cars/FavoriteButton/FavoriteButton";
import ListingPanel from "../../components/cars/ListingPanel/ListingPanel";
import StatusBadge from "../../components/cars/StatusBadge/StatusBadge";
import RatingsSection from "../../components/ratings/RatingsSection/RatingsSection";
import Button from "../../components/common/Button/Button";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Spinner from "../../components/common/Spinner/Spinner";
import Toast from "../../components/common/Toast/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useCar } from "../../hooks/useCar";
import { useFavorites } from "../../hooks/useFavorites";
import { useLoginPrompt } from "../../hooks/useLoginPrompt";
import { useStartChat } from "../../hooks/useStartChat";
import { useUserProfile } from "../../hooks/useUserProfile";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { FILTER_PARAM } from "../../constants/carFilters";
import { LOAD_STATUS } from "../../constants/loadStatus";
import { carTypeLabel } from "../../utils/carLabels";
import styles from "./ListingDetailPage.module.css";

const LINK_COPIED = "Link copied.";
const LINK_COPY_FAILED = "Couldn't copy the link. Copy it from the address bar.";

export default function ListingDetailPage() {
  const { carId } = useParams();
  const { car, status, error, retry } = useCar(carId);
  // Only for the owner's photo; if it can't load, the Owner box shows initials
  const { profile: owner } = useUserProfile(car?.owner_id);
  const { user } = useAuth();
  const { requireLogin } = useLoginPrompt();
  const { favoriteIds, toggleFavorite, error: saveError, clearError } = useFavorites();
  const { startChat, starting, error: chatError } = useStartChat();
  const [notice, setNotice] = useState("");

  const dismissToast = useCallback(() => {
    setNotice("");
    clearError();
  }, [clearError]);

  if (status === LOAD_STATUS.LOADING) {
    return (
      <main className={styles.page}>
        <Spinner />
      </main>
    );
  }

  if (status === LOAD_STATUS.ERROR) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <ErrorState message={error} onRetry={retry} />
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <section className={styles.missing}>
            <span className={styles.missingIcon} aria-hidden="true">
              <MdSearchOff size={32} />
            </span>
            <h1 className={styles.missingTitle}>This listing isn&apos;t available</h1>
            <p className={styles.missingText}>
              The owner may have removed it. Browse other cars around Cebu instead.
            </p>
            <Button to={ROUTES.BROWSE}>Browse cars</Button>
          </section>
        </div>
      </main>
    );
  }

  const isOwner = Boolean(user) && user.uid === car.owner_id;
  const saved = favoriteIds.has(car.id);
  const typeLabel = carTypeLabel(car.car_type);

  const handleToggleSave = () => {
    if (!requireLogin("Log in to save cars.")) return;
    toggleFavorite(car.id);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice(LINK_COPIED);
    } catch {
      setNotice(LINK_COPY_FAILED);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to={ROUTES.BROWSE} className={styles.crumbLink}>
            Browse
          </Link>
          {typeLabel && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                to={`${ROUTES.BROWSE}?${FILTER_PARAM.TYPE}=${car.car_type}`}
                className={styles.crumbLink}
              >
                {typeLabel}s
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className={styles.crumbCurrent} aria-current="page">
            {car.model}
          </span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.photo}>
            <CarPhoto src={car.photo_url} alt={car.model} />
            <span className={styles.photoBadge}>
              <StatusBadge status={car.status} />
            </span>
            {!isOwner && (
              <span className={styles.photoFavorite}>
                <FavoriteButton active={saved} onToggle={handleToggleSave} label={car.model} />
              </span>
            )}
          </div>

          <aside className={styles.panel}>
            <ListingPanel
              car={car}
              isOwner={isOwner}
              editPath={buildPath.editListing(car.id)}
              ownerPath={car.owner_id ? buildPath.userProfile(car.owner_id) : undefined}
              ownerPhotoUrl={owner?.photo_url}
              saved={saved}
              onToggleSave={handleToggleSave}
              onMessage={() => startChat(car)}
              messaging={starting}
              onCopyLink={handleCopyLink}
              error={chatError}
            />
          </aside>

          <section className={`${styles.card} ${styles.about}`} aria-labelledby="about-heading">
            <h2 id="about-heading" className={styles.cardTitle}>
              About this car
            </h2>
            {car.description ? (
              <p className={styles.description}>{car.description}</p>
            ) : (
              <p className={styles.muted}>The owner hasn&apos;t added a description yet.</p>
            )}
          </section>

          <div className={styles.ratings}>
            <RatingsSection avg={car.avg_rating} count={car.rating_count} isOwner={isOwner} />
          </div>
        </div>
      </div>

      <Toast message={notice || saveError} onDismiss={dismissToast} />
    </main>
  );
}
