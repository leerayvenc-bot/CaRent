import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeToMessages, sendMessage, markAsRead } from "../services/messageService";

// Pass the conversation object from useConversation
export function useMessages(conversation) {
  const { user } = useAuth();
  const uid = user?.uid;
  const conversationId = conversation?.id;
  const unreadForMe = conversation?.unread?.[uid] ?? 0;
  const [state, setState] = useState({ id: null, messages: [], error: false });

  useEffect(() => {
    if (!conversationId) return;
    return subscribeToMessages(
      conversationId,
      (messages) => setState({ id: conversationId, messages, error: false }),
      () => setState({ id: conversationId, messages: [], error: true })
    );
  }, [conversationId]);

  // While this chat is open, clear my unread count
  useEffect(() => {
    if (conversationId && uid && unreadForMe > 0) {
      markAsRead(conversationId, uid).catch(() => {});
    }
  }, [conversationId, uid, unreadForMe]);

  const send = useCallback(
    (text) => sendMessage(conversation, { uid }, text), // throws an Error with a readable message
    [conversation, uid]
  );

  const ready = Boolean(conversationId) && state.id === conversationId;
  const messages = ready ? state.messages : [];
  const status = !conversationId ? "idle" : !ready ? "loading" : state.error ? "error" : "ready";

  return { messages, status, send };
}