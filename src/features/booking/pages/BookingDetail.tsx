import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, Users, Star, MapPin, Clock, Shield, Sun,
  CheckCircle2, TicketCheck, Tag, ArrowRight, Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TourMap } from "@/components/ui/tour-map";
import { ShortTripsSection } from "@/components/ui/short-trips-section";
import { tours } from "@/features/tours/data/tours";
import { downloadItinerary } from "@/utils/downloadItinerary";

interface Booking {
  id: string;
  tourId: string;
  tourName: string;
  travelers: number;
  startDate: string;
  totalPaid: number;
  discount: number;
  coupon: string | null;
  bookedAt: number;
  status: string;
}

function getBookingById(bookingId: string): Booking | null {
  try {
    const raw = localStorage.getItem("travellog_bookings");
    if (!raw) return null;
    const bookings: Booking[] = JSON.parse(raw);
    return bookings.find((b) => b.id === bookingId) || null;
  } catch {
    return null;
  }
}

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking] = useState<Booking | null>(id ? getBookingById(id) : null);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-text-secondary mb-6">This booking doesn't exist or has been removed.</p>
          <Link to="/dashboard"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const tour = tours.find((t) => t.id === booking.tourId);
  if (!tour) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Tour data not found</h1>
          <p className="text-text-secondary mb-6">The tour for this booking is no longer available.</p>
          <Link to="/dashboard"><Button variant="outline"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.bookedAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">Booking #{booking.id.slice(0, 8).toUpperCase()}</span>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface-light/20 rounded-2xl border border-border-light overflow-hidden mb-8"
        >
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <Badge variant="success" className="text-[10px] capitalize">{booking.status}</Badge>
                <Badge variant="outline" className="text-[10px]">#{booking.id.slice(0, 8).toUpperCase()}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">{tour.name}</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin className="w-4 h-4" /> {tour.location}
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent fill-accent" /> {tour.rating}</span>
              </div>
            </div>
          </div>

          {/* Booking Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-t border-border-light">
            {[
              { icon: Calendar, label: "Start Date", value: booking.startDate },
              { icon: Users, label: "Travelers", value: `${booking.travelers} traveler${booking.travelers > 1 ? "s" : ""}` },
              { icon: TicketCheck, label: "Booked On", value: bookingDate },
              { icon: Clock, label: "Amount Paid", value: `₹${booking.totalPaid.toLocaleString()}` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-text-muted">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discount/Coupon */}
          {(booking.discount > 0 || booking.coupon) && (
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <Tag className="w-4 h-4 text-green-400" />
                <div className="text-sm">
                  {booking.discount > 0 && (
                    <span className="text-green-400 font-medium">Saved ₹{booking.discount.toLocaleString()} </span>
                  )}
                  {booking.coupon && (
                    <span className="text-text-muted">with code <span className="text-accent font-medium">{booking.coupon}</span></span>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl font-bold mb-4">About This Tour</h2>
              <p className="text-text-secondary leading-relaxed">{tour.longDescription}</p>
            </motion.div>

            {/* Tour Highlights */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-xl font-bold mb-4">Tour Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-lighter/30 border border-border-light">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Full Itinerary */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Full Itinerary</h2>
                <Badge variant="accent">{tour.duration}</Badge>
              </div>
              <div className="space-y-3">
                {tour.itinerary.map((item, i) => (
                  <div key={i} className="group flex gap-4 p-4 rounded-xl bg-surface-lighter/20 border border-border-light hover:border-accent/20 transition-all duration-300">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                      {i < tour.itinerary.length - 1 && (
                        <div className="w-px flex-1 bg-border-light group-hover:bg-accent/30 transition-colors" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-accent mb-1">{item.day}</div>
                      <p className="text-sm text-text-secondary">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <TourMap lat={tour.coordinates.lat} lng={tour.coordinates.lng} name={tour.name} location={tour.location} />

            {/* Location Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5"
            >
              <h3 className="font-semibold mb-4">Location Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Duration", tour.duration],
                  ["Difficulty", tour.difficulty],
                  ["Accommodation", tour.accommodation],
                  ["Best Season", tour.bestSeason],
                  ["Languages", tour.languages.join(", ")],
                  ["Currency", tour.currency],
                  ["Nearest Airport", tour.nearestAirport],
                  ["Time Zone", tour.timeZone],
                ].map(([label, value]) => (
                  <div key={label as string}
                    className="col-span-2 sm:col-span-1 flex items-start gap-2 p-3 rounded-xl bg-surface-lighter/30 border border-border-light">
                    <div>
                      <div className="text-[10px] text-text-muted">{label}</div>
                      <div className="text-sm font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Known For */}
            <div className="flex flex-wrap gap-2">
              {tour.knownFor.map((item, i) => (
                <span key={i} className="px-3 py-1.5 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Booking Summary Card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <TicketCheck className="w-4 h-4 text-accent" /> Booking Summary
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status</span>
                    <Badge variant="success" className="text-[10px] capitalize">{booking.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Start Date</span>
                    <span className="font-medium">{booking.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Travelers</span>
                    <span className="font-medium">{booking.travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Booked on</span>
                    <span className="font-medium">{bookingDate}</span>
                  </div>
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-₹{booking.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border-light">
                    <span className="font-semibold">Total Paid</span>
                    <span className="font-bold text-accent text-lg">₹{booking.totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button className="w-full gap-2" onClick={() => navigate(`/checkout/${tour.id}?travelers=${booking.travelers}`)}>
                  <TicketCheck className="w-4 h-4" /> Quick Rebook ({booking.travelers} traveler{booking.travelers > 1 ? "s" : ""}) <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => downloadItinerary(booking, tour)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download Itinerary
                </Button>
                <Button variant="ghost" className="w-full gap-2" onClick={() => navigate(`/tours/${tour.id}`)}>
                  <Compass className="w-4 h-4" /> View Full Tour
                </Button>
              </div>

              {/* Tour Quick Info */}
              <div className="rounded-2xl border border-border-light bg-surface-lighter/20 p-5 space-y-3">
                <h3 className="font-semibold text-sm">Tour Info</h3>
                {[
                  { icon: Clock, label: tour.duration },
                  { icon: Shield, label: tour.difficulty },
                  { icon: Users, label: `Max ${tour.maxPeople} people` },
                  { icon: Sun, label: tour.bestSeason },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <Icon className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-text-secondary">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Short Trips */}
      <ShortTripsSection tourId={tour.id} tourName={tour.name} />
    </div>
  );
}
