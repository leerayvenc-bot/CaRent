import { useCallback, useState } from "react";
import MarkRentedDialog from "../../components/cars/MarkRentedDialog/MarkRentedDialog";
import MyListingCard from "../../components/cars/MyListingCard/MyListingCard";
import Button from "../../components/common/Button/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import Spinner from "../../components/common/Spinner/Spinner";
import Toast from "../../components/common/Toast/Toast";
import { useMyCars } from "../../hooks/useMyCars";
import { pluralize } from "../../utils/formatters";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { LOAD_STATUS } from "../../constants/loadStatus";
import styles from "./MyListingsPage.module.css";

const DIALOG = { RENT: "rent", DELETE: "delete" };

export default function MyListingsPage() {
  const {
    cars,
    status,
    error,
    retry,
    busyId,
    actionError,
    clearActionError,
    markRented,
    markAvailable,
    remove,
  } = useMyCars();

  // Which popup is open, and for which car: { type, car } or null
  const [dialog, setDialog] = useState(null);
  const closeDialog = useCallback(() => setDialog(null), []);

  const target = dialog?.car ?? null;
  const targetBusy = Boolean(target) && busyId === target.id;

  const handleRented = async (availableFrom) => {
    await markRented(target, availableFrom);
    setDialog(null); // if it failed, the toast explains why
  };
  const handleDelete = async () => {
    await remove(target);
    setDialog(null);
  };

  let content;
  if (status === LOAD_STATUS.LOADING) {
    content = <Spinner />;
  } else if (status === LOAD_STATUS.ERROR) {
    content = (
      <div className={styles.notice} role="alert">
        <h2 className={styles.noticeTitle}>Couldn&apos;t load your listings</h2>
        <p className={styles.noticeText}>{error}</p>
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  } else if (cars.length === 0) {
    content = (
      <div className={styles.notice}>
        <h2 className={styles.noticeTitle}>You haven&apos;t listed a car yet</h2>
        <p className={styles.noticeText}>Post your first car and renters can start messaging you.</p>
        <Button to={ROUTES.CREATE_LISTING}>Create listing</Button>
      </div>
    );
  } else {
    content = (
      <ul className={styles.list}>
        {cars.map((car) => (
          <li key={car.id}>
            <MyListingCard
              car={car}
              detailPath={buildPath.listing(car.id)}
              editPath={buildPath.editListing(car.id)}
              busy={busyId === car.id}
              onMarkRented={(c) => setDialog({ type: DIALOG.RENT, car: c })}
              onMarkAvailable={markAvailable}
              onDelete={(c) => setDialog({ type: DIALOG.DELETE, car: c })}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>My listings</h1>
            {status === LOAD_STATUS.READY && cars.length > 0 && (
              <p className={styles.count}>{pluralize(cars.length, "listing")}</p>
            )}
          </div>
          <Button to={ROUTES.CREATE_LISTING}>Create listing</Button>
        </header>

        {content}
      </div>

      <MarkRentedDialog
        open={dialog?.type === DIALOG.RENT}
        car={target}
        busy={targetBusy}
        onConfirm={handleRented}
        onCancel={closeDialog}
      />
      <ConfirmDialog
        open={dialog?.type === DIALOG.DELETE}
        title="Delete this listing?"
        message={target ? `"${target.model}" will be removed for good. This can't be undone.` : ""}
        confirmLabel="Delete listing"
        busy={targetBusy}
        onConfirm={handleDelete}
        onCancel={closeDialog}
      />
      <Toast message={actionError} onDismiss={clearActionError} />
    </main>
  );
}
