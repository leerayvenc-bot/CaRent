import { Routes, Route, Outlet, Link, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestOnlyRoute from "./GuestOnlyRoute";
import { ROUTES } from "../constants/routePaths";

// Built pages (adjust the paths to match your folders)
import Login from "../pages/Login";
import Register from "../pages/Register";
import BrowsePage from "../pages/BrowsePage/BrowsePage";
import MessagesPage from "../pages/MessagesPage/MessagesPage";
import CreateListingPage from "../pages/CreateListingPage/CreateListingPage";
import SavedPage from "../pages/SavedPage/SavedPage";
import ListingDetailPage from "../pages/ListingDetailPage/ListingDetailPage";
import MyListingsPage from "../pages/MyListingsPage/MyListingsPage";
import EditListingPage from "../pages/EditListingPage/EditListingPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage/EditProfilePage";
import UserProfilePage from "../pages/UserProfilePage/UserProfilePage";

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
      <Route path={ROUTES.BROWSE} element={<BrowsePage />} />
      <Route path={ROUTES.LISTING} element={<ListingDetailPage />} />
      <Route path={ROUTES.USER_PROFILE} element={<UserProfilePage />} />

      {/* Guests only: logged-in users get redirected away */}
      <Route element={<GuestOnly />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      {/* Logged-in users only: guests get redirected away */}
      <Route element={<RequireLogin />}>
        <Route path={ROUTES.CREATE_LISTING} element={<CreateListingPage />} />
        <Route path={ROUTES.EDIT_LISTING} element={<EditListingPage />} />
        <Route path={ROUTES.MY_LISTINGS} element={<MyListingsPage />} />
        <Route path={ROUTES.SAVED} element={<SavedPage />} />
        <Route path={ROUTES.INBOX} element={<MessagesPage />} />
        <Route path={ROUTES.CHAT} element={<MessagesPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />
      </Route>

      {/* Anything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
