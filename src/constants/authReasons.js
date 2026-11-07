// Why a guest was sent to Login. Pass { from, reason, message } in the route
// state; the Login page shows `message` as a banner.

export const AUTH_REASON = {
  SAVE: "save",
  INBOX: "inbox",
  CREATE_LISTING: "create-listing",
  MESSAGE_OWNER: "message-owner",
};

export const AUTH_REASON_TEXT = {
  [AUTH_REASON.SAVE]: "Log in to save cars.",
  [AUTH_REASON.INBOX]: "Log in to see your messages.",
  [AUTH_REASON.CREATE_LISTING]: "Log in to list your car.",
  [AUTH_REASON.MESSAGE_OWNER]: "Log in to message this owner.",
};
