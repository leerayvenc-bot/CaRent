import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConversationList from "../../components/chat/ConversationList/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow/ChatWindow";
import EmptyInbox from "../../components/chat/EmptyInbox/EmptyInbox";
import MobileTabBar from "../../components/chat/MobileTabBar/MobileTabBar";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Spinner from "../../components/common/Spinner/Spinner";
import Toast from "../../components/common/Toast/Toast";
import { ROUTES, buildPath } from "../../constants/routePaths";
import { LOAD_STATUS } from "../../constants/loadStatus";
import { INBOX_FILTER } from "../../constants/chatConstants";
import { useAuth } from "../../hooks/useAuth";
import { useCars } from "../../hooks/useCars";
import { useConversation } from "../../hooks/useConversation";
import { useConversations } from "../../hooks/useConversations";
import { useFavorites } from "../../hooks/useFavorites";
import { useMessages } from "../../hooks/useMessages";
import styles from "./MessagesPage.module.css";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 899px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)");
    const update = (event) => setIsMobile(event.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { conversationId: routeConversationId } = useParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { conversations, unreadCount, status: conversationsStatus } = useConversations();
  const activeId = routeConversationId || (!isMobile ? conversations[0]?.id : null);
  const { conversation: routeConversation, status: conversationStatus } =
    useConversation(activeId);
  const conversation = routeConversationId
    ? routeConversation
    : conversations.find((item) => item.id === activeId) ?? null;
  const { messages, status: messagesStatus, send } = useMessages(conversation);
  const { cars } = useCars();
  const { favoriteIds, toggleFavorite, error: favoriteError, clearError } = useFavorites();
  const [filter, setFilter] = useState(INBOX_FILTER.ALL);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const isLoading = conversationsStatus === LOAD_STATUS.LOADING ||
    (activeId && conversationStatus === LOAD_STATUS.LOADING);
  const hasConversation = Boolean(routeConversationId || (!isMobile && activeId));
  const carById = useMemo(
    () => Object.fromEntries(cars.map((car) => [car.id, car])),
    [cars]
  );
  const listing = conversation ? carById[conversation.carId] : null;
  const clearToast = useCallback(() => setSendError(""), []);

  const selectConversation = (id) => navigate(buildPath.chat(id));
  const goBack = () => navigate(ROUTES.INBOX);
  const handleRetry = () => window.location.reload();

  const handleSend = async (text) => {
    setSending(true);
    setSendError("");
    try {
      await send(text);
      return true;
    } catch (error) {
      setSendError(error.message);
      return false;
    } finally {
      setSending(false);
    }
  };

  const handleFavorite = () => {
    if (conversation) toggleFavorite(conversation.carId);
  };

  const hasConversations = conversations.length > 0;
  const pageClass = [
    styles.page,
    hasConversation ? styles.hasConversation : "",
    !hasConversations && conversationsStatus === LOAD_STATUS.READY ? styles.emptyPage : "",
  ].filter(Boolean).join(" ");

  return (
    <main className={pageClass}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {conversationsStatus === LOAD_STATUS.ERROR ? (
            <ErrorState message="Couldn't load your conversations. Check your connection and try again." onRetry={handleRetry} />
          ) : conversationsStatus === LOAD_STATUS.LOADING ? (
            <Spinner />
          ) : (
            <ConversationList
              conversations={conversations}
              carsById={carById}
              activeId={activeId}
              currentUserId={user?.uid}
              filter={filter}
              search={search}
              onFilterChange={setFilter}
              onSearchChange={setSearch}
              onSelectConversation={selectConversation}
              unreadCount={conversations.reduce(
                (sum, item) => sum + ((item.unread?.[user?.uid] ?? 0) > 0 ? 1 : 0),
                0
              )}
            />
          )}
        </aside>

        <section className={styles.chatPane}>
          {conversationsStatus === LOAD_STATUS.ERROR ? (
            <ErrorState message="Couldn't load your conversations. Check your connection and try again." onRetry={handleRetry} />
          ) : !hasConversations && conversationsStatus === LOAD_STATUS.READY ? (
            <EmptyInbox browsePath={ROUTES.BROWSE} />
          ) : !activeId ? (
            <EmptyInbox browsePath={ROUTES.BROWSE} />
          ) : isLoading ? (
            <Spinner />
          ) : conversationStatus === LOAD_STATUS.ERROR || !conversation ? (
            <ErrorState message="Couldn't open this conversation. Check your connection and try again." onRetry={handleRetry} />
          ) : messagesStatus === LOAD_STATUS.ERROR ? (
            <ErrorState message="Couldn't load messages. Check your connection and try again." onRetry={handleRetry} />
          ) : messagesStatus === LOAD_STATUS.LOADING ? (
            <Spinner />
          ) : (
            <ChatWindow
              conversation={conversation}
              listing={listing}
              messages={messages}
              currentUserId={user?.uid}
              currentUserName={user?.name}
              favorite={favoriteIds.has(conversation.carId)}
              onFavorite={handleFavorite}
              onBack={goBack}
              onSend={handleSend}
              sending={sending}
              listingPath={buildPath.listing(conversation.carId)}
            />
          )}
        </section>
      </div>
      {isMobile && !routeConversationId && (
        <MobileTabBar unreadCount={unreadCount} />
      )}
      <Toast message={sendError || favoriteError} onDismiss={() => {
        clearToast();
        clearError();
      }} />
    </main>
  );
}
