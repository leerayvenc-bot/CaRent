import { useCallback, useEffect, useState } from "react";
import { getPublicProfile } from "../services/userService";
import { LOAD_STATUS } from "../constants/loadStatus";

// Loads someone's public profile. status: "loading" | "ready" | "error".
// When status is "ready" and profile is null, that user has no profile document.
export function useUserProfile(userId) {
  const [attempt, setAttempt] = useState(0);
  const key = `${userId}:${attempt}`;
  const [result, setResult] = useState({ key: null, profile: null, error: "" });

  useEffect(() => {
    if (!userId) return undefined;
    let ignore = false;

    getPublicProfile(userId)
      .then((profile) => {
        if (!ignore) setResult({ key, profile, error: "" });
      })
      .catch((err) => {
        if (!ignore) setResult({ key, profile: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [userId, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const settled = result.key === key;
  const status = !settled
    ? LOAD_STATUS.LOADING
    : result.error
      ? LOAD_STATUS.ERROR
      : LOAD_STATUS.READY;

  return {
    profile: settled ? result.profile : null,
    status,
    error: settled ? result.error : "",
    retry,
  };
}
