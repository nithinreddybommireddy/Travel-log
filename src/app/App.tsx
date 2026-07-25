import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { AppRoutes } from "@/app/routes";

export default function App() {
  const location = useLocation();
  const hideFooter = location.pathname === "/auth";

  return (
    <div className="min-h-screen bg-surface text-text-primary flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!hideFooter && <Footer />}
      <BackToTop />
    </div>
  );
}
