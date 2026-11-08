import { useEffect, useState } from "react";
import { subscribeToConversation } from "../services/messageService";

export function useConversation(conversationId) {
  const [state, setState] = useState({ id: null, conversation: null, error: false });

  useEffect(() => {
    if (!conversationId) return;
    return subscribeToConversation(
      conversationId,
      (conversation) => setState({ id: conversationId, conversation, error: false }),
      () => setState({ id: conversationId, conversation: null, error: true })
    );
  }, [conversationId]);

  const ready = Boolean(conversationId) && state.id === conversationId;
  const status = !conversationId ? "idle"
    : !ready ? "loading"
    : state.error ? "error"          // missing chat or not a participant
    : state.conversation ? "ready"
    : "not-found";

  return { conversation: ready ? state.conversation : null, status };
}