import { NavLink } from "react-router-dom";
import { MdExplore, MdFavoriteBorder, MdChatBubbleOutline, MdAccountCircle } from "react-icons/md";
import { ROUTES } from "../../../constants/routePaths";
import styles from "./MobileTabBar.module.css";

const TABS = [
  { to: ROUTES.BROWSE, label: "Browse", Icon: MdExplore, end: true },
  { to: ROUTES.SAVED, label: "Saved", Icon: MdFavoriteBorder },
  { to: ROUTES.INBOX, label: "Inbox", Icon: MdChatBubbleOutline },
  { to: ROUTES.MY_LISTINGS, label: "Profile", Icon: MdAccountCircle },
];

export default function MobileTabBar({ unreadCount }) {
  return (
    <nav className={styles.tabs} aria-label="Main navigation">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}
        >
          <span className={styles.iconWrap}>
            <Icon size={24} aria-hidden="true" />
            {label === "Inbox" && unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
