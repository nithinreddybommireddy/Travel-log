export const STORAGE_KEYS = {
  USER: "travellog_user",
  THEME: "travellog_theme",
  BOOKINGS: "travellog_bookings",
  EMAILS: "travellog_emails",
  NEWSLETTER: "travellog_newsletter",
  RECENT_SEARCHES: "travellog_recent_searches",
  FOOD_REVIEWS: "travellog_food_reviews",
  SAVED_TOURS: (userId: string) => `travellog_saved_${userId || "guest"}`,
  MOOD_BOARDS: (userId: string) => `travellog_boards_${userId || "guest"}`,
  BOARD_TOURS: (userId: string) => `travellog_board_tours_${userId || "guest"}`,
  TRIP_PLANS: (userId: string) => `travellog_trips_${userId || "guest"}`,
  ACCOUNT: (email: string) => `travellog_account_${email}`,
} as const;
