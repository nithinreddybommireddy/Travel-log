export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  TOURS: "/tours",
  TOUR_DETAIL: (id: string) => `/tours/${id}`,
  DASHBOARD: "/dashboard",
  MOOD_BOARDS: "/mood-boards",
  MOOD_BOARD_DETAIL: (id: string) => `/mood-boards/${id}`,
  COMPARE: "/compare",
  SHORT_TRIPS: (id: string) => `/tours/${id}/short-trips`,
  CHECKOUT: (id: string) => `/checkout/${id}`,
  BOOKING_DETAIL: (id: string) => `/booking/${id}`,
} as const;
