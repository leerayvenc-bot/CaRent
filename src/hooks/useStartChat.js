import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { openConversation } from "../services/messageService";
import { ROUTES, buildPath } from "../constants/routePaths";

export function useStartChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const startChat = useCallback(
    async (car) => {
      if (!user) {
        // Guest: go to Login, then come back to this page
        navigate(ROUTES.LOGIN, { state: { from: location, reason: "message" } });
        return;
      }
      setStarting(true);
      setError("");
      try {
        const conversation = await openConversation(car, user);
        navigate(buildPath.chat(conversation.id));
      } catch (err) {
        setError(err.message);
        setStarting(false);
      }
    },
    [user, navigate, location]
  );

  return { startChat, starting, error };
}