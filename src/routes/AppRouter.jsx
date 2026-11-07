import { Routes, Route, Outlet, Link, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestOnlyRoute from "./GuestOnlyRoute";
import { ROUTES } from "../constants/routePaths";

// Built pages (adjust the paths to match your folders)
import Login from "../pages/Login";
import Register from "../pages/Register";
import Browse from "../pages/Browse/Browse";

// Temporary stand-in.
function Placeholder({ name }) {
  return <h1>{name} (coming soon)</h1>;
}

function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to={ROUTES.BROWSE}>Back to Browse</Link>
    </div>
  );
}

// Wraps a group of routes so the login check is written once
function RequireLogin() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function GuestOnly() {
  return (
    <GuestOnlyRoute>
      <Outlet />
    </GuestOnlyRoute>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* First page visitors see: send "/" to Browse */}
      {ROUTES.BROWSE !== "/" && (
        <Route path="/" element={<Navigate to={ROUTES.BROWSE} replace />} />
      )}

      {/* Public: guests can see these */}
      <Route path={ROUTES.BROWSE} element={<Browse />} />
      <Route path={ROUTES.LISTING} element={<Placeholder name="Listing detail" />} />

      {/* Guests only: logged-in users get redirected away */}
      <Route element={<GuestOnly />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      {/* Logged-in users only: guests get redirected away */}
      <Route element={<RequireLogin />}>
        <Route path={ROUTES.CREATE_LISTING} element={<Placeholder name="Create listing" />} />
        <Route path={ROUTES.EDIT_LISTING} element={<Placeholder name="Edit listing" />} />
        <Route path={ROUTES.MY_LISTINGS} element={<Placeholder name="My listings" />} />
        <Route path={ROUTES.SAVED} element={<Placeholder name="Saved" />} />
        <Route path={ROUTES.INBOX} element={<Placeholder name="Inbox" />} />
        <Route path={ROUTES.CHAT} element={<Placeholder name="Chat" />} />
      </Route>

      {/* Anything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}