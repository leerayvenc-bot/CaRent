import { useRef, useState } from "react";
import FormField from "../../common/FormField/FormField";
import Button from "../../common/Button/Button";
import {
  CAR_TYPE_OPTIONS,
  FUEL_OPTIONS,
  PICKUP_AREAS,
  TRANSMISSION_OPTIONS,
} from "../../../constants/carFilters";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_MODEL_LENGTH,
  MAX_SEATS,
  MAX_TAG_LENGTH,
  MIN_SEATS,
  validateCarForm,
} from "../../../utils/validators";
import styles from "./CarForm.module.css";

const EMPTY_VALUES = {
  model: "",
  price_per_day: "",
  car_type: "",
  transmission: "",
  fuel: "",
  seats: "",
  location: "",
  tag: "",
  description: "",
  photo_url: "",
};

// Inputs hold strings, so numbers from a saved car are turned into text
function toFormValues(car) {
  if (!car) return EMPTY_VALUES;
  return Object.fromEntries(
    Object.keys(EMPTY_VALUES).map((key) => [key, String(car[key] ?? "")]),
  );
}

// The form for creating or editing a listing. It only collects and checks input.
// The page decides what to do with the values.
//   initialValues  a car object when editing, nothing when creating
//   onSubmit       called with the form's values once they pass validation
//   submitting     true while the page is saving
//   error          a message from the failed save, if any
//   cancelPath     where the Cancel button goes
// When editing, give the form key={car.id} so it resets if the car changes.
export default function CarForm({
  initialValues,
  onSubmit,
  submitting = false,
  error = "",
  submitLabel = "Save listing",
  cancelPath,
}) {
  const formRef = useRef(null);
  const [values, setValues] = useState(() => toFormValues(initialValues));
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Only fields with a problem appear in this object
  const errors = validateCarForm(values);
  const shown = (name) =>
    touched[name] || submitted ? (errors[name] ?? "") : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const [firstBad] = Object.keys(errors);
    if (firstBad) {
      formRef.current.elements.namedItem(firstBad)?.focus(); // jump to the first problem
      return;
    }
    onSubmit(values);
  };

  // Props every field shares
  const field = (name) => ({
    name,
    value: values[name],
    error: shown(name),
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.grid}>
        <div className={styles.wide}>
          <FormField
            label="Car model"
            placeholder="e.g. 2023 Toyota Fortuner 2.8L"
            maxLength={MAX_MODEL_LENGTH}
            hint="Include the year, make and model."
            autoComplete="off"
            {...field("model")}
          />
        </div>

        <FormField
          label="Price per day (₱)"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="e.g. 2500"
          {...field("price_per_day")}
        />
        <FormField
          label="Seats"
          type="number"
          inputMode="numeric"
          min={MIN_SEATS}
          max={MAX_SEATS}
          step={1}
          placeholder="e.g. 5"
          {...field("seats")}
        />

        <FormField label="Car type" as="select" {...field("car_type")}>
          <option value="">Choose…</option>
          {CAR_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FormField>
        <FormField label="Transmission" as="select" {...field("transmission")}>
          <option value="">Choose…</option>
          {TRANSMISSION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FormField>

        <FormField label="Fuel" as="select" {...field("fuel")}>
          <option value="">Choose…</option>
          {FUEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FormField>
        {/* Browse filters by the area's label, so the label is what gets saved */}
        <FormField label="Pickup area" as="select" {...field("location")}>
          <option value="">Choose…</option>
          {PICKUP_AREAS.map((a) => (
            <option key={a.value} value={a.label}>
              {a.label}
            </option>
          ))}
        </FormField>

        <div className={styles.wide}>
          <FormField
            label="Highlight"
            optional
            placeholder="e.g. 4x4, Captain seats"
            maxLength={MAX_TAG_LENGTH}
            hint="A short phrase shown above the car's name."
            autoComplete="off"
            {...field("tag")}
          />
        </div>

        <div className={styles.wide}>
          <FormField
            label="Description"
            as="textarea"
            optional
            rows={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Condition, features, pickup notes…"
            {...field("description")}
          />
        </div>

        <div className={styles.wide}>
          <FormField
            label="Photo link"
            type="url"
            optional
            placeholder="https://…"
            hint="Paste a link to a photo of your car. File uploads aren't available yet."
            autoComplete="off"
            {...field("photo_url")}
          />
        </div>
      </div>

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        {cancelPath && (
          <Button variant="secondary" to={cancelPath}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
