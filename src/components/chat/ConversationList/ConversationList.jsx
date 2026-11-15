import { MdSearch } from "react-icons/md";
import { INBOX_FILTER } from "../../../constants/chatConstants";
import ConversationItem from "../ConversationItem/ConversationItem";
import styles from "./ConversationList.module.css";

export default function ConversationList({
  conversations,
  carsById,
  activeId,
  currentUserId,
  filter,
  search,
  onFilterChange,
  onSearchChange,
  onSelectConversation,
  unreadCount,
}) {
  const visibleConversations = conversations.filter((conversation) => {
    if (filter === INBOX_FILTER.UNREAD && !(conversation.unread?.[currentUserId] > 0)) {
      return false;
    }
    if (filter === INBOX_FILTER.ARCHIVED) return false;
    const listing = carsById[conversation.carId];
    const text = [
      conversation.ownerName,
      conversation.carModel,
      conversation.lastMessage,
      listing?.location,
    ].join(" ").toLowerCase();
    return text.includes(search.trim().toLowerCase());
  });
  const unreadConversations = conversations.filter(
    (conversation) => (conversation.unread?.[currentUserId] ?? 0) > 0
  ).length;
  const tabs = [
    { value: INBOX_FILTER.ALL, label: "All", count: conversations.length },
    { value: INBOX_FILTER.UNREAD, label: "Unread", count: unreadCount },
    { value: INBOX_FILTER.ARCHIVED, label: "Archived", count: 0 },
  ];

  return (
    <section className={styles.list} aria-label="Conversations">
      <header className={styles.header}>
        <div className={styles.headingRow}>
          <h1 className={styles.heading}>Messages</h1>
          {unreadConversations > 0 && (
            <span className={styles.newCount}>{unreadConversations} new</span>
          )}
        </div>
        <label className={styles.search}>
          <MdSearch size={20} aria-hidden="true" />
          <span className={styles.visuallyHidden}>Search messages or cars</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search messages or cars..."
          />
        </label>
        <div className={styles.tabs} role="tablist" aria-label="Inbox filter">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={filter === tab.value}
              className={`${styles.tab} ${filter === tab.value ? styles.selected : ""}`}
              onClick={() => onFilterChange(tab.value)}
            >
              {tab.label}
              <span className={styles.count}>{tab.count}</span>
            </button>
          ))}
        </div>
      </header>
      <div className={styles.items}>
        {visibleConversations.length > 0 ? (
          visibleConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              listing={carsById[conversation.carId]}
              active={conversation.id === activeId}
              unread={(conversation.unread?.[currentUserId] ?? 0) > 0}
              onSelect={onSelectConversation}
            />
          ))
        ) : (
          <p className={styles.noMatches}>
            {filter === INBOX_FILTER.ARCHIVED
              ? "No archived conversations."
              : search
                ? "No conversations match your search."
                : "No conversations yet."}
          </p>
        )}
      </div>
    </section>
  );
}
