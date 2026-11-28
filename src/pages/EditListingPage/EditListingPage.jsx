import { useParams } from "react-router-dom";
import CarForm from "../../components/cars/CarForm/CarForm";
import Notice from "../../components/common/Notice/Notice";
import Spinner from "../../components/common/Spinner/Spinner";
import { useEditCar } from "../../hooks/useEditCar";
import { buildPath, ROUTES } from "../../constants/routePaths";
import { LOAD_STATUS } from "../../constants/loadStatus";
import styles from "./EditListingPage.module.css";

export default function EditListingPage() {
  const { carId } = useParams();
  const { car, status, error, retry, canEdit, save, saving, saveError } = useEditCar(carId);

  let content;
  if (status === LOAD_STATUS.LOADING) {
    content = <Spinner />;
  } else if (status === LOAD_STATUS.ERROR) {
    content = (
      <Notice title="Couldn't load this listing" text={error} actionLabel="Try again" onAction={retry} />
    );
  } else if (!car) {
    content = (
      <Notice
        title="Listing not found"
        text="It may have been removed by its owner."
        actionLabel="Back to my listings"
        actionTo={ROUTES.MY_LISTINGS}
      />
    );
  } else if (!canEdit) {
    content = (
      <Notice
        title="You can't edit this listing"
        text="Only the person who posted a car can change it."
        actionLabel="View listing"
        actionTo={buildPath.listing(car.id)}
      />
    );
  } else {
    content = (
      <>
        <header className={styles.header}>
          <h1 className={styles.title}>Edit listing</h1>
          <p className={styles.subtitle}>{car.model}</p>
        </header>

        {/* key makes the form start fresh if you open a different car */}
        <CarForm
          key={car.id}
          initialValues={car}
          onSubmit={save}
          submitting={saving}
          error={saveError}
          submitLabel="Save changes"
          cancelPath={buildPath.listing(car.id)}
        />
      </>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>{content}</div>
    </main>
  );
}
