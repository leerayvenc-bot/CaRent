import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useLoginPrompt } from '../../hooks/useLoginPrompt';
import { ROUTES } from '../../constants/routePaths';
import { useConversations } from '../../hooks/useConversations';
import './Navbar.css';

const NAV_LINKS = [
  { to: ROUTES.BROWSE, label: 'Browse' },
  { to: ROUTES.INBOX, label: 'Inbox', requiresLogin: true, message: 'Log in to view your messages.', badge: true },
  { to: ROUTES.SAVED, label: 'Saved', requiresLogin: true, message: 'Log in to see your saved cars.' },
  { to: ROUTES.MY_LISTINGS, label: 'My Listings', requiresLogin: true, message: 'Log in to manage your listings.' },
];

export default function Navbar() {
  const {  unreadCount } = useConversations();
  const { user, logout } = useAuth();
  const { requireLogin } = useLoginPrompt();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef(null); 

  // Close the avatar dropdown when clicking outside it
  useEffect(() => {
    const onClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Guests get the login popup instead of navigating
  const guard = (e, requiresLogin, message) => {
    setOpen(false);
    if (requiresLogin && !requireLogin(message)) e.preventDefault();
  };

  const handleAvatarClick = () => {
    if (!user) {
      requireLogin('Log in to view your profile.');
      return;
    }
    setMenuOpen((o) => !o);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setOpen(false);
    await logout();
    navigate(ROUTES.BROWSE);
  };

  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={ROUTES.BROWSE} className="navbar-brand" onClick={() => setOpen(false)}>
          CaRent
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <nav className={`navbar-menu ${open ? 'is-open' : ''}`}>
          <ul className="navbar-links">
            {NAV_LINKS.map(({ to, label, requiresLogin, message, badge }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === ROUTES.BROWSE}
                  onClick={(e) => guard(e, requiresLogin, message)}
                  className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
                >
                  {label}
                  {badge && unreadCount > 0 && (
                    <span className="navbar-badge">{unreadCount}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <Link
              to={ROUTES.CREATE_LISTING}
              className="navbar-create"
              onClick={(e) => guard(e, true, 'Log in to list your car.')}
            >
              Create listing
            </Link>

            {!user && (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="navbar-btn navbar-btn-outline"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="navbar-btn navbar-btn-solid"
                  onClick={() => setOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}

            <div className="navbar-avatar-wrap" ref={avatarRef}>
              <button
                className="navbar-avatar"
                onClick={handleAvatarClick}
                aria-label="Account"
                aria-expanded={menuOpen}
              >
                {user ? initial : <FiUser size={18} />}
              </button>

              {user && menuOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-info">
                    <strong>{user.name || 'Account'}</strong>
                    <span>{user.email}</span>
                  </div>
                  <button className="navbar-dropdown-item" onClick={handleLogout}>
                    <FiLogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}