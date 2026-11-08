import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeToConversations } from "../services/messageService";

// One shared empty array, so the reference never changes between renders
const EMPTY = [];

export function useConversations() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [state, setState] = useState({ uid: null, conversations: EMPTY, error: false });

  useEffect(() => {
    if (!uid) return;
    return subscribeToConversations(
      uid,
      (conversations) => setState({ uid, conversations, error: false }),
      () => setState({ uid, conversations: EMPTY, error: true })
    );
  }, [uid]);

  const ready = Boolean(uid) && state.uid === uid;
  const conversations = ready ? state.conversations : EMPTY;
  const status = !uid ? "ready" : !ready ? "loading" : state.error ? "error" : "ready";

  const unreadCount = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread?.[uid] ?? 0), 0),
    [conversations, uid]
  );

  return { conversations, unreadCount, status }; // status: loading | ready | error
}