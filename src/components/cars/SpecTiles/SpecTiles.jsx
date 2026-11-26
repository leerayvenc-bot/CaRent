import {
  MdAirlineSeatReclineNormal,
  MdLocalGasStation,
  MdSettings,
} from "react-icons/md";
import { fuelLabel, transmissionLabel } from "../../../utils/carLabels";
import styles from "./SpecTiles.module.css";

// Three small tiles under the price: transmission, fuel and seats.
// Anything the owner left out is skipped.
export default function SpecTiles({ car }) {
  const tiles = [
    {
      Icon: MdSettings,
      label: "Transmission",
      text: transmissionLabel(car.transmission),
    },
    { Icon: MdLocalGasStation, label: "Fuel", text: fuelLabel(car.fuel) },
    {
      Icon: MdAirlineSeatReclineNormal,
      label: "Capacity",
      text: car.seats ? `${car.seats} Seats` : null,
    },
  ].filter((tile) => tile.text);

  if (tiles.length === 0) return null;

  return (
    <ul className={styles.list}>
      {tiles.map(({ Icon, label, text }) => (
        <li key={label} className={styles.tile}>
          <Icon className={styles.icon} size={16} aria-hidden="true" />
          <span className={styles.text}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
