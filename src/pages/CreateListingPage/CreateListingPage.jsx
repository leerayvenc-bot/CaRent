import CarForm from "../../components/cars/CarForm/CarForm";
import { useCreateCar } from "../../hooks/useCreateCar";
import { ROUTES } from "../../constants/routePaths";
import styles from "./CreateListingPage.module.css";

export default function CreateListingPage() {
  const { create, submitting, error } = useCreateCar();

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>List your car</h1>
          <p className={styles.subtitle}>
            Renters will message you to ask if it&apos;s available. You decide
            the rest together.
          </p>
        </header>

        <CarForm
          onSubmit={create}
          submitting={submitting}
          error={error}
          submitLabel="Post listing"
          cancelPath={ROUTES.BROWSE}
        />
      </div>
    </main>
  );
}
