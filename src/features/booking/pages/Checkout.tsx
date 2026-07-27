import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Shield, CreditCard, Smartphone, Building2,
  CheckCircle2, BadgePercent, Users, Ticket,
  Loader2, Wallet, Mail, MessageSquare, MessageCircle,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tours } from "@/features/tours/data/tours";
import { offerCodes, validateOfferCode } from "@/features/booking/data/offers";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sendBookingConfirmation } from "@/services/emailService";
import {
  sendWhatsAppConfirmation,
  sendSMSConfirmation,
  sendWhatsAppToAllTravelers,
  sendSMSToAllTravelers,
} from "@/services/notificationService";
import { initiateRazorpayPayment } from "@/services/razorpayService";

interface TravelerInfo {
  name: string;
  age: string;
  gender: string;
  phone: string;
}

interface BookingState {
  travelers: number;
  startDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  travelerDetails: TravelerInfo[];
}

const DRAFT_KEY = "travellog_checkout_draft";

function loadDraft(tourId: string): Partial<BookingState> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data._tourId !== tourId) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveDraft(tourId: string, data: BookingState) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, _tourId: tourId, _savedAt: Date.now() }));
  } catch { /* ignore */ }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

export function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const tour = tours.find((t) => t.id === id);
  const { user } = useAuth();

  const todayDate = useMemo(() => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }, []);

  const rebookTravelers = Math.max(1, parseInt(searchParams.get("travelers") || "1", 10));
  const savedDraft = useMemo(() => (id ? loadDraft(id) : null), [id]);

  const getInitialTravelerDetails = (count: number, saved?: TravelerInfo[]): TravelerInfo[] => {
    const details: TravelerInfo[] = [];
    for (let i = 0; i < count; i++) {
      details.push(saved?.[i] ?? { name: "", age: "", gender: "", phone: "" });
    }
    return details;
  };

  const [booking, setBooking] = useState<BookingState>(() => {
    const initialTravelers = savedDraft?.travelers ?? Math.min(rebookTravelers, tour?.maxPeople || 30);
    return {
      travelers: initialTravelers,
      startDate: savedDraft?.startDate ?? "",
      customerName: savedDraft?.customerName ?? user?.name ?? "",
      customerEmail: savedDraft?.customerEmail ?? user?.email ?? "",
      customerPhone: savedDraft?.customerPhone ?? "",
      specialRequests: savedDraft?.specialRequests ?? "",
      travelerDetails: getInitialTravelerDetails(initialTravelers, savedDraft?.travelerDetails),
    };
  });

  useEffect(() => {
    if (booking.travelers !== booking.travelerDetails.length) {
      setBooking(prev => ({
        ...prev,
        travelerDetails: getInitialTravelerDetails(prev.travelers, prev.travelerDetails),
      }));
    }
  }, [booking.travelers]);

  useEffect(() => {
    if (
      booking.customerName?.trim() &&
      booking.travelerDetails.length > 0 &&
      !booking.travelerDetails[0].name?.trim()
    ) {
      const updated = [...booking.travelerDetails];
      updated[0] = { ...updated[0], name: booking.customerName };
      setBooking(prev => ({ ...prev, travelerDetails: updated }));
    }
  }, [booking.customerName]);

  const bookingRef = useRef(booking);
  bookingRef.current = booking;

  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [step, setStep] = useState<"form" | "processing" | "confirmed">("form");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; date?: string; travelers?: string }>({});

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    if (!id || step !== "form") return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(id, booking);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [id, booking, step]);

  const [offerInput, setOfferInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<{ code: string; discount: number } | null>(null);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);



  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tour Not Found</h1>
          <p className="text-text-secondary mb-6">This destination doesn't exist.</p>
          <Link to="/tours"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Tours</Button></Link>
        </div>
      </div>
    );
  }

  const basePrice = tour.price * booking.travelers;
  const sgst = Math.round(basePrice * 0.025);
  const cgst = Math.round(basePrice * 0.025);
  const totalGst = sgst + cgst;
  const bookingFee = 199;
  const discount = appliedOffer?.discount || 0;
  const total = basePrice + totalGst + bookingFee - discount;

  const formatPhone = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 10);
  };

  const handleApplyOffer = useCallback(() => {
    if (!offerInput.trim()) return;
    setOfferLoading(true);
    setOfferError("");

    setTimeout(() => {
      const result = validateOfferCode(offerInput, basePrice);
      if (result.valid) {
        setAppliedOffer({ code: offerInput.toUpperCase(), discount: result.discount });
        setOfferError("");
        showToast(result.message, "success");
      } else {
        setAppliedOffer(null);
        setOfferError(result.message);
        showToast(result.message, "info");
      }
      setOfferLoading(false);
    }, 600);
  }, [offerInput, basePrice, showToast]);

  const handleRemoveOffer = () => {
    setAppliedOffer(null);
    setOfferInput("");
    setOfferError("");
  };

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

  const handlePay = async () => {
    let b = bookingRef.current;

    const nameEl = document.getElementById("customerName") as HTMLInputElement | null;
    const emailEl = document.getElementById("customerEmail") as HTMLInputElement | null;
    const dateEl = document.getElementById("startDate") as HTMLInputElement | null;

    if (nameEl && !b.customerName?.trim()) {
      b = { ...b, customerName: nameEl.value };
    }
    if (emailEl && !b.customerEmail?.trim()) {
      b = { ...b, customerEmail: emailEl.value };
    }
    if (dateEl && !b.startDate) {
      b = { ...b, startDate: dateEl.value };
    }

    for (let i = 0; i < b.travelerDetails.length; i++) {
      const tNameEl = document.getElementById(`traveler-name-${i}`) as HTMLInputElement | null;
      const tAgeEl = document.getElementById(`traveler-age-${i}`) as HTMLInputElement | null;
      if (tNameEl && !b.travelerDetails[i].name?.trim()) {
        const updated = [...b.travelerDetails];
        updated[i] = { ...updated[i], name: tNameEl.value };
        b = { ...b, travelerDetails: updated };
      }
      if (tAgeEl && !b.travelerDetails[i].age?.trim()) {
        const updated = [...b.travelerDetails];
        updated[i] = { ...updated[i], age: tAgeEl.value };
        b = { ...b, travelerDetails: updated };
      }
    }

    console.log("[Checkout] handlePay clicked", { name: b.customerName, email: b.customerEmail, date: b.startDate, travelerCount: b.travelerDetails.length });

    const emailRegex = /^[^\s@]+@[^\s@]+\.\w{2,}$/;
    const errors: { name?: string; email?: string; date?: string; travelers?: string } = {};
    if (!b.customerName?.trim()) errors.name = "Name is required";
    if (!b.customerEmail?.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(b.customerEmail.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (!b.startDate) errors.date = "Start date is required";

    const missingTravelerNames = b.travelerDetails.some(t => !t.name?.trim());
    const missingTravelerAges = b.travelerDetails.some(t => !t.age?.trim());
    const missingTravelerGenders = b.travelerDetails.some(t => !t.gender?.trim());
    if (missingTravelerNames || missingTravelerAges || missingTravelerGenders) {
      errors.travelers = "Please fill in name, age and gender for all travelers";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const missing = Object.values(errors).join(" · ");
      showToast(`⚠️ ${missing}`, "info");
      document.getElementById("traveler-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (b !== bookingRef.current) {
      setBooking(b as BookingState);
    }
    setFieldErrors({});
    clearDraft();

    // Open Razorpay payment modal
    showToast("Opening Razorpay checkout... 💳", "info");
    const result = await initiateRazorpayPayment({
      keyId: razorpayKeyId,
      amount: total,
      name: "TravelLog",
      description: `Booking for ${tour.name} - ${tour.duration}`.slice(0, 30),
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      themeColor: "#f59e0b",
    });

    if (!result.success) {
      showToast(`⚠️ ${result.error}`, "info");
      return;
    }

    // Payment succeeded — save booking to localStorage
    const bookingId = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const newBooking = {
      id: bookingId,
      tourId: tour.id,
      tourName: tour.name,
      travelers: b.travelers,
      startDate: b.startDate,
      totalPaid: total,
      discount: discount,
      coupon: appliedOffer?.code || null,
      bookedAt: Date.now(),
      status: "confirmed",
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      travelerDetails: b.travelerDetails,
      paymentId: result.paymentId,
    };
    console.log("[Checkout] Payment successful, saving booking:", newBooking);

    try {
      let existing: any[] = [];
      const raw = localStorage.getItem("travellog_bookings");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existing = parsed;
        } catch { existing = []; }
      }
      existing.unshift(newBooking);
      localStorage.setItem("travellog_bookings", JSON.stringify(existing.slice(0, 50)));
    } catch (saveErr) {
      console.error("[Checkout] localStorage save FAILED:", saveErr);
      try {
        let existing: any[] = [];
        const raw = sessionStorage.getItem("travellog_bookings_fallback");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existing = parsed;
        }
        existing.unshift(newBooking);
        sessionStorage.setItem("travellog_bookings_fallback", JSON.stringify(existing.slice(0, 50)));
      } catch { /* ignore */ }
    }

    setStep("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Booking confirmed! 🎉", "success");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  // --- CONFIRMED VIEW ---
  if (step === "confirmed") {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-text-secondary mb-6">Your adventure to <strong>{tour.name}</strong> is confirmed.</p>

          <div className="bg-surface-light/40 backdrop-blur-sm rounded-2xl border border-border-light p-6 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-border-light">
              <img src={tour.image} alt={tour.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <div className="font-semibold text-sm">{tour.name}</div>
                <div className="text-xs text-text-muted">{tour.location}</div>
              </div>
            </div>
            {[
              ["📅 Start Date", booking.startDate],
              ["👥 Travelers", `${booking.travelers} traveler${booking.travelers > 1 ? "s" : ""}`],
              ["💰 Total Paid", `₹${total.toLocaleString()}`],
              ["🆔 Booking ID", `#${Date.now().toString(36).toUpperCase()}`],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-text-muted">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* WhatsApp & SMS */}
          <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-sm">Send via WhatsApp or SMS</span>
            </div>
            <p className="text-xs text-text-secondary mb-3">
              Send booking confirmation to your phone or all travelers.
            </p>
            {booking.customerPhone ? (
              <div className="flex gap-2 mb-3">
                <label htmlFor="notify-phone" className="sr-only">Phone Number for WhatsApp/SMS</label>
                <input type="tel" placeholder="Your phone number" defaultValue={booking.customerPhone} id="notify-phone" name="notifyPhone" autoComplete="tel"
                  className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400/50 transition-colors" maxLength={10} />
                <Button variant="secondary" className="gap-2 shrink-0 bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400"
                  onClick={() => {
                    const p = (document.getElementById("notify-phone") as HTMLInputElement)?.value.trim();
                    if (!p || p.length < 10) { showToast("Please enter a valid 10-digit phone number", "info"); return; }
                    sendWhatsAppConfirmation({ id: Date.now().toString(36), tourName: tour.name, location: tour.location, startDate: booking.startDate, travelers: booking.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" }, p);
                    showToast("WhatsApp opened! 💬", "success");
                  }}>
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
                <Button variant="secondary" className="gap-2 shrink-0 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400"
                  onClick={() => {
                    const p = (document.getElementById("notify-phone") as HTMLInputElement)?.value.trim();
                    if (!p || p.length < 10) { showToast("Please enter a valid 10-digit phone number", "info"); return; }
                    sendSMSConfirmation({ id: Date.now().toString(36), tourName: tour.name, location: tour.location, startDate: booking.startDate, travelers: booking.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" }, p);
                    showToast("SMS app opened! ✉️", "success");
                  }}>
                  <MessageSquare className="w-4 h-4" /> SMS
                </Button>
              </div>
            ) : (
              <p className="text-xs text-text-muted mb-3">Add a phone number in the booking to send WhatsApp/SMS notifications.</p>
            )}
            {booking.travelerDetails && booking.travelerDetails.some(t => t.phone && t.phone.replace(/[^0-9]/g, "").length >= 10) && (
              <div className="flex gap-2 pt-2 border-t border-green-500/10">
                <Button variant="ghost" size="sm" className="gap-2 text-[11px] text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  onClick={() => { sendWhatsAppToAllTravelers({ id: Date.now().toString(36), tourName: tour.name, location: tour.location, startDate: booking.startDate, travelers: booking.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" }, booking.travelerDetails); showToast("WhatsApp opened for all travelers! 💬", "success"); }}>
                  <MessageCircle className="w-3.5 h-3.5" /> Notify All via WhatsApp
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  onClick={() => { sendSMSToAllTravelers({ id: Date.now().toString(36), tourName: tour.name, location: tour.location, startDate: booking.startDate, travelers: booking.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" }, booking.travelerDetails); showToast("SMS opened for all travelers! ✉️", "success"); }}>
                  <MessageSquare className="w-3.5 h-3.5" /> Notify All via SMS
                </Button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">Get Email Confirmation</span>
            </div>
            <p className="text-xs text-text-secondary mb-3">We'll send your booking details directly to your inbox.</p>
            <div className="flex gap-2">
              <label htmlFor="confirm-email" className="sr-only">Email for confirmation</label>
                <input type="email" placeholder="your@email.com" defaultValue={booking.customerEmail} id="confirm-email" name="confirmEmail" autoComplete="email"
                  className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
              <Button variant="secondary" className="gap-2 shrink-0" onClick={() => {
                const email = (document.getElementById("confirm-email") as HTMLInputElement)?.value.trim();
                if (!email || !email.includes("@")) { showToast("Please enter a valid email address", "info"); return; }
                sendBookingConfirmation({ id: Date.now().toString(36), tourName: tour.name, location: tour.location, startDate: booking.startDate, travelers: booking.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" }, email);
                showToast("Confirmation email opened! ✉️", "success");
              }}>
                <Mail className="w-4 h-4" /> Send
              </Button>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/my-bookings")}>View My Bookings</Button>
            <Button onClick={() => navigate("/tours")}>Explore More Tours</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- PROCESSING VIEW ---
  if (step === "processing") {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent mx-auto mb-6"
          />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-text-secondary">Please wait while we securely process your payment...</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-text-muted">
              <Shield className="w-4 h-4 text-green-400" /> Secured with 256-bit encryption
            </div>
            <div className="mt-6 space-y-1 text-xs text-text-muted">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>✅ Validating payment details</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>✅ Authorizing amount of ₹{total.toLocaleString()}</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>✅ Confirming booking with {tour.name}</motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- MAIN FORM ---
  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-16">
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-border-light px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted">{checkoutStep === 1 ? 'Number of travelers' : 'Total Amount'}</p>
            <p className="text-lg font-bold text-accent">{checkoutStep === 1 ? `${booking.travelers} traveler${booking.travelers > 1 ? 's' : ''}` : `₹${total.toLocaleString()}`}</p>
          </div>
          {checkoutStep === 1 ? (
            <Button size="default" className="gap-2 shrink-0 min-w-[130px]" onClick={() => {
              const b = bookingRef.current;
              const missingNames = b.travelerDetails.some(t => !t.name?.trim());
              const missingAges = b.travelerDetails.some(t => !t.age?.trim());
              const missingGenders = b.travelerDetails.some(t => !t.gender?.trim());
              const missingDate = !b.startDate;
              if (missingDate) { setFieldErrors(prev => ({ ...prev, date: "Please select a journey date" })); showToast("⚠️ Please select your journey date", "info"); return; }
              if (missingNames || missingAges || missingGenders) { setFieldErrors(prev => ({ ...prev, travelers: "Please fill name, age and gender for all travelers" })); showToast("⚠️ Fill name, age and gender for all travelers", "info"); document.getElementById("traveler-form")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
              setFieldErrors({}); setCheckoutStep(2); window.scrollTo({ top: 0, behavior: "smooth" });
            }}>Continue →</Button>
          ) : (
            <Button size="default" className="gap-2 shrink-0 min-w-[130px]" onClick={handlePay}><Wallet className="w-4 h-4" /> Pay Now</Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/tours/${tour.id}`}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {tour.name}
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold mb-1">Book Your Trip</h1>
                <p className="text-text-secondary text-sm">{tour.name} — {tour.duration}</p>
              </motion.div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${checkoutStep === 1 ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface-lighter/50 text-text-muted'}`}>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                  Passenger Details
                  {checkoutStep === 1 && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">You are here</span>}
                </div>
                <div className={`h-px flex-1 ${checkoutStep === 2 ? 'bg-accent' : 'bg-border-light'}`} />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${checkoutStep === 2 ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface-lighter/50 text-text-muted'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${checkoutStep === 2 ? 'bg-white/20' : 'bg-surface-lighter/70'}`}>2</span>
                  Payment
                  {checkoutStep === 2 && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">You are here</span>}
                </div>
              </div>

              {/* ===== SECTION 1: PASSENGER DETAILS (STEP 1) ===== */}
              {checkoutStep === 1 && (
              <motion.div variants={itemVariants} className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/[0.02] p-5 space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold">👥 Who's Coming?</h2>
                    <p className="text-xs text-text-muted">Fill details of everyone who will travel</p>
                  </div>
                  {draftSaved && (
                    <span className="ml-auto text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>
                  )}
                </div>

                {/* Travelers Count + Start Date side by side */}
                <div id="traveler-form" className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted block mb-1">How many travelers?</label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setBooking({ ...booking, travelers: Math.max(1, booking.travelers - 1) })}
                        className="w-10 h-10 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg" aria-label="Decrease travelers">−</button>
                      <span className="font-semibold text-xl w-8 text-center">{booking.travelers}</span>
                      <button type="button" onClick={() => setBooking({ ...booking, travelers: Math.min(tour.maxPeople, booking.travelers + 1) })}
                        className="w-10 h-10 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg" aria-label="Increase travelers">+</button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="startDate" className="text-xs text-text-muted block mb-1">Journey Date <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
                      <input type="date" id="startDate" name="startDate" autoComplete="travel-date"
                        value={booking.startDate} min={todayDate}
                        onChange={(e) => { setBooking({ ...booking, startDate: e.target.value }); if (fieldErrors.date) setFieldErrors((prev) => ({ ...prev, date: undefined })); }}
                        className={`w-full bg-surface-lighter/40 border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors ${fieldErrors.date ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light"}`} />
                    </div>
                    {fieldErrors.date && <p className="text-[10px] text-red-400 mt-1">⚠️ {fieldErrors.date}</p>}
                    <p className="text-[10px] text-text-muted mt-1">Select your journey date</p>
                  </div>
                </div>

                {/* Per-Traveler Details */}
                <div className="space-y-3 mt-2">
                  {booking.travelerDetails.map((traveler, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${index === 0 ? "border-accent/30 bg-accent/5" : "border-border-light bg-surface-lighter/30"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-accent text-white" : "bg-surface-lighter/70 text-text-muted"}`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{index === 0 ? "You (Main Traveler)" : `Traveler ${index + 1}`}</span>
                        {index === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">Auto-filled</span>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-1">
                          <label htmlFor={`traveler-name-${index}`} className="text-[10px] text-text-muted block mb-1">Full Name <span className="text-red-400">*</span></label>
                          <input type="text" id={`traveler-name-${index}`} name={`traveler-name-${index}`} autoComplete={index === 0 ? "name" : "off"}
                            placeholder={index === 0 ? "Your name" : `Traveler ${index + 1} name`}
                            value={traveler.name}
                            onChange={(e) => {
                              const updated = [...booking.travelerDetails];
                              updated[index] = { ...updated[index], name: e.target.value };
                              setBooking({ ...booking, travelerDetails: updated });
                            }}
                            className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors" />
                        </div>
                        <div>
                          <label htmlFor={`traveler-age-${index}`} className="text-[10px] text-text-muted block mb-1">Age <span className="text-red-400">*</span></label>
                          <input type="number" id={`traveler-age-${index}`} name={`traveler-age-${index}`}
                            placeholder="25" min="1" max="120"
                            value={traveler.age}
                            onChange={(e) => {
                              const updated = [...booking.travelerDetails];
                              updated[index] = { ...updated[index], age: e.target.value.slice(0, 3) };
                              setBooking({ ...booking, travelerDetails: updated });
                            }}
                            className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors" />
                        </div>
                        <div>
                          <label htmlFor={`traveler-gender-${index}`} className="text-[10px] text-text-muted block mb-1">Gender <span className="text-red-400">*</span></label>
                          <select id={`traveler-gender-${index}`} name={`traveler-gender-${index}`}
                            value={traveler.gender}
                            onChange={(e) => {
                              const updated = [...booking.travelerDetails];
                              updated[index] = { ...updated[index], gender: e.target.value };
                              setBooking({ ...booking, travelerDetails: updated });
                            }}
                            className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors appearance-none">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`traveler-phone-${index}`} className="text-[10px] text-text-muted block mb-1">Phone <span className="text-text-muted/50">(optional)</span></label>
                          <input type="tel" id={`traveler-phone-${index}`} name={`traveler-phone-${index}`}
                            placeholder={index === 0 ? "9876543210" : ""}
                            value={traveler.phone}
                            onChange={(e) => {
                              const updated = [...booking.travelerDetails];
                              updated[index] = { ...updated[index], phone: e.target.value.replace(/\D/g, "").slice(0, 10) };
                              setBooking({ ...booking, travelerDetails: updated });
                            }}
                            className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              )}

              {/* ===== STEP 1 → 2 CONTINUE BUTTON ===== */}
              {checkoutStep === 1 && (
                <motion.div variants={itemVariants}>
                  <Button size="lg" className="w-full gap-2 text-base" onClick={() => {
                    const b = bookingRef.current;
                    const missingNames = b.travelerDetails.some(t => !t.name?.trim());
                    const missingAges = b.travelerDetails.some(t => !t.age?.trim());
                    const missingGenders = b.travelerDetails.some(t => !t.gender?.trim());
                    const missingDate = !b.startDate;
                    
                    if (missingDate) {
                      setFieldErrors(prev => ({ ...prev, date: "Please select a journey date" }));
                      showToast("⚠️ Please select your journey date", "info");
                      return;
                    }
                    if (missingNames || missingAges || missingGenders) {
                      setFieldErrors(prev => ({ ...prev, travelers: "Please fill name, age and gender for all travelers" }));
                      showToast("⚠️ Fill name, age and gender for all travelers", "info");
                      document.getElementById("traveler-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                      return;
                    }
                    setFieldErrors({});
                    setCheckoutStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}>
                    Continue to Contact & Payment →
                  </Button>
                </motion.div>
              )}

              {/* ===== SECTION 2: CONTACT INFO + PAYMENT (STEP 2) ===== */}
              {checkoutStep === 2 && (
              <>
              <motion.div variants={itemVariants} className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                <h2 className="font-semibold flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-accent" /> Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="customerName" className="text-xs text-text-muted block mb-1">Full Name <span className="text-red-400">*</span></label>
                    <input type="text" id="customerName" name="customerName" autoComplete="name" placeholder="Enter your name" value={booking.customerName}
                      onChange={(e) => { setBooking({ ...booking, customerName: e.target.value }); if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
                      className={`w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors ${fieldErrors.name ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light"}`} />
                    {fieldErrors.name && <p className="text-[10px] text-red-400 mt-1">⚠️ {fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="customerEmail" className="text-xs text-text-muted block mb-1">Email <span className="text-red-400">*</span></label>
                    <input type="email" id="customerEmail" name="customerEmail" autoComplete="email" placeholder="your@email.com" value={booking.customerEmail}
                      onChange={(e) => { setBooking({ ...booking, customerEmail: e.target.value }); if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
                      className={`w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors ${fieldErrors.email ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light"}`} />
                    {fieldErrors.email && <p className="text-[10px] text-red-400 mt-1">⚠️ {fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="customerPhone" className="text-xs text-text-muted block mb-1">Phone <span className="text-text-muted/50">(optional)</span></label>
                    <input type="tel" id="customerPhone" name="customerPhone" autoComplete="tel" placeholder="9876543210" value={booking.customerPhone}
                      onChange={(e) => setBooking({ ...booking, customerPhone: formatPhone(e.target.value) })}
                      className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label htmlFor="specialRequests" className="text-xs text-text-muted block mb-1">Special Requests <span className="text-text-muted/50">(optional)</span></label>
                  <textarea id="specialRequests" name="specialRequests" placeholder="Any dietary requirements, room preferences, etc." value={booking.specialRequests}
                    onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                    rows={2}
                    className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors resize-none" />
                </div>
              </motion.div>

              {/* ===== SECTION 3: PAYMENT ===== */}
              <motion.div variants={itemVariants}
                className="rounded-2xl border border-border-light bg-gradient-to-br from-accent/5 to-accent/[0.02] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Pay with Razorpay</h2>
                    <p className="text-xs text-text-muted">Secure payments powered by Razorpay</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 opacity-60">
                  {[
                    { id: "upi", label: "UPI", icon: Smartphone },
                    { id: "card", label: "Card", icon: CreditCard },
                    { id: "netbanking", label: "Net Banking", icon: Building2 },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <div key={method.id}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-light bg-surface-lighter/20">
                        <Icon className="w-4 h-4 text-text-muted" />
                        <span className="text-[10px] text-text-muted">{method.label}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-text-muted">
                  Pay with UPI, Credit/Debit Card, Net Banking, Wallets & more.
                  All payments are processed securely via Razorpay.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <Shield className="w-3 h-3 text-green-400" />
                  PCI-DSS compliant · 256-bit SSL · 3D Secure
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:hidden">
                <Button size="lg" className="w-full gap-2 text-base" onClick={handlePay}>
                  <Wallet className="w-5 h-5" /> Pay ₹{total.toLocaleString()}
                </Button>
                <p className="text-[10px] text-text-muted text-center mt-2">
                  <Shield className="w-3 h-3 inline mr-0.5" /> Powered by Razorpay · 3D Secure
                </p>
              </motion.div>

              {/* Back to Step 1 */}
              <motion.div variants={itemVariants} className="text-center">
                <button onClick={() => { setCheckoutStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-sm text-text-muted hover:text-text-primary transition-colors underline underline-offset-4 decoration-border-light">
                  ← Back to Passenger Details
                </button>
              </motion.div>
              </>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-border-light bg-surface-lighter/20 overflow-hidden">
                <div className="p-5 border-b border-border-light">
                  <div className="flex items-center gap-3">
                    <img src={tour.image} alt={tour.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-semibold text-sm">{tour.name}</h3>
                      <p className="text-xs text-text-muted">{tour.location}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{tour.duration}</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-text-muted">Fare Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Base price (×{booking.travelers})</span>
                    <span>₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-blue-400">
                    <span>SGST (2.5%)</span>
                    <span>₹{sgst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>CGST (2.5%)</span>
                    <span>₹{cgst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Booking fee</span>
                    <span>₹{bookingFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400 bg-green-500/5 -mx-1 px-3 py-2 rounded-xl">
                      <span className="flex items-center gap-1 font-medium"><BadgePercent className="w-3 h-3" /> {appliedOffer?.code}</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base pt-3 border-t border-border-light font-bold">
                    <span>Total Amount</span>
                    <span className="text-accent text-xl">₹{total.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> You saved ₹{discount.toLocaleString()}!
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="border-t border-border-light px-5 py-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                    <BadgePercent className="w-3.5 h-3.5 text-accent" /> Apply Coupon Code <span className="text-text-muted/50 normal-case font-normal">(optional)</span>
                  </h3>
                  {appliedOffer ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-green-400">{appliedOffer.code}</div>
                        <div className="text-xs text-text-muted">You saved ₹{appliedOffer.discount.toLocaleString()}</div>
                      </div>
                      <button onClick={handleRemoveOffer} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input type="text" id="couponCode" name="couponCode" autoComplete="off" placeholder="Enter code" value={offerInput}
                          onChange={(e) => { setOfferInput(e.target.value.toUpperCase()); setOfferError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyOffer()}
                          className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors uppercase" />
                        <Button variant="secondary" size="sm" className="gap-1" onClick={handleApplyOffer} disabled={offerLoading || !offerInput.trim()}>
                          {offerLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ticket className="w-3 h-3" />} Apply
                        </Button>
                      </div>
                      {offerError && <p className="text-xs text-red-400 mt-1">{offerError}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {offerCodes.slice(0, 4).map((offer) => (
                          <button key={offer.code} onClick={() => { setOfferInput(offer.code); setOfferError(""); }}
                            className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors">
                            {offer.code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Pay Now */}
                <div className="px-5 pb-5 hidden lg:block">
                  <Button size="lg" className="w-full gap-2 text-base" onClick={handlePay}>
                    <Wallet className="w-5 h-5" /> Pay ₹{total.toLocaleString()}
                  </Button>
                  <p className="text-[10px] text-text-muted text-center mt-2">
                    <Shield className="w-3 h-3 inline mr-0.5" /> Secure payment · Cancel within 24 hours
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
