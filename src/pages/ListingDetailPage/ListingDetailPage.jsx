import { Link, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import CarPhoto from "../../components/cars/CarPhoto/CarPhoto";
import CarSpecs from "../../components/cars/CarSpecs/CarSpecs";
import ListingActions from "../../components/cars/ListingActions/ListingActions";
import Button from "../../components/common/Button/Button";
import Spinner from "../../components/common/Spinner/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useCar } from "../../hooks/useCar";
import { useLoginPrompt } from "../../hooks/useLoginPrompt";
import { useStartChat } from "../../hooks/useStartChat";
import { carTypeLabel } from "../../utils/carLabels";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { AUTH_REASON, AUTH_REASON_TEXT } from "../../constants/authReasons";
import { LOAD_STATUS } from "../../constants/loadStatus";
import styles from "./ListingDetailPage.module.css";

// Shown instead of the listing when it can't be loaded or doesn't exist
function Notice({ title, text, actionLabel, onAction, actionTo }) {
  return (
    <div className={styles.notice} role="alert">
      <h1 className={styles.noticeTitle}>{title}</h1>
      <p className={styles.noticeText}>{text}</p>
      <Button variant="secondary" to={actionTo} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

export default function ListingDetailPage() {
  const { carId } = useParams();
  const { car, status, error, retry } = useCar(carId);
  const { user, loading: authLoading } = useAuth();
  const { requireLogin } = useLoginPrompt();
  const { startChat, starting, error: chatError } = useStartChat();

  // Guests get the login popup first; a logged-in user opens (or resumes) the chat
  const handleMessage = () => {
    if (authLoading) return;
    if (!requireLogin(AUTH_REASON_TEXT[AUTH_REASON.MESSAGE_OWNER])) return;
    startChat(car);
  };

  let content;
  if (status === LOAD_STATUS.LOADING) {
    content = <Spinner />;
  } else if (status === LOAD_STATUS.ERROR) {
    content = (
      <Notice
        title="Couldn't load this listing"
        text={error}
        actionLabel="Try again"
        onAction={retry}
      />
    );
  } else if (!car) {
    content = (
      <Notice
        title="Listing not found"
        text="It may have been removed by its owner."
        actionLabel="Back to browse"
        actionTo={ROUTES.BROWSE}
      />
    );
  } else {
    const eyebrow = [carTypeLabel(car.car_type), car.tag]
      .filter(Boolean)
      .join(" · ");
    content = (
      <article className={styles.layout}>
        <header className={styles.header}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{car.model}</h1>
        </header>

        <div className={styles.photo}>
          <CarPhoto src={car.photo_url} alt={car.model} />
        </div>

        <div className={styles.side}>
          <ListingActions
            car={car}
            isOwner={Boolean(user) && user.uid === car.owner_id}
            editPath={buildPath.editListing(car.id)}
            onMessage={handleMessage}
            messaging={starting}
            error={chatError}
          />
        </div>

        <div className={styles.details}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Details</h2>
            <CarSpecs car={car} />
          </section>

          {car.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About this car</h2>
              <p className={styles.description}>{car.description}</p>
            </section>
          )}
        </div>
      </article>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link to={ROUTES.BROWSE} className={styles.back}>
          <MdArrowBack size={18} aria-hidden="true" />
          Back to browse
        </Link>
        {content}
      </div>
    </main>
  );
}
