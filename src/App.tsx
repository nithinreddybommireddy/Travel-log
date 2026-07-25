import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ToastProvider } from "@/lib/toast-context";
import { LandingPage } from "@/pages/Landing";
import { AuthPage } from "@/pages/Auth";
import { ToursPage } from "@/pages/Tours";
import { TourDetailPage } from "@/pages/TourDetail";
import { DashboardPage } from "@/pages/Dashboard";
import { MoodBoardsPage } from "@/pages/MoodBoards";
import { MoodBoardDetailPage } from "@/pages/MoodBoardDetail";
import { ComparePage } from "@/pages/Compare";
import { ShortTripsPage } from "@/pages/ShortTrips";
import { CheckoutPage } from "@/pages/Checkout";
import { BookingDetailPage } from "@/pages/BookingDetail";

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

export default function App() {
  const location = useLocation();
  const hideFooter = location.pathname === "/auth";

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface text-text-primary flex flex-col">
        <Navbar />
        <main className="flex-1">
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
        </main>
        {!hideFooter && <Footer />}
        <BackToTop />
      </div>
    </ToastProvider>
  );
}
