export const ROUTES = {
  BROWSE: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LISTING: "/cars/:carId",
  CREATE_LISTING: "/listings/new",
  EDIT_LISTING: "/listings/:carId/edit",
  MY_LISTINGS: "/my-listings",
  SAVED: "/saved",
  INBOX: "/inbox",
  CHAT: "/inbox/:conversationId",
};

// Use these when linking to a page that has an id in its URL
export const buildPath = {
  listing: (carId) => `/cars/${carId}`,
  editListing: (carId) => `/listings/${carId}/edit`,
  chat: (conversationId) => `/inbox/${conversationId}`,
};