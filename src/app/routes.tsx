import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "@/features/landing/pages/Landing";
import { AuthPage } from "@/features/auth/pages/Auth";
import { ToursPage } from "@/features/tours/pages/Tours";
import { TourDetailPage } from "@/features/tours/pages/TourDetail";
import { DashboardPage } from "@/features/dashboard/pages/Dashboard";
import { MoodBoardsPage } from "@/features/moodboards/pages/MoodBoards";
import { MoodBoardDetailPage } from "@/features/moodboards/pages/MoodBoardDetail";
import { ComparePage } from "@/features/compare/pages/Compare";
import { ShortTripsPage } from "@/features/tours/pages/ShortTrips";
import { CheckoutPage } from "@/features/booking/pages/Checkout";
import { BookingDetailPage } from "@/features/booking/pages/BookingDetail";

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
        <Route path="/tours" element={<PageTransition><ToursPage /></PageTransition>} />
        <Route path="/tours/:id" element={<PageTransition><TourDetailPage /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="/mood-boards" element={<PageTransition><MoodBoardsPage /></PageTransition>} />
        <Route path="/mood-boards/:id" element={<PageTransition><MoodBoardDetailPage /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><ComparePage /></PageTransition>} />
        <Route path="/tours/:id/short-trips" element={<PageTransition><ShortTripsPage /></PageTransition>} />
        <Route path="/checkout/:id" element={<PageTransition><CheckoutPage /></PageTransition>} />
        <Route path="/booking/:id" element={<PageTransition><BookingDetailPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
