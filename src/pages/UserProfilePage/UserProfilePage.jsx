import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdLink, MdPersonOff, MdStar } from "react-icons/md";
import CarGrid from "../../components/cars/CarGrid/CarGrid";
import ProfileHero from "../../components/profile/ProfileHero/ProfileHero";
import StatTile from "../../components/profile/StatTile/StatTile";
import Button from "../../components/common/Button/Button";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Spinner from "../../components/common/Spinner/Spinner";
import Toast from "../../components/common/Toast/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useLoginPrompt } from "../../hooks/useLoginPrompt";
import { useOwnerCars } from "../../hooks/useOwnerCars";
import { useStartChat } from "../../hooks/useStartChat";
import { useUserProfile } from "../../hooks/useUserProfile";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { LOAD_STATUS } from "../../constants/loadStatus";
import { countAvailable, summarizeRatings } from "../../utils/profileStats";
import { formatCount, formatRating } from "../../utils/formatters";
import styles from "./UserProfilePage.module.css";

const FALLBACK_NAME = "CaRent user";
const LINK_COPIED = "Profile link copied.";
const LINK_COPY_FAILED = "Couldn't copy the link. Copy it from the address bar.";

// Anyone's public profile: who they are and the cars they list.
export default function UserProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { requireLogin } = useLoginPrompt();
  const { profile, status: profileStatus, error: profileError, retry: retryProfile } =
    useUserProfile(userId);
  const { cars, status: carsStatus, retry: retryCars } = useOwnerCars(userId);
  const { favoriteIds, toggleFavorite, error: saveError, clearError } = useFavorites();
  const { startChat, error: chatError } = useStartChat();
  const [notice, setNotice] = useState("");

  const dismissToast = useCallback(() => {
    setNotice("");
    clearError();
  }, [clearError]);

  const loading = profileStatus === LOAD_STATUS.LOADING || carsStatus === LOAD_STATUS.LOADING;

  if (loading) {
    return (
      <main className={styles.page}>
        <Spinner />
      </main>
    );
  }

  if (profileStatus === LOAD_STATUS.ERROR && carsStatus === LOAD_STATUS.ERROR) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <ErrorState
            message={profileError}
            onRetry={() => {
              retryProfile();
              retryCars();
            }}
          />
        </div>
      </main>
    );
  }

  // No profile document and no listings: nothing to show
  if (!profile && cars.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <section className={styles.missing}>
            <span className={styles.missingIcon} aria-hidden="true">
              <MdPersonOff size={32} />
            </span>
            <h1 className={styles.missingTitle}>This profile isn&apos;t available</h1>
            <p className={styles.missingText}>
              The account may have been removed. Browse cars around Cebu instead.
            </p>
            <Button to={ROUTES.BROWSE}>Browse cars</Button>
          </section>
        </div>
      </main>
    );
  }

  const isSelf = Boolean(user) && user.uid === userId;
  // Older listings may belong to someone without a profile document: use the name on the car
  const name = profile?.name || cars[0]?.owner_name || FALLBACK_NAME;
  const firstName = name.split(" ")[0];
  const ratings = summarizeRatings(cars);
  const carsReady = carsStatus === LOAD_STATUS.READY;

  const handleFavorite = (carId) => {
    if (!requireLogin("Log in to save cars.")) return;
    toggleFavorite(carId);
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
            Marketplace
          </Link>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbCurrent} aria-current="page">
            {name}
          </span>
        </nav>

        <ProfileHero
          name={name}
          city={profile?.city}
          createdAt={profile?.created_at ?? null}
          photoUrl={profile?.photo_url}
        >
          <Button variant="secondary" onClick={handleCopyLink}>
            <MdLink size={18} aria-hidden="true" /> Share profile
          </Button>
          {isSelf && <Button to={ROUTES.EDIT_PROFILE}>Edit profile</Button>}
        </ProfileHero>

        <div className={styles.layout}>
          <section className={styles.main} aria-labelledby="cars-heading">
            <div className={styles.stats}>
              <StatTile
                label="Owner rating"
                value={ratings.avg == null ? "New" : formatRating(ratings.avg)}
                icon={ratings.avg != null ? <MdStar size={20} /> : null}
              />
              <StatTile label="Ratings" value={formatCount(ratings.count)} />
              <StatTile label="Cars listed" value={cars.length} />
              <StatTile label="Available now" value={countAvailable(cars)} />
            </div>

            <h2 id="cars-heading" className={styles.sectionTitle}>
              {isSelf ? "Your cars" : `${firstName}'s cars`}
            </h2>

            {carsReady && cars.length === 0 ? (
              <p className={styles.muted}>
                {isSelf ? "You haven't listed a car yet." : `${firstName} hasn't listed a car yet.`}
              </p>
            ) : (
              <CarGrid
                cars={cars}
                status={carsStatus}
                favoriteIds={favoriteIds}
                onFavorite={handleFavorite}
                onMessage={isSelf ? undefined : startChat}
                onRetry={retryCars}
                getDetailPath={buildPath.listing}
              />
            )}
          </section>

          <aside className={styles.side}>
            <section className={styles.card} aria-labelledby="about-heading">
              <h2 id="about-heading" className={styles.cardTitle}>
                About {firstName}
              </h2>
              {profile?.bio ? (
                <p className={styles.bio}>{profile.bio}</p>
              ) : (
                <p className={styles.muted}>
                  {isSelf ? "You haven't added a bio yet." : `${firstName} hasn't added a bio yet.`}
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>

      <Toast message={notice || saveError || chatError} onDismiss={dismissToast} />
    </main>
  );
}
