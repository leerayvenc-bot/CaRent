import { useState } from "react";
import Modal from "../../common/Modal/Modal";
import Button from "../../common/Button/Button";
import FormField from "../../common/FormField/FormField";
import {
  fromInputValue,
  todayInputValue,
  validateAvailableFrom,
} from "../../../utils/availability";
import styles from "./MarkRentedDialog.module.css";

// Asks when the car is free again (optional) before marking it as rented.
//   onConfirm  called with a Date, or null when the owner left the date blank
function RentedForm({ car, busy, onConfirm, onCancel }) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const error = validateAvailableFrom(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    onConfirm(fromInputValue(value));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.text}>
        <strong>{car.model}</strong> will show as rented on Browse. You can mark it as available
        again at any time.
      </p>

      <FormField
        label="Available again on"
        name="available_from"
        type="date"
        optional
        min={todayInputValue()}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setTouched(true);
        }}
        error={touched ? error : ""}
        hint="Leave blank if you're not sure yet."
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Mark as rented
        </Button>
      </div>
    </form>
  );
}

export default function MarkRentedDialog({ open, car, busy, onConfirm, onCancel }) {
  return (
    <Modal open={open} title="Mark as rented" onClose={onCancel}>
      {car && <RentedForm car={car} busy={busy} onConfirm={onConfirm} onCancel={onCancel} />}
    </Modal>
  );
}
