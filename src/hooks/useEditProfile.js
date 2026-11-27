import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { ROUTES } from "../constants/routePaths";

// Saves the logged-in user's profile, then goes back to My profile.
// save(values) never throws: a failed save sets `error` for the page to show.
export function useEditProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const save = useCallback(
    async (values) => {
      if (!user || submitting) return; // the route is protected; this is a safety net
      setSubmitting(true);
      setError("");
      try {
        await updateProfile(values);
        navigate(ROUTES.PROFILE, { state: { notice: "Profile saved." } });
      } catch (err) {
        setError(err.message);
        setSubmitting(false); // stay on the form so nothing typed is lost
      }
    },
    [user, submitting, updateProfile, navigate],
  );

  return { save, submitting, error };
}
