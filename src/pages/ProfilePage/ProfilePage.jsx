import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDirectionsCar, MdFavorite, MdFavoriteBorder, MdStar } from "react-icons/md";
import CarGrid from "../../components/cars/CarGrid/CarGrid";
import FilterChip from "../../components/cars/FilterChip/FilterChip";
import ProfileCard from "../../components/profile/ProfileCard/ProfileCard";
import StatTile from "../../components/profile/StatTile/StatTile";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useOwnerCars } from "../../hooks/useOwnerCars";
import { useSavedCars } from "../../hooks/useSavedCars";
import { useStartChat } from "../../hooks/useStartChat";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { LOAD_STATUS } from "../../constants/loadStatus";
import { summarizeRatings } from "../../utils/profileStats";
import { formatCount, formatRating } from "../../utils/formatters";
import styles from "./ProfilePage.module.css";

const TAB = { LISTINGS: "listings", SAVED: "saved" };
const PENDING = "—";

// My profile: the logged-in user's details, stats, listings and saved cars.
export default function ProfilePage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { cars: myCars, status: listingsStatus, retry: retryListings } = useOwnerCars(user.uid);
  const {
    savedCars,
    favoriteIds,
    status: savedStatus,
    retry: retrySaved,
    toggleFavorite,
    error: favoriteError,
    clearError,
  } = useSavedCars();
  const { startChat, error: chatError } = useStartChat();

  const [tab, setTab] = useState(TAB.LISTINGS);
  // "Profile saved." after coming back from Edit profile
  const [notice, setNotice] = useState(location.state?.notice ?? "");

  // Clear the one-time notice from history so a refresh doesn't show it again
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  const dismissToast = useCallback(() => {
    setNotice("");
    clearError();
  }, [clearError]);

  const listingsReady = listingsStatus === LOAD_STATUS.READY;
  const savedReady = savedStatus === LOAD_STATUS.READY;
  const ratings = summarizeRatings(myCars);

  const showingListings = tab === TAB.LISTINGS;
  const activeCars = showingListings ? myCars : savedCars;
  const activeStatus = showingListings ? listingsStatus : savedStatus;
  const isEmpty = activeStatus === LOAD_STATUS.READY && activeCars.length === 0;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to={ROUTES.BROWSE} className={styles.crumbLink}>
            Marketplace
          </Link>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbCurrent} aria-current="page">
            My profile
          </span>
        </nav>

        <div className={styles.layout}>
          <aside className={styles.side}>
            <ProfileCard profile={user} photoEditPath={ROUTES.EDIT_PROFILE}>
              <Button to={ROUTES.EDIT_PROFILE}>Edit profile</Button>
              <Button variant="secondary" to={buildPath.userProfile(user.uid)}>
                View public profile
              </Button>
            </ProfileCard>
          </aside>

          <section className={styles.main} aria-label="Your activity">
            <div className={styles.stats}>
              <StatTile
                label="Cars listed"
                value={listingsReady ? myCars.length : PENDING}
              />
              <StatTile
                label="Owner rating"
                value={listingsReady ? (ratings.avg == null ? "New" : formatRating(ratings.avg)) : PENDING}
                icon={listingsReady && ratings.avg != null ? <MdStar size={20} /> : null}
              />
              <StatTile
                label="Ratings received"
                value={listingsReady ? formatCount(ratings.count) : PENDING}
              />
              <StatTile
                label="Saved cars"
                value={savedReady ? savedCars.length : PENDING}
                icon={<MdFavorite size={20} />}
                tone="accent"
              />
            </div>

            <div className={styles.panel}>
              <div className={styles.tabs} role="group" aria-label="Show">
                <FilterChip
                  label={listingsReady ? `My listings (${myCars.length})` : "My listings"}
                  selected={showingListings}
                  onClick={() => setTab(TAB.LISTINGS)}
                />
                <FilterChip
                  label={savedReady ? `Saved cars (${savedCars.length})` : "Saved cars"}
                  selected={!showingListings}
                  onClick={() => setTab(TAB.SAVED)}
                />
              </div>

              {isEmpty ? (
                <EmptyTab listings={showingListings} />
              ) : (
                <CarGrid
                  cars={activeCars}
                  status={activeStatus}
                  favoriteIds={favoriteIds}
                  onFavorite={toggleFavorite}
                  onMessage={showingListings ? undefined : startChat}
                  onRetry={showingListings ? retryListings : retrySaved}
                  getDetailPath={buildPath.listing}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      <Toast message={notice || favoriteError || chatError} onDismiss={dismissToast} />
    </main>
  );
}

function EmptyTab({ listings }) {
  const Icon = listings ? MdDirectionsCar : MdFavoriteBorder;
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">
        <Icon size={32} />
      </span>
      <h2 className={styles.emptyTitle}>
        {listings ? "You haven't listed a car yet" : "No saved cars yet"}
      </h2>
      <p className={styles.emptyText}>
        {listings
          ? "Post your car and renters around Cebu can message you about it."
          : "Tap the heart on any listing to keep it here for later."}
      </p>
      {listings ? (
        <Button to={ROUTES.CREATE_LISTING}>Create listing</Button>
      ) : (
        <Button to={ROUTES.BROWSE}>Browse cars</Button>
      )}
    </div>
  );
}
