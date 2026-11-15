import {
  MdAirlineSeatReclineNormal,
  MdLocalGasStation,
  MdLocationOn,
  MdSettings,
} from "react-icons/md";
import { fuelLabel, transmissionLabel } from "../../../utils/carLabels";
import styles from "./CarSpecs.module.css";

// The car's facts as an icon list. Anything the owner left out is skipped.
export default function CarSpecs({ car }) {
  const specs = [
    {
      Icon: MdSettings,
      label: "Transmission",
      text: transmissionLabel(car.transmission),
    },
    { Icon: MdLocalGasStation, label: "Fuel", text: fuelLabel(car.fuel) },
    {
      Icon: MdAirlineSeatReclineNormal,
      label: "Seats",
      text: car.seats ? `${car.seats} seats` : null,
    },
    { Icon: MdLocationOn, label: "Pickup area", text: car.location },
  ].filter((spec) => spec.text);

  if (specs.length === 0) return null;

  return (
    <ul className={styles.list}>
      {specs.map(({ Icon, label, text }) => (
        <li key={label} className={styles.item}>
          <Icon size={20} aria-hidden="true" />
          <span className={styles.srOnly}>{label}: </span>
          {text}
        </li>
      ))}
    </ul>
  );
}
