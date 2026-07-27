import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shield, CreditCard, Smartphone, Building2,
  CheckCircle2, BadgePercent, Users, Ticket,
  Loader2, ChevronRight, Wallet, Sparkles, Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tours } from "@/features/tours/data/tours";
import { offerCodes, specialOffers, validateOfferCode } from "@/features/booking/data/offers";
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

export function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const tour = tours.find((t) => t.id === id);

  // Pre-fill from Quick Rebook params
  const rebookTravelers = Math.max(1, parseInt(searchParams.get("travelers") || "1", 10));

  // Booking form state
  const [booking, setBooking] = useState<BookingState>({
    travelers: Math.min(rebookTravelers, tour?.maxPeople || 30),
    startDate: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: "",
  });

  // Offer code state
  const [offerInput, setOfferInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<{ code: string; discount: number } | null>(null);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [step, setStep] = useState<"details" | "payment" | "processing" | "confirmed">("details");

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
  const gst = Math.round(basePrice * 0.05);
  const bookingFee = 199;
  const discount = appliedOffer?.discount || 0;
  const total = basePrice + gst + bookingFee - discount;

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

  const handleProceedToPayment = () => {
    if (!booking.customerName || !booking.customerEmail || !booking.startDate) {
      showToast("Please fill in all required fields", "info");
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = () => {
    setStep("processing");
    // Simulate payment processing
    setTimeout(() => {
      setStep("confirmed");
      // Save booking to localStorage
      const bookings = JSON.parse(localStorage.getItem("travellog_bookings") || "[]");
      bookings.unshift({
        id: Date.now().toString(36),
        tourId: tour.id,
        tourName: tour.name,
        travelers: booking.travelers,
        startDate: booking.startDate,
        totalPaid: total,
        discount: discount,
        coupon: appliedOffer?.code || null,
        bookedAt: Date.now(),
        status: "confirmed",
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
      });
      // Also sync to the Booking type used across the app
      try {
        const existing = JSON.parse(localStorage.getItem("travellog_bookings") || "[]");
        if (!existing.find((b: any) => b.id === bookings[0].id)) {
          localStorage.setItem("travellog_bookings", JSON.stringify(bookings.slice(0, 50)));
        }
      } catch { /* ignore */ }
      localStorage.setItem("travellog_bookings", JSON.stringify(bookings.slice(0, 50)));
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
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to={`/tours/${tour.id}`}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {tour.name}
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: Details */}
              {step === "details" && (
                <motion.div key="details" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold mb-1">Book Your Trip</h1>
                    <p className="text-text-secondary text-sm">{tour.name} — {tour.duration}</p>
                  </motion.div>

                  {/* Traveler Details */}
                  <motion.div variants={itemVariants} className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" /> Traveler Details
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs text-text-muted block mb-1">Full Name *</label>
                        <input type="text" placeholder="Enter your name" value={booking.customerName}
                          onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                          className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1">Email *</label>
                        <input type="email" placeholder="your@email.com" value={booking.customerEmail}
                          onChange={(e) => setBooking({ ...booking, customerEmail: e.target.value })}
                          className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1">Phone</label>
                        <input type="tel" placeholder="9876543210" value={booking.customerPhone}
                          onChange={(e) => setBooking({ ...booking, customerPhone: formatPhone(e.target.value) })}
                          className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-text-muted block mb-1">Number of Travelers *</label>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setBooking({ ...booking, travelers: Math.max(1, booking.travelers - 1) })}
                            className="w-9 h-9 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg">−</button>
                          <span className="font-semibold text-lg w-8 text-center">{booking.travelers}</span>
                          <button onClick={() => setBooking({ ...booking, travelers: Math.min(tour.maxPeople, booking.travelers + 1) })}
                            className="w-9 h-9 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg">+</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1">Start Date *</label>
                        <input type="date" value={booking.startDate}
                          onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                          className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">Special Requests (optional)</label>
                      <textarea placeholder="Any dietary requirements, room preferences, etc." value={booking.specialRequests}
                        onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                        rows={2}
                        className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors resize-none" />
                    </div>
                  </motion.div>

                  {/* Offer Code */}
                  <motion.div variants={itemVariants} className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-3">
                    <h2 className="font-semibold flex items-center gap-2">
                      <BadgePercent className="w-4 h-4 text-accent" /> Apply Coupon
                    </h2>
                    {appliedOffer ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-green-400">{appliedOffer.code}</div>
                          <div className="text-xs text-text-muted">You save ₹{appliedOffer.discount.toLocaleString()}</div>
                        </div>
                        <button onClick={handleRemoveOffer} className="text-xs text-text-muted hover:text-red-400 transition-colors">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Enter coupon code" value={offerInput}
                            onChange={(e) => { setOfferInput(e.target.value.toUpperCase()); setOfferError(""); }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyOffer()}
                            className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors uppercase" />
                          <Button variant="secondary" className="gap-2" onClick={handleApplyOffer} disabled={offerLoading || !offerInput.trim()}>
                            {offerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                            Apply
                          </Button>
                        </div>
                        {offerError && <p className="text-xs text-red-400">{offerError}</p>}
                        <div className="flex flex-wrap gap-1.5">
                          {offerCodes.slice(0, 4).map((offer) => (
                            <button key={offer.code}
                              onClick={() => { setOfferInput(offer.code); setOfferError(""); }}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors">
                              {offer.code}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>

                  {/* Special Offers */}
                  <motion.div variants={itemVariants} className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5">
                    <h2 className="font-semibold flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-accent" /> Special Offers
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {specialOffers.map((offer) => (
                        <div key={offer.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-lighter/30 border border-border-light">
                          <span className="text-lg">{offer.icon}</span>
                          <div>
                            <div className="text-xs font-medium">{offer.title}</div>
                            <div className="text-[10px] text-text-muted">{offer.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button size="lg" className="w-full gap-2" onClick={handleProceedToPayment}>
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* STEP 2: Payment */}
              {step === "payment" && (
                <motion.div key="payment" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <button onClick={() => setStep("details")}
                      className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back to details
                    </button>
                    <h1 className="text-3xl font-bold mb-1">Payment</h1>
                    <p className="text-text-secondary text-sm">Choose your payment method</p>
                  </motion.div>

                  {/* Payment Methods */}
                  <motion.div variants={itemVariants} className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "card" as const, label: "Card", icon: CreditCard },
                        { id: "upi" as const, label: "UPI", icon: Smartphone },
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
                      className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-sm">UPI Payment</span>
                      </div>
                      <div>
                        <label className="text-xs text-text-muted block mb-1">UPI ID / VPA</label>
                        <input type="text" placeholder="example@upi" 
                          className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                          <button key={app}
                            className="text-[11px] px-3 py-1.5 rounded-full bg-surface-lighter/50 border border-border-light hover:border-accent/30 transition-colors">
                            {app}
                          </button>
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
                    Your payment is secured with 256-bit SSL encryption. We do not store your card details.
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button size="lg" className="w-full gap-2" onClick={handlePay}>
                      <Wallet className="w-4 h-4" /> Pay ₹{total.toLocaleString()}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-border-light bg-surface-lighter/20 overflow-hidden"
              >
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
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Base price (×{booking.travelers})</span>
                    <span>₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">GST (5%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Booking fee</span>
                    <span>₹{bookingFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span className="flex items-center gap-1">
                        <BadgePercent className="w-3 h-3" /> Discount ({appliedOffer?.code})
                      </span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-3 border-t border-border-light font-semibold">
                    <span>Total</span>
                    <span className="text-accent text-lg">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                {!appliedOffer && (
                  <div className="px-5 pb-5">
                    <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <div className="text-xs font-medium text-accent mb-1">💡 Save on this booking!</div>
                      <p className="text-[10px] text-text-muted">Use code <strong className="text-accent">WELCOME50</strong> for 50% off up to ₹5,000 on first booking</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
