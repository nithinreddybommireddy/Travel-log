import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Shield, CreditCard, Smartphone, Building2,
  CheckCircle2, BadgePercent, Users, Ticket,
  Loader2, Wallet, Mail,
  Copy, Check, QrCode, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tours } from "@/features/tours/data/tours";
import { offerCodes, validateOfferCode } from "@/features/booking/data/offers";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { sendBookingConfirmation } from "@/services/emailService";

type PaymentMethod = "card" | "upi" | "netbanking";

interface BookingState {
  travelers: number;
  startDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
}

const DRAFT_KEY = "travellog_checkout_draft";

function loadDraft(tourId: string): Partial<BookingState> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Only restore draft for the same tour
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
  } catch { /* ignore quota errors */ }
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

  // Today's date in YYYY-MM-DD format (for min date on date picker)
  const todayDate = useMemo(() => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }, []);

  // Pre-fill from Quick Rebook params
  const rebookTravelers = Math.max(1, parseInt(searchParams.get("travelers") || "1", 10));

  // Load saved draft on mount
  const savedDraft = useMemo(() => (id ? loadDraft(id) : null), [id]);

  // Booking form state — pre-fill Name & Email from logged-in user's profile
  const [booking, setBooking] = useState<BookingState>(() => ({
    travelers: savedDraft?.travelers ?? Math.min(rebookTravelers, tour?.maxPeople || 30),
    startDate: savedDraft?.startDate ?? "",
    customerName: savedDraft?.customerName ?? user?.name ?? "",
    customerEmail: savedDraft?.customerEmail ?? user?.email ?? "",
    customerPhone: savedDraft?.customerPhone ?? "",
    specialRequests: savedDraft?.specialRequests ?? "",
  }));

  // Ref to always have the latest booking data (avoids stale closures)
  const bookingRef = useRef(booking);
  bookingRef.current = booking;

  // Step tracker — declared BEFORE effects that reference it
  const [step, setStep] = useState<"form" | "processing" | "confirmed">("form");

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; date?: string }>({});

  // Auto-save draft on changes (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    if (!id || step !== "form") return;
    // Debounce: wait 500ms after last change before saving
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(id, booking);
      setDraftSaved(true);
      // Reset the "saved" indicator after 2s
      setTimeout(() => setDraftSaved(false), 2000);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [id, booking, step]);

  // Offer code state
  const [offerInput, setOfferInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<{ code: string; discount: number } | null>(null);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

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

  // Pricing
  const basePrice = tour.price * booking.travelers;
  const sgst = Math.round(basePrice * 0.025);  // State GST @ 2.5%
  const cgst = Math.round(basePrice * 0.025);  // Central GST @ 2.5%
  const totalGst = sgst + cgst;
  const bookingFee = 199;
  const discount = appliedOffer?.discount || 0;
  const total = basePrice + totalGst + bookingFee - discount;

  // UPI state - moved after total declaration
  const [upiId, setUpiId] = useState("travellog@upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // UPI payment URL for QR code
  const upiPaymentUrl = useMemo(() => {
    const cleanUpi = upiId.replace(/\s/g, "");
    if (!cleanUpi.includes("@")) return "";
    const params = new URLSearchParams({
      pa: cleanUpi,
      pn: "TravelLog",
      am: total.toString(),
      cu: "INR",
      tn: `Booking for ${tour.name}`.slice(0, 50),
    });
    return `upi://pay?${params.toString()}`;
  }, [upiId, total, tour?.name]);

  const qrCodeUrl = useMemo(() => {
    if (!upiPaymentUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentUrl)}&bgcolor=ffffff&color=1a1a2e&margin=10`;
  }, [upiPaymentUrl]);

  const handleCopyUpi = () => {
    const cleanUpi = upiId.replace(/\s/g, "");
    if (cleanUpi) {
      navigator.clipboard.writeText(cleanUpi).then(() => {
        setCopied(true);
        showToast("UPI ID copied!", "success");
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleOpenUpiApp = (appName: string) => {
    setSelectedUpiApp(appName);
    if (upiPaymentUrl) {
      window.open(upiPaymentUrl, "_blank");
    }
  };

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const formatPhone = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 10);
  };

  const handleApplyOffer = useCallback(() => {
    if (!offerInput.trim()) return;
    setOfferLoading(true);
    setOfferError("");

    // Simulate API call
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

  const handlePay = () => {
    // Use ref to get the absolute latest booking data
    const b = bookingRef.current;
    // Validate required fields with specific error messages
    const errors: { name?: string; email?: string; date?: string } = {};
    if (!b.customerName?.trim()) errors.name = "Name is required";
    if (!b.customerEmail?.trim()) errors.email = "Email is required";
    if (!b.startDate) errors.date = "Start date is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const missing = Object.values(errors).join(" · ");
      showToast(`⚠️ ${missing}`, "info");
      // Scroll to the form
      document.getElementById("traveler-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setFieldErrors({});
    clearDraft();

    // Save booking to localStorage IMMEDIATELY (before the processing timeout)
    const bookingId = Date.now().toString(36);
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
    };
    try {
      const existing = JSON.parse(localStorage.getItem("travellog_bookings") || "[]");
      existing.unshift(newBooking);
      localStorage.setItem("travellog_bookings", JSON.stringify(existing.slice(0, 50)));
      // Verify the save by reading it back
      const verify = JSON.parse(localStorage.getItem("travellog_bookings") || "[]");
      const saved = verify.find((b: any) => b.id === bookingId);
      if (!saved) throw new Error("Save verification failed");
    } catch (e) {
      showToast("Failed to save booking. Please try again.", "error");
      setStep("form");
      return;
    }

    setStep("processing");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Simulate payment processing — only for the visual transition
    setTimeout(() => {
      setStep("confirmed");
      showToast("Booking confirmed! 🎉", "success");
    }, 2500);
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

          {/* Email Confirmation */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">Get Email Confirmation</span>
            </div>
            <p className="text-xs text-text-secondary mb-3">
              We'll send your booking details directly to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                defaultValue={booking.customerEmail}
                id="confirm-email"
                className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors"
              />
              <Button
                variant="secondary"
                className="gap-2 shrink-0"
                onClick={() => {
                  const emailInput = document.getElementById("confirm-email") as HTMLInputElement;
                  const email = emailInput?.value.trim();
                  if (!email || !email.includes("@")) {
                    showToast("Please enter a valid email address", "info");
                    return;
                  }
                  const bookingInfo = {
                    id: Date.now().toString(36),
                    tourName: tour.name,
                    location: tour.location,
                    startDate: booking.startDate,
                    travelers: booking.travelers,
                    totalPaid: total,
                    discount: discount,
                    coupon: appliedOffer?.code || null,
                    status: "confirmed",
                  };
                  sendBookingConfirmation(bookingInfo, email);
                  showToast("Confirmation email opened! ✉️", "success");
                }}
              >
                <Mail className="w-4 h-4" />
                Send
              </Button>
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              We'll open your email client with a pre-filled confirmation. Click send to receive it.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              View My Bookings
            </Button>
            <Button onClick={() => navigate("/tours")}>
              Explore More Tours
            </Button>
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
              <Shield className="w-4 h-4 text-green-400" />
              Secured with 256-bit encryption
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

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-16">
      {/* Sticky Bottom Bar - Always visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-border-light px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted">Total Amount</p>
            <p className="text-lg font-bold text-accent">₹{total.toLocaleString()}</p>
          </div>
          <Button size="default" className="gap-2 shrink-0 min-w-[130px]" onClick={handlePay}>
            <Wallet className="w-4 h-4" /> Pay Now
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to={`/tours/${tour.id}`}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {tour.name}
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Column - Traveler Details + Payment Method */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold mb-1">Book Your Trip</h1>
                <p className="text-text-secondary text-sm">{tour.name} — {tour.duration}</p>
              </motion.div>

              {/* Traveler Details */}
              <motion.div variants={itemVariants} className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" /> Traveler Details
                  {draftSaved && (
                    <span className="ml-auto text-[10px] text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Saved
                    </span>
                  )}
                </h2>
                <div id="traveler-form" className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-text-muted block mb-1">Full Name <span className="text-red-400">*</span></label>
                    <input type="text" placeholder="Enter your name" value={booking.customerName}
                      onChange={(e) => { setBooking({ ...booking, customerName: e.target.value }); if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
                      className={`w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors ${fieldErrors.name ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light"}`} />
                    {fieldErrors.name && <p className="text-[10px] text-red-400 mt-1">⚠️ {fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">Email <span className="text-red-400">*</span></label>
                    <input type="email" placeholder="your@email.com" value={booking.customerEmail}
                      onChange={(e) => { setBooking({ ...booking, customerEmail: e.target.value }); if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
                      className={`w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors ${fieldErrors.email ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light"}`} />
                    {fieldErrors.email && <p className="text-[10px] text-red-400 mt-1">⚠️ {fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">Phone <span className="text-text-muted/50">(optional)</span></label>
                    <input type="tel" placeholder="9876543210" value={booking.customerPhone}
                      onChange={(e) => setBooking({ ...booking, customerPhone: formatPhone(e.target.value) })}
                      className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted block mb-1">Travelers</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setBooking({ ...booking, travelers: Math.max(1, booking.travelers - 1) })}
                        className="w-9 h-9 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg">−</button>
                      <span className="font-semibold text-lg w-8 text-center">{booking.travelers}</span>
                      <button onClick={() => setBooking({ ...booking, travelers: Math.min(tour.maxPeople, booking.travelers + 1) })}
                        className="w-9 h-9 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">Start Date <span className="text-red-400">*</span></label>
                    <input type="date" value={booking.startDate} min={todayDate}
                      onChange={(e) => { setBooking({ ...booking, startDate: e.target.value }); if (fieldErrors.date) setFieldErrors((prev) => ({ ...prev, date: undefined })); }}
                      className={`w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors ${fieldErrors.date ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light"}`} />
                    {fieldErrors.date && <p className="text-[10px] text-red-400 mt-1">⚠️ {fieldErrors.date}</p>}
                    <p className="text-[10px] text-text-muted mt-1">Select a future date for your trip</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Special Requests <span className="text-text-muted/50">(optional)</span></label>
                  <textarea placeholder="Any dietary requirements, room preferences, etc." value={booking.specialRequests}
                    onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                    rows={2}
                    className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors resize-none" />
                </div>
              </motion.div>

              {/* Payment Method Selector */}
              <motion.div variants={itemVariants}>
                <h2 className="font-semibold flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-accent" /> Payment Method
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "upi" as const, label: "UPI", icon: Smartphone },
                    { id: "card" as const, label: "Card", icon: CreditCard },
                    { id: "netbanking" as const, label: "Net Banking", icon: Building2 },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          active
                            ? "border-accent bg-accent/5"
                            : "border-border-light bg-surface-lighter/30 hover:border-accent/30"
                        }`}>
                        <Icon className={`w-5 h-5 ${active ? "text-accent" : "text-text-muted"}`} />
                        <span className={`text-xs font-medium ${active ? "text-accent" : "text-text-muted"}`}>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Card Form */}
              {paymentMethod === "card" && (
                <motion.div variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-sm">Card Details</span>
                    <div className="flex-1" />
                    <div className="flex gap-1">
                      {["visa", "mastercard", "rupay"].map((card) => (
                        <span key={card} className="text-[10px] px-2 py-0.5 rounded bg-surface-lighter/50 text-text-muted border border-border-light capitalize">{card}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))} maxLength={19}
                      className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-text-muted block mb-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} maxLength={5}
                        className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">CVV</label>
                      <input type="password" placeholder="•••" value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4}
                        className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">Name on Card</label>
                    <input type="text" placeholder="John Doe" value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                  </div>
                </motion.div>
              )}

              {/* UPI Form */}
              {paymentMethod === "upi" && (
                <motion.div variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-5"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm">Scan & Pay with UPI</span>
                      <p className="text-[11px] text-text-muted">Scan the QR code or enter your UPI app</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative shrink-0">
                      {qrCodeUrl ? (
                        <div className="bg-white rounded-2xl p-3 shadow-lg shadow-accent/5 border border-border-light">
                          <img src={qrCodeUrl} alt="UPI QR Code" className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl"
                            onError={(e) => { const t = e.currentTarget; t.style.display = "none"; const f = t.nextElementSibling; if (f) (f as HTMLElement).style.display = "flex"; }} />
                          <div className="hidden absolute inset-0 items-center justify-center bg-white/95 rounded-2xl flex-col p-4 text-center">
                            <QrCode className="w-8 h-8 text-text-muted mb-2" /><p className="text-xs text-text-muted">QR unavailable</p>
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-[10px] font-semibold text-gray-800">₹{total.toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-surface-lighter/40 border-2 border-dashed border-border-light flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="w-10 h-10 text-text-muted/50 mx-auto mb-2" /><p className="text-[11px] text-text-muted">Enter UPI ID</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <label className="text-xs text-text-muted block mb-1.5">UPI ID / VPA</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="yourname@upi" value={upiId}
                            onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                            className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                          <button onClick={handleCopyUpi}
                            className="w-10 h-10 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-all shrink-0">
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-text-muted" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Google Pay", icon: "📱" },
                          { name: "PhonePe", icon: "📲" },
                          { name: "Paytm", icon: "🟡" },
                          { name: "BHIM", icon: "🇮🇳" },
                        ].map((app) => {
                          const active = selectedUpiApp === app.name;
                          return (
                            <button key={app.name} onClick={() => handleOpenUpiApp(app.name)}
                              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                active ? "border-accent bg-accent/5" : "border-border-light bg-surface-lighter/30 hover:border-accent/30"
                              }`}>
                              <span className="text-lg shrink-0">{app.icon}</span>
                              <span className="text-xs font-medium">{app.name}</span>
                              <ExternalLink className={`w-3 h-3 ml-auto ${active ? "text-accent" : "text-text-muted/40"}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { step: "1", title: "Scan QR", desc: "Open UPI app & scan" },
                      { step: "2", title: "Verify", desc: `₹${total.toLocaleString()}` },
                      { step: "3", title: "Pay", desc: "Enter UPI PIN" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-lighter/30 border border-border-light">
                        <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] font-bold shrink-0">{item.step}</div>
                        <div><div className="text-[11px] font-medium">{item.title}</div><div className="text-[10px] text-text-muted">{item.desc}</div></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Net Banking */}
              {paymentMethod === "netbanking" && (
                <motion.div variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-sm">Net Banking</span>
                  </div>
                  <select className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors">
                    <option value="">Select your bank</option>
                    {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Yes Bank", "PNB", "Canara Bank"].map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Security note */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs text-text-muted">
                <Shield className="w-4 h-4 text-green-400" />
                Your payment is secured with 256-bit SSL encryption.
              </motion.div>

              {/* Pay Now Button - Bottom of Form (visible on all screens) */}
              <motion.div variants={itemVariants} className="lg:hidden">
                <Button size="lg" className="w-full gap-2 text-base" onClick={handlePay}>
                  <Wallet className="w-5 h-5" /> Pay ₹{total.toLocaleString()}
                </Button>
                <p className="text-[10px] text-text-muted text-center mt-2">
                  <Shield className="w-3 h-3 inline mr-0.5" />
                  Secure payment · You can cancel within 24 hours
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar - Fare + Coupon + Pay Now */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-border-light bg-surface-lighter/20 overflow-hidden"
              >
                {/* Tour Info */}
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

                {/* Fare Breakdown */}
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

                  {/* Discount Line */}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400 bg-green-500/5 -mx-1 px-3 py-2 rounded-xl">
                      <span className="flex items-center gap-1 font-medium">
                        <BadgePercent className="w-3 h-3" /> {appliedOffer?.code}
                      </span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between text-base pt-3 border-t border-border-light font-bold">
                    <span>Total Amount</span>
                    <span className="text-accent text-xl">₹{total.toLocaleString()}</span>
                  </div>

                  {/* Savings badge */}
                  {discount > 0 && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> You saved ₹{discount.toLocaleString()}!
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon Code Section (in sidebar, below fare) */}
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
                        <input type="text" placeholder="Enter code" value={offerInput}
                          onChange={(e) => { setOfferInput(e.target.value.toUpperCase()); setOfferError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyOffer()}
                          className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors uppercase" />
                        <Button variant="secondary" size="sm" className="gap-1" onClick={handleApplyOffer} disabled={offerLoading || !offerInput.trim()}>
                          {offerLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ticket className="w-3 h-3" />}
                          Apply
                        </Button>
                      </div>
                      {offerError && <p className="text-xs text-red-400 mt-1">{offerError}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {offerCodes.slice(0, 4).map((offer) => (
                          <button key={offer.code}
                            onClick={() => { setOfferInput(offer.code); setOfferError(""); }}
                            className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors">
                            {offer.code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Pay Now Button (desktop only - in sidebar) */}
                <div className="px-5 pb-5 hidden lg:block">
                  <Button size="lg" className="w-full gap-2 text-base" onClick={handlePay}>
                    <Wallet className="w-5 h-5" /> Pay ₹{total.toLocaleString()}
                  </Button>
                  <p className="text-[10px] text-text-muted text-center mt-2">
                    <Shield className="w-3 h-3 inline mr-0.5" />
                    Secure payment · You can cancel within 24 hours
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
