import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Shield, Smartphone,
  CheckCircle2, BadgePercent, Users, Ticket, Loader2,
  Mail, MessageSquare, MessageCircle, CalendarDays,
  ChevronLeft, ChevronRight,
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
} from "@/services/notificationService";


interface TravelerInfo {
  name: string;
  age: string;
  gender: string;
  phone: string;
  location: string;
}

interface BookingForm {
  travelers: number;
  startDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  travelerDetails: TravelerInfo[];
}

function getDates(count: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function pad(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

function toDateStr(d: Date): string {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function fmtDate(d: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()];
}

function fmtLong(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function fmtDay(d: Date): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
}

function fmtMonth(d: Date): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
}

const DRAFT_KEY = "travellog_checkout_draft";

function loadDraft(tourId: string): Partial<BookingForm> | null {
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

function saveDraft(tourId: string, data: BookingForm) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, _tourId: tourId }));
  } catch {
    /* ignore */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

function makeTravelerDetails(count: number, saved?: TravelerInfo[]): TravelerInfo[] {
  const result: TravelerInfo[] = [];
  for (let i = 0; i < count; i++) {
    result.push(saved?.[i] ?? { name: "", age: "", gender: "", phone: "", location: "" });
  }
  return result;
}

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const tour = tours.find((t) => t.id === id);

  const availableDates = getDates(60);

  const savedDraft = id ? loadDraft(id) : null;

  const initialTravelers = savedDraft?.travelers ?? 2;

  const [form, setForm] = useState<BookingForm>(() => ({
    travelers: initialTravelers,
    startDate: savedDraft?.startDate ?? "",
    customerName: savedDraft?.customerName ?? user?.name ?? "",
    customerEmail: savedDraft?.customerEmail ?? user?.email ?? "",
    customerPhone: savedDraft?.customerPhone ?? "",
    specialRequests: savedDraft?.specialRequests ?? "",
    travelerDetails: makeTravelerDetails(initialTravelers, savedDraft?.travelerDetails),
  }));

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [page, setPage] = useState<"form" | "processing" | "confirmed">("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [datePage, setDatePage] = useState(0);

  const [offerInput, setOfferInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<{ code: string; discount: number } | null>(null);
  const [offerError, setOfferError] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  const formRef = useRef(form);
  formRef.current = form;

  // Sync traveler details count
  useEffect(() => {
    if (form.travelers !== form.travelerDetails.length) {
      setForm((prev) => ({
        ...prev,
        travelerDetails: makeTravelerDetails(prev.travelers, prev.travelerDetails),
      }));
    }
  }, [form.travelers, form.travelerDetails.length]);

  // Auto-fill traveler 1 name from customer name
  useEffect(() => {
    if (form.customerName?.trim() && form.travelerDetails.length > 0 && !form.travelerDetails[0].name?.trim()) {
      const updated = [...form.travelerDetails];
      updated[0] = { ...updated[0], name: form.customerName };
      setForm((prev) => ({ ...prev, travelerDetails: updated }));
    }
  }, [form.customerName, form.travelerDetails.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save draft
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    if (!id || page !== "form") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDraft(id, form);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [id, form, page]);

  // Not found
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tour Not Found</h1>
          <p className="text-text-secondary mb-6">This destination doesn't exist.</p>
          <Link to="/tours">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Tours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const basePrice = tour.price * form.travelers;
  const sgst = Math.round(basePrice * 0.025);
  const cgst = Math.round(basePrice * 0.025);
  const bookingFee = 199;
  const discount = appliedOffer?.discount || 0;
  const total = basePrice + sgst + cgst + bookingFee - discount;

  const datesPerPage = 21;
  const totalPages = Math.ceil(availableDates.length / datesPerPage);
  const visibleDates = availableDates.slice(datePage * datesPerPage, (datePage + 1) * datesPerPage);

  const handleApplyOffer = () => {
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
  };

  const handleRemoveOffer = () => {
    setAppliedOffer(null);
    setOfferInput("");
    setOfferError("");
  };

  const UPI_ID = "6301820703@slc";

  const handlePay = async () => {
    // Read DOM fallback for autofilled values
    let b = formRef.current;

    const nameEl = document.getElementById("customerName") as HTMLInputElement | null;
    const emailEl = document.getElementById("customerEmail") as HTMLInputElement | null;

    if (nameEl && !b.customerName?.trim()) {
      b = { ...b, customerName: nameEl.value };
    }
    if (emailEl && !b.customerEmail?.trim()) {
      b = { ...b, customerEmail: emailEl.value };
    }

    // DOM fallback for traveler fields
    for (let i = 0; i < b.travelerDetails.length; i++) {
      const tNameEl = document.getElementById("traveler-name-" + i) as HTMLInputElement | null;
      const tAgeEl = document.getElementById("traveler-age-" + i) as HTMLInputElement | null;
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

    // Validate contact info
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!b.customerName?.trim()) errs["customerName"] = "Name is required";
    if (!b.customerEmail?.trim()) {
      errs["customerEmail"] = "Email is required";
    } else if (!emailRegex.test(b.customerEmail.trim())) {
      errs["customerEmail"] = "Please enter a valid email address";
    }
    if (!b.customerPhone?.trim() || b.customerPhone.trim().length < 10) {
      errs["customerPhone"] = "Valid 10-digit phone is required";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("⚠️ " + Object.values(errs).join(" · "), "info");
      return;
    }

    setErrors({});
    setForm(b as BookingForm);
    clearDraft();

    // Save booking as pending
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
      status: "pending",
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      travelerDetails: b.travelerDetails,
      paymentId: "UPI-" + Date.now().toString(36).toUpperCase(),
    };

    try {
      const raw = localStorage.getItem("travellog_bookings");
      let existing: any[] = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existing = parsed;
        } catch {
          existing = [];
        }
      }
      existing.unshift(newBooking);
      localStorage.setItem("travellog_bookings", JSON.stringify(existing.slice(0, 50)));
    } catch (saveErr) {
      try {
        const raw = sessionStorage.getItem("travellog_bookings_fallback");
        let existing: any[] = [];
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existing = parsed;
        }
        existing.unshift(newBooking);
        sessionStorage.setItem("travellog_bookings_fallback", JSON.stringify(existing.slice(0, 50)));
      } catch {
        /* ignore */
      }
    }

    setPage("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Booking confirmed! 🎉", "success");
  };

  // ===== CONFIRMED VIEW =====
  if (page === "confirmed") {
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
          <p className="text-text-secondary mb-6">
            Your adventure to <strong>{tour.name}</strong> is confirmed.
          </p>
          <div className="bg-surface-light/40 backdrop-blur-sm rounded-2xl border border-border-light p-6 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-border-light">
              <img src={tour.image} alt={tour.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <div className="font-semibold text-sm">{tour.name}</div>
                <div className="text-xs text-text-muted">{tour.location}</div>
              </div>
            </div>
            {[
              ["📅 Start Date", form.startDate],
              ["👥 Travelers", form.travelers + " traveler" + (form.travelers > 1 ? "s" : "")],
              ["💰 Total Paid", "₹" + total.toLocaleString()],
              ["🆔 Booking ID", "#" + Date.now().toString(36).toUpperCase()],
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
            {form.customerPhone ? (
              <div className="flex gap-2 mb-3">
                <input
                  type="tel" placeholder="Your phone number"
                  defaultValue={form.customerPhone}
                  id="notify-phone" name="notifyPhone" autoComplete="tel"
                  className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400/50 transition-colors"
                  maxLength={10}
                />
                <Button
                  variant="secondary" size="sm"
                  className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400 gap-1"
                  onClick={() => {
                    const p = (document.getElementById("notify-phone") as HTMLInputElement)?.value.trim();
                    if (!p || p.length < 10) {
                      showToast("Please enter a valid 10-digit phone number", "info");
                      return;
                    }
                    sendWhatsAppConfirmation(
                      { id: "", tourName: tour.name, location: tour.location, startDate: form.startDate, travelers: form.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" },
                      p
                    );
                    showToast("WhatsApp opened! 💬", "success");
                  }}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </Button>
                <Button
                  variant="secondary" size="sm"
                  className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400 gap-1"
                  onClick={() => {
                    const p = (document.getElementById("notify-phone") as HTMLInputElement)?.value.trim();
                    if (!p || p.length < 10) {
                      showToast("Please enter a valid 10-digit phone number", "info");
                      return;
                    }
                    sendSMSConfirmation(
                      { id: "", tourName: tour.name, location: tour.location, startDate: form.startDate, travelers: form.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" },
                      p
                    );
                    showToast("SMS app opened! ✉️", "success");
                  }}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> SMS
                </Button>
              </div>
            ) : (
              <p className="text-xs text-text-muted mb-3">Add a phone number to send WhatsApp/SMS notifications.</p>
            )}
          </div>

          {/* Email */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">Get Email Confirmation</span>
            </div>
            <div className="flex gap-2">
              <input
                type="email" placeholder="your@email.com"
                defaultValue={form.customerEmail}
                id="confirm-email" name="confirmEmail" autoComplete="email"
                className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors"
              />
              <Button
                variant="secondary" className="gap-2 shrink-0"
                onClick={() => {
                  const email = (document.getElementById("confirm-email") as HTMLInputElement)?.value.trim();
                  if (!email || !email.includes("@")) {
                    showToast("Please enter a valid email address", "info");
                    return;
                  }
                  sendBookingConfirmation(
                    { id: "", tourName: tour.name, location: tour.location, startDate: form.startDate, travelers: form.travelers, totalPaid: total, discount, coupon: appliedOffer?.code || null, status: "confirmed" },
                    email
                  );
                  showToast("Confirmation email opened! ✉️", "success");
                }}
              >
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

  // ===== PROCESSING VIEW =====
  if (page === "processing") {
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
          </motion.div>
        </div>
      </div>
    );
  }

  // ===== STEP INDICATOR =====
  function StepIndicator() {
    return (
      <div className="flex items-center gap-2 mb-6">
        {[
          { num: 1, label: "Date", step: 1 as const },
          { num: 2, label: "Travelers", step: 2 as const },
          { num: 3, label: "Payment", step: 3 as const },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div
              className={
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all " +
                (step === s.num
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : step > s.num
                  ? "bg-accent/30 text-accent"
                  : "bg-surface-lighter/50 text-text-muted")
              }
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < 2 && (
              <div className={"h-px flex-1 " + (step > s.num ? "bg-accent" : "bg-border-light")} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // ===== MOBILE BOTTOM BAR =====
  function MobileBottomBar() {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-border-light px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-text-muted">Step {step} of 3</p>
            <p className="text-lg font-bold text-accent">
              {step === 1
                ? "Select Date"
                : step === 2
                ? form.travelers + " traveler" + (form.travelers > 1 ? "s" : "")
                : "₹" + total.toLocaleString()}
            </p>
          </div>
          {step === 1 ? (
            <Button
              size="default" className="gap-2 shrink-0 min-w-[130px]"
              onClick={() => {
                if (!formRef.current.startDate) {
                  setErrors({ date: "Please select your journey date" });
                  showToast("⚠️ Please select your journey date", "info");
                  return;
                }
                setErrors({});
                setStep(2);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Continue →
            </Button>
          ) : step === 2 ? (
            <Button
              size="default" className="gap-2 shrink-0 min-w-[130px]"
              onClick={() => {
                const bCheck = formRef.current;
                const missingNames = bCheck.travelerDetails.some((t) => !t.name?.trim());
                const missingAges = bCheck.travelerDetails.some((t) => !t.age?.trim());
                const missingGenders = bCheck.travelerDetails.some((t) => !t.gender?.trim());
                const missingPhones = bCheck.travelerDetails.some((t) => !t.phone?.trim());
                if (missingNames || missingAges || missingGenders || missingPhones) {
                  setErrors({ travelers: "Fill name, age, gender & phone for all travelers" });
                  showToast("⚠️ Fill name, age, gender & phone for all travelers", "info");
                  return;
                }
                setErrors({});
                setStep(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Continue →
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  // ===== MAIN LAYOUT =====
  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-16">
      <MobileBottomBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={"/tours/" + tour.id}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {tour.name}
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN: Form Steps */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Book Your Trip</h1>
              <p className="text-text-secondary text-sm">{tour.name} — {tour.duration}</p>
            </div>

            <StepIndicator />

            {/* ===== STEP 1: SELECT JOURNEY DATE ===== */}
            {step === 1 && (
              <div>
                <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 via-accent/[0.02] to-surface-lighter/20 p-6 sm:p-8 space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Select Your Journey Date</h2>
                    <p className="text-sm text-text-muted">Choose when you'd like to start your adventure</p>
                  </div>

                  {/* Date grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => setDatePage(Math.max(0, datePage - 1))}
                        disabled={datePage === 0}
                        className="p-1.5 rounded-lg hover:bg-surface-lighter/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-text-muted font-medium">
                        Showing {datePage * datesPerPage + 1}–{Math.min((datePage + 1) * datesPerPage, availableDates.length)} of {availableDates.length} dates
                      </span>
                      <button
                        onClick={() => setDatePage(Math.min(totalPages - 1, datePage + 1))}
                        disabled={datePage >= totalPages - 1}
                        className="p-1.5 rounded-lg hover:bg-surface-lighter/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                      {visibleDates.map((date) => {
                        const dStr = toDateStr(date);
                        const isSelected = form.startDate === dStr;
                        const dayNum = date.getDate();
                        return (
                          <button
                            key={dStr}
                            onClick={() => {
                              setForm((prev) => ({ ...prev, startDate: dStr }));
                              setErrors((prev) => ({ ...prev, date: "" }));
                            }}
                            className={
                              "flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs transition-all border " +
                              (isSelected
                                ? "bg-accent text-white border-accent shadow-md shadow-accent/20 scale-105"
                                : "bg-surface-lighter/30 border-border-light hover:border-accent/30 hover:bg-accent/5")
                            }
                          >
                            <span className="font-medium">{fmtDay(date)}</span>
                            <span className={"text-lg font-bold " + (isSelected ? "text-white" : "")}>{dayNum}</span>
                            <span className={"text-[9px] " + (isSelected ? "text-white/70" : "text-text-muted")}>{fmtMonth(date)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected date display */}
                  <div className="text-center p-4 rounded-xl bg-surface-lighter/30 border border-border-light">
                    {form.startDate ? (
                      <div className="flex items-center justify-center gap-2">
                        <CalendarDays className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-lg">{fmtLong(new Date(form.startDate + "T00:00:00"))}</span>
                        <button
                          onClick={() => setForm((prev) => ({ ...prev, startDate: "" }))}
                          className="text-xs text-red-400 hover:text-red-300 ml-2 underline"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <p className="text-text-muted text-sm">No date selected — pick a date above</p>
                    )}
                    {errors.date && <p className="text-[10px] text-red-400 mt-1">⚠️ {errors.date}</p>}
                  </div>

                  <Button
                    size="lg" className="w-full gap-2 text-base"
                    onClick={() => {
                      if (!form.startDate) {
                        setErrors({ date: "Please select your journey date" });
                        showToast("⚠️ Please select your journey date", "info");
                        return;
                      }
                      setErrors({});
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Continue → Traveler Details
                  </Button>
                </div>
              </div>
            )}

            {/* ===== STEP 2: PASSENGER DETAILS ===== */}
            {step === 2 && (
              <div>
                <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/[0.02] p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Who's Coming?</h2>
                      <p className="text-xs text-text-muted">Enter name, age, gender & contact for each traveler</p>
                    </div>
                    {draftSaved && (
                      <span className="ml-auto text-[10px] text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Saved
                      </span>
                    )}
                  </div>

                  {/* Traveler count + date */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-lighter/30 border border-border-light">
                    <div className="flex-1">
                      <span className="text-xs text-text-muted block mb-1">Number of Travelers</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                          className="w-10 h-10 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg"
                          aria-label="Decrease travelers"
                        >
                          −
                        </button>
                        <span className="font-bold text-xl w-8 text-center">{form.travelers}</span>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, travelers: Math.min(tour.maxPeople, prev.travelers + 1) }))}
                          className="w-10 h-10 rounded-xl bg-surface-lighter/50 border border-border-light flex items-center justify-center hover:border-accent/30 transition-colors text-lg"
                          aria-label="Increase travelers"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-text-muted block">Journey Date</span>
                      <span className="text-sm font-medium text-accent">
                        {form.startDate ? fmtDate(new Date(form.startDate + "T00:00:00")) : "Not set"}
                      </span>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[10px] text-accent hover:text-accent/80 underline mt-0.5 block ml-auto"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Per-traveler fields */}
                  <div className="space-y-3">
                    {form.travelerDetails.map((traveler, index) => (
                      <div
                        key={index}
                        className={
                          "p-4 rounded-xl border " +
                          (index === 0 ? "border-accent/30 bg-accent/5" : "border-border-light bg-surface-lighter/30")
                        }
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className={
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " +
                              (index === 0 ? "bg-accent text-white" : "bg-surface-lighter/70 text-text-muted")
                            }
                          >
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">
                            {index === 0 ? "You (Main Traveler)" : "Traveler " + (index + 1)}
                          </span>
                          {index === 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                              Auto-filled
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-1">
                            <label htmlFor={"traveler-name-" + index} className="text-[10px] text-text-muted block mb-1">
                              Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              id={"traveler-name-" + index}
                              name={"traveler-name-" + index}
                              autoComplete={index === 0 ? "name" : "off"}
                              placeholder={index === 0 ? "Your name" : "Traveler " + (index + 1)}
                              value={traveler.name}
                              onChange={(e) => {
                                const updated = [...form.travelerDetails];
                                updated[index] = { ...updated[index], name: e.target.value };
                                setForm((prev) => ({ ...prev, travelerDetails: updated }));
                              }}
                              className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor={"traveler-age-" + index} className="text-[10px] text-text-muted block mb-1">
                              Age <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="number"
                              id={"traveler-age-" + index}
                              name={"traveler-age-" + index}
                              placeholder="25" min="1" max="120"
                              value={traveler.age}
                              onChange={(e) => {
                                const updated = [...form.travelerDetails];
                                updated[index] = { ...updated[index], age: e.target.value.slice(0, 3) };
                                setForm((prev) => ({ ...prev, travelerDetails: updated }));
                              }}
                              className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor={"traveler-gender-" + index} className="text-[10px] text-text-muted block mb-1">
                              Gender <span className="text-red-400">*</span>
                            </label>
                            <select
                              id={"traveler-gender-" + index}
                              name={"traveler-gender-" + index}
                              value={traveler.gender}
                              onChange={(e) => {
                                const updated = [...form.travelerDetails];
                                updated[index] = { ...updated[index], gender: e.target.value };
                                setForm((prev) => ({ ...prev, travelerDetails: updated }));
                              }}
                              className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors appearance-none"
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor={"traveler-phone-" + index} className="text-[10px] text-text-muted block mb-1">
                              Phone <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="tel"
                              id={"traveler-phone-" + index}
                              name={"traveler-phone-" + index}
                              placeholder={index === 0 ? "9876543210" : ""}
                              value={traveler.phone}
                              onChange={(e) => {
                                const updated = [...form.travelerDetails];
                                updated[index] = { ...updated[index], phone: e.target.value.replace(/\D/g, "").slice(0, 10) };
                                setForm((prev) => ({ ...prev, travelerDetails: updated }));
                              }}
                              className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor={"traveler-location-" + index} className="text-[10px] text-text-muted block mb-1">
                              Location <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              id={"traveler-location-" + index}
                              name={"traveler-location-" + index}
                              placeholder={index === 0 ? "City, State" : "City, State"}
                              value={traveler.location}
                              onChange={(e) => {
                                const updated = [...form.travelerDetails];
                                updated[index] = { ...updated[index], location: e.target.value };
                                setForm((prev) => ({ ...prev, travelerDetails: updated }));
                              }}
                              className="w-full bg-surface-lighter/40 border border-border-light rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.travelers && (
                    <p className="text-xs text-red-400 bg-red-500/5 rounded-lg px-3 py-2">⚠️ {errors.travelers}</p>
                  )}
                </div>

                {/* Continue to Payment */}
                <div className="mt-6">
                  <Button
                    size="lg" className="w-full gap-2 text-base"
                    onClick={() => {
                      const b = formRef.current;
                      const missingNames = b.travelerDetails.some((t) => !t.name?.trim());
                      const missingAges = b.travelerDetails.some((t) => !t.age?.trim());
                      const missingGenders = b.travelerDetails.some((t) => !t.gender?.trim());
                      const missingPhones = b.travelerDetails.some((t) => !t.phone?.trim());
                      const missingLocations = b.travelerDetails.some((t) => !t.location?.trim());
                      if (missingNames || missingAges || missingGenders || missingPhones || missingLocations) {
                        setErrors({ travelers: "Fill all fields for all travelers" });
                        showToast("⚠️ Fill all fields for all travelers", "info");
                        return;
                      }
                      setErrors({});
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Continue to Payment →
                  </Button>
                  <div className="text-center mt-3">
                    <button
                      onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors underline underline-offset-4"
                    >
                      ← Back to Date Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 3: CONTACT INFO + PAYMENT ===== */}
            {step === 3 && (
              <div>
                {/* Contact Info */}
                <div className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <h2 className="font-semibold">Contact Information</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="customerName" className="text-xs text-text-muted block mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" id="customerName" name="customerName" autoComplete="name"
                        placeholder="Enter your name"
                        value={form.customerName}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, customerName: e.target.value }));
                          if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: "" }));
                        }}
                        className={
                          "w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors " +
                          (errors.customerName ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light")
                        }
                      />
                      {errors.customerName && <p className="text-[10px] text-red-400 mt-1">⚠️ {errors.customerName}</p>}
                    </div>
                    <div>
                      <label htmlFor="customerEmail" className="text-xs text-text-muted block mb-1">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email" id="customerEmail" name="customerEmail" autoComplete="email"
                        placeholder="your@email.com"
                        value={form.customerEmail}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, customerEmail: e.target.value }));
                          if (errors.customerEmail) setErrors((prev) => ({ ...prev, customerEmail: "" }));
                        }}
                        className={
                          "w-full bg-surface-lighter/40 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors " +
                          (errors.customerEmail ? "border-red-400/70 ring-1 ring-red-400/30" : "border-border-light")
                        }
                      />
                      {errors.customerEmail && <p className="text-[10px] text-red-400 mt-1">⚠️ {errors.customerEmail}</p>}
                    </div>
                    <div>
                      <label htmlFor="customerPhone" className="text-xs text-text-muted block mb-1">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel" id="customerPhone" name="customerPhone" autoComplete="tel"
                        placeholder="9876543210"
                        value={form.customerPhone}
                        onChange={(e) => setForm((prev) => ({ ...prev, customerPhone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                        className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="specialRequests" className="text-xs text-text-muted block mb-1">
                      Special Requests <span className="text-text-muted/50">(optional)</span>
                    </label>
                    <textarea
                      id="specialRequests" name="specialRequests"
                      placeholder="Any dietary requirements, room preferences, etc."
                      value={form.specialRequests}
                      onChange={(e) => setForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      rows={2}
                      className="w-full bg-surface-lighter/40 border border-border-light rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Payment Section - QR + UPI + Cards */}
                <div className="mt-6 rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-accent/[0.02] p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Payment</h2>
                      <p className="text-xs text-text-muted">Scan QR or pay via UPI / Cards / Net Banking</p>
                    </div>
                  </div>

                  {/* QR Code + UPI ID Side by Side */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-surface-lighter/30 border-2 border-dashed border-green-500/30 rounded-xl p-6">
                    {/* QR Code */}
                    <div className="shrink-0 bg-white rounded-xl p-2 shadow-sm">
                      <img
                        src={"https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent("upi://pay?pa=" + UPI_ID + "&pn=TravelLog&am=" + total + "&cu=INR&tn=Booking%20-%20" + encodeURIComponent(tour.name))}
                        alt="Scan to pay via UPI"
                        className="w-40 h-40 sm:w-44 sm:h-44 rounded-lg"
                      />
                    </div>

                    {/* UPI Details */}
                    <div className="flex-1 text-center sm:text-left space-y-3">
                      <div>
                        <p className="text-xs text-text-muted mb-1">Scan QR with any UPI app</p>
                        <p className="text-lg font-bold text-green-400 break-all">{UPI_ID}</p>
                      </div>
                      <div className="text-sm font-medium">
                        Amount: <span className="text-accent text-xl font-bold">₹{total.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Button
                          variant="secondary" className="gap-1.5 text-xs h-9"
                          onClick={() => {
                            navigator.clipboard.writeText(UPI_ID);
                            showToast("UPI ID copied! 📋", "success");
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Copy UPI ID
                        </Button>
                        <Button
                          className="gap-1.5 text-xs h-9 bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => {
                            const upiUrl = "upi://pay?pa=" + UPI_ID + "&pn=TravelLog&am=" + total + "&cu=INR&tn=Booking%20-%20" + encodeURIComponent(tour.name);
                            window.open(upiUrl, "_blank");
                            handlePay();
                          }}
                        >
                          <Smartphone className="w-3.5 h-3.5" /> Pay ₹{total.toLocaleString()}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Display */}
                  <div>
                    <p className="text-xs text-text-muted text-center mb-3">Accepted payment methods:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "UPI", sub: "GPay, PhonePe" },
                        { label: "Cards", sub: "Credit/Debit" },
                        { label: "Net Banking", sub: "All banks" },
                        { label: "Wallet", sub: "Paytm, Amazon" },
                      ].map((m) => (
                        <div key={m.label} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-surface-lighter/30 border border-border-light">
                          <span className="text-xs font-semibold text-text-primary">{m.label}</span>
                          <span className="text-[9px] text-text-muted text-center leading-tight">{m.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-text-muted text-center">
                    🔒 After paying, your booking will be confirmed instantly.
                  </p>
                </div>

                {/* Back */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors underline underline-offset-4"
                  >
                    ← Back to Traveler Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-light bg-surface-lighter/20 overflow-hidden">
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
                    <span className="text-text-muted">Base price (×{form.travelers})</span>
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
                      <span className="flex items-center gap-1 font-medium">
                        <BadgePercent className="w-3 h-3" /> {appliedOffer?.code}
                      </span>
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

                {/* Coupon Code */}
                <div className="border-t border-border-light px-5 py-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                    <BadgePercent className="w-3.5 h-3.5 text-accent" /> Coupon Code <span className="text-text-muted/50 normal-case font-normal">(optional)</span>
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
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text" id="couponCode" name="couponCode" autoComplete="off"
                          placeholder="Enter code"
                          value={offerInput}
                          onChange={(e) => { setOfferInput(e.target.value.toUpperCase()); setOfferError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyOffer()}
                          className="flex-1 bg-surface-lighter/40 border border-border-light rounded-xl px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors uppercase"
                        />
                        <Button
                          variant="secondary" size="sm" className="gap-1"
                          onClick={handleApplyOffer}
                          disabled={offerLoading || !offerInput.trim()}
                        >
                          {offerLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ticket className="w-3 h-3" />} Apply
                        </Button>
                      </div>
                      {offerError && <p className="text-xs text-red-400 mt-1">{offerError}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {offerCodes.slice(0, 4).map((offer) => (
                          <button
                            key={offer.code}
                            onClick={() => { setOfferInput(offer.code); setOfferError(""); }}
                            className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                          >
                            {offer.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
