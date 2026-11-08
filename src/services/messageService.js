import {
  collection, doc, getDoc, setDoc, updateDoc, writeBatch,
  query, where, orderBy, limit, onSnapshot, increment, serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { validateMessage } from "../utils/validators";

const CONVERSATIONS = "conversations";
const MESSAGES = "messages";
const MESSAGE_LIMIT = 100; // newest 100 messages per chat

export function buildConversationId(carId, renterId) {
  return `${carId}_${renterId}`;
}

// The rest of the app never sees Firestore Timestamp objects
const toMillis = (value) => (value ? value.toMillis() : null);

function toConversation(id, data) {
  return {
    id,
    carId: data.car_id,
    carModel: data.car_model,
    carPhotoUrl: data.car_photo_url,
    carPricePerDay: data.car_price_per_day,
    ownerId: data.owner_id,
    ownerName: data.owner_name,
    renterId: data.renter_id,
    renterName: data.renter_name,
    lastMessage: data.last_message,
    lastSenderId: data.last_sender_id,
    lastMessageAt: toMillis(data.last_message_at),
    unread: data.unread ?? {},
  };
}

function toMessage(id, data) {
  return {
    id,
    senderId: data.sender_id,
    text: data.text,
    createdAt: toMillis(data.created_at),
  };
}

const LIVE = { serverTimestamps: "estimate" }; // no null time right after sending

// Finds the chat for this car and renter, or creates it.
// car: { id, model, price_per_day, photo_url, owner_id }   renter: { uid, name }
export async function openConversation(car, renter) {
  if (car.owner_id === renter.uid) {
    throw new Error("You can't message your own listing.");
  }

  const id = buildConversationId(car.id, renter.uid);
  const ref = doc(db, CONVERSATIONS, id);

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) return toConversation(id, existing.data());

    const ownerSnap = await getDoc(doc(db, "users", car.owner_id));
    const data = {
      car_id: car.id,
      car_model: car.model,
      car_photo_url: car.photo_url ?? "",
      car_price_per_day: car.price_per_day,
      owner_id: car.owner_id,
      owner_name: ownerSnap.exists() ? ownerSnap.data().name : "Owner",
      renter_id: renter.uid,
      renter_name: renter.name,
      participants: [car.owner_id, renter.uid],
      last_message: "",
      last_sender_id: "",
      last_message_at: null,
      unread: { [car.owner_id]: 0, [renter.uid]: 0 },
      created_at: serverTimestamp(),
    };
    await setDoc(ref, data);
    return toConversation(id, data);
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't open the chat. Please try again.", { cause: error });
  }
}

// sender: { uid }
export async function sendMessage(conversation, sender, text) {
  const error = validateMessage(text);
  if (error) throw new Error(error);

  const trimmed = text.trim();
  const receiverId =
    sender.uid === conversation.ownerId
      ? conversation.renterId
      : conversation.ownerId;

  const conversationRef = doc(db, CONVERSATIONS, conversation.id);
  const messageRef = doc(collection(conversationRef, MESSAGES));

  try {
    // One batch: the message and the chat summary save together or not at all
    const batch = writeBatch(db);
    batch.set(messageRef, {
      sender_id: sender.uid,
      text: trimmed,
      created_at: serverTimestamp(),
    });
    batch.update(conversationRef, {
      last_message: trimmed,
      last_sender_id: sender.uid,
      last_message_at: serverTimestamp(),
      [`unread.${receiverId}`]: increment(1),
    });
    await batch.commit();
  } catch (err) {
    console.error(err);
    throw new Error("Message not sent. Please try again.", { cause: err });
  }
}

export async function markAsRead(conversationId, uid) {
  await updateDoc(doc(db, CONVERSATIONS, conversationId), {
    [`unread.${uid}`]: 0,
  });
}

// One chat, live. Calls onChange(null) if it doesn't exist. Returns an unsubscribe function.
export function subscribeToConversation(conversationId, onChange, onError) {
  return onSnapshot(
    doc(db, CONVERSATIONS, conversationId),
    (snap) =>
      onChange(snap.exists() ? toConversation(snap.id, snap.data(LIVE)) : null),
    onError
  );
}

// All of a user's chats, newest first. Returns an unsubscribe function.
export function subscribeToConversations(uid, onChange, onError) {
  const q = query(
    collection(db, CONVERSATIONS),
    where("participants", "array-contains", uid)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const conversations = snapshot.docs
        .map((d) => toConversation(d.id, d.data(LIVE)))
        .filter((c) => c.lastMessage) // hide chats where nothing was sent yet
        .sort((a, b) => (b.lastMessageAt ?? 0) - (a.lastMessageAt ?? 0));
      onChange(conversations);
    },
    onError
  );
}

// Messages for one chat, oldest first. Returns an unsubscribe function.
export function subscribeToMessages(conversationId, onChange, onError) {
  const q = query(
    collection(db, CONVERSATIONS, conversationId, MESSAGES),
    orderBy("created_at", "desc"),
    limit(MESSAGE_LIMIT)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs
        .map((d) => toMessage(d.id, d.data(LIVE)))
        .reverse();
      onChange(messages);
    },
    onError
  );
}