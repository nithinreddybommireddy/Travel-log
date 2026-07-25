import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark, Layout, MapPin, Star, Calendar, Users, ArrowRight,
  Compass, Sparkles, Plus, TicketCheck, Clock, Tag, Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tours } from "@/features/tours/data/tours";
import { useAuth } from "@/features/auth/services/auth-context";
import { useSavedTours, useMoodBoards, useTripPlans } from "@/services/storage-service";
import { getEmailHistory } from "@/services/email-service";

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

function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem("travellog_bookings");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function DashboardPage() {
  const { user } = useAuth();
  const { savedTours } = useSavedTours(user?.id);
  const { boards } = useMoodBoards(user?.id);
  const { plans } = useTripPlans(user?.id);
  const [bookings] = useState<Booking[]>(getBookings);
  const [emailHistory] = useState(() => getEmailHistory());

  const savedTourIds = savedTours.map((st) => st.tourId);
  const savedToursList = tours.filter((t) => savedTourIds.includes(t.id));

  const plannedTours = plans.map((tp) => ({
    ...tp,
    tour: tours.find((t) => t.id === tp.tourId),
  }));

  const preferredDifficulty = savedToursList.length > 0
    ? savedToursList.reduce((acc, t) => {
        const count = savedToursList.filter((st) => st.difficulty === t.difficulty).length;
        return count > (acc.count || 0) ? { difficulty: t.difficulty, count } : acc;
      }, {} as { difficulty: string; count: number })
    : null;

  const recommendations = tours
    .filter((t) => !savedTourIds.includes(t.id))
    .filter((t) => !preferredDifficulty || t.difficulty === preferredDifficulty.difficulty)
    .slice(0, 3);

  const totalSpent = bookings.reduce((sum, b) => sum + b.totalPaid, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge variant="accent" className="mb-3">Dashboard</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : " to TravelLog"}!
          </h1>
          <p className="text-text-secondary text-lg">Your travel planning hub. Plan your next adventure.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { icon: Bookmark, label: "Saved Tours", value: savedToursList.length, color: "#3b82f6" },
            { icon: Layout, label: "Mood Boards", value: boards.length, color: "#8b5cf6" },
            { icon: Calendar, label: "Trip Plans", value: plans.length, color: "#10b981" },
            { icon: TicketCheck, label: "Bookings", value: bookings.length, color: "#f59e0b" },
            { icon: Star, label: "Destinations", value: tours.length, color: "#ec4899" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-light/30 rounded-xl border border-border-light p-4 sm:p-5 hover:border-accent/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Booking History Section */}
        {bookings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TicketCheck className="w-5 h-5 text-accent" /> Booking History
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-text-muted">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</span>
                <span className="text-accent font-semibold">₹{totalSpent.toLocaleString()} total</span>
              </div>
            </div>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking, i) => {
                const tour = tours.find((t) => t.id === booking.tourId);
                const bookingDate = new Date(booking.bookedAt).toLocaleDateString("en-IN", {
                  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                });
                return (
                  <motion.div key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-surface-light/20 rounded-xl border border-border-light overflow-hidden hover:border-accent/30 transition-all duration-300"
                  >
                    <Link to={`/booking/${booking.id}`} className="flex items-center gap-4 p-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0">
                        <img src={tour?.image || ""} alt={booking.tourName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{booking.tourName}</h3>
                          <Badge variant={booking.status === "confirmed" ? "success" : "default"}
                            className="text-[10px] capitalize">
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap text-xs text-text-muted mt-1.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {booking.startDate}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.travelers} traveler{booking.travelers > 1 ? "s" : ""}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bookingDate}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-sm font-bold text-accent">₹{booking.totalPaid.toLocaleString()}</span>
                          {booking.discount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-0.5">
                              <Tag className="w-2.5 h-2.5" /> Saved ₹{booking.discount.toLocaleString()}
                            </span>
                          )}
                          {booking.coupon && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                              {booking.coupon}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              {bookings.length > 5 && (
                <div className="text-center pt-2">
                  <span className="text-sm text-text-muted">+{bookings.length - 5} more bookings</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Saved Tours & Mood Boards */}
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2"><Bookmark className="w-5 h-5 text-accent" /> Saved Tours</h2>
              <Link to="/tours"><Button variant="ghost" size="sm" className="gap-1">Explore <ArrowRight className="w-3 h-3" /></Button></Link>
            </div>
            {savedToursList.length === 0 ? (
              <div className="bg-surface-light/20 rounded-xl border border-border-light p-8 text-center">
                <Bookmark className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No saved tours yet</h3>
                <p className="text-sm text-text-secondary mb-4">Start exploring and save tours you love</p>
                <Link to="/tours"><Button variant="accent" size="sm">Browse Tours</Button></Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedToursList.slice(0, 4).map((tour) => (
                  <Link key={tour.id} to={`/tours/${tour.id}`}>
                    <div className="group bg-surface-light/20 rounded-xl border border-border-light overflow-hidden hover:border-accent/30 transition-all duration-300">
                      <div className="relative h-32 overflow-hidden">
                        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3"><span className="text-sm font-bold text-accent">₹{tour.price.toLocaleString()}</span></div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold group-hover:text-accent transition-colors">{tour.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                          <MapPin className="w-3 h-3" /> {tour.location}
                          <span className="flex items-center gap-1 ml-auto"><Star className="w-3 h-3 text-accent fill-accent" /> {tour.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {savedToursList.length > 4 && (
                  <Link to="/tours" className="flex items-center justify-center bg-surface-light/20 rounded-xl border border-border-light border-dashed hover:border-accent/30 transition-all duration-300 p-4">
                    <span className="text-sm text-text-secondary">+{savedToursList.length - 4} more</span>
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2"><Layout className="w-5 h-5 text-accent" /> Mood Boards</h2>
              <Link to="/mood-boards"><Button variant="ghost" size="sm" className="gap-1"><Plus className="w-3 h-3" /> New</Button></Link>
            </div>
            {boards.length > 0 ? (
              <div className="space-y-3">
                {boards.map((board, i) => (
                  <Link key={board.id} to={`/mood-boards/${board.id}`}>
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-surface-light/20 border border-border-light hover:border-accent/30 transition-all duration-300">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: board.coverColor }}>
                        {board.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate group-hover:text-accent transition-colors">{board.name}</div>
                        {board.description && <div className="text-xs text-text-muted truncate">{board.description}</div>}
                      </div>
                      <div className="text-xs text-text-muted">{board.isPublic ? "Public" : "Private"}</div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-surface-light/20 rounded-xl border border-border-light p-8 text-center">
                <Layout className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Create a mood board</h3>
                <p className="text-sm text-text-secondary mb-4">Collect and organize your dream trips</p>
                <Link to="/mood-boards"><Button variant="outline" size="sm" className="gap-1"><Plus className="w-3 h-3" /> Create Board</Button></Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Trip Plans & Recommendations */}
        {/* Email History */}
        {emailHistory.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="mb-10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
              <Mail className="w-5 h-5 text-accent" /> Email Activity
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {emailHistory.slice(0, 6).map((email) => {
                const sentDate = new Date(email.sentAt).toLocaleDateString("en-IN", {
                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                });
                const typeConfig = {
                  "booking-confirmation": { label: "Booking Confirmation", color: "#22c55e", bgColor: "#22c55e10" },
                  "contact": { label: "Contact Inquiry", color: "#3b82f6", bgColor: "#3b82f610" },
                  "newsletter": { label: "Newsletter", color: "#f59e0b", bgColor: "#f59e0b10" },
                };
                const config = typeConfig[email.type];
                return (
                  <div key={email.id}
                    className="bg-surface-light/20 rounded-xl border border-border-light p-4 hover:border-accent/20 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-3.5 h-3.5" style={{ color: config.color }} />
                      <span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span>
                    </div>
                    <div className="text-xs text-text-secondary truncate mb-1" title={email.subject}>
                      {email.subject}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>{email.recipient}</span>
                      <span>{sentDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-5"><Calendar className="w-5 h-5 text-accent" /> Trip Plans</h2>
            {plannedTours.length === 0 ? (
              <div className="bg-surface-light/20 rounded-xl border border-border-light p-6 text-center">
                <Calendar className="w-10 h-10 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-secondary">No trips planned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {plannedTours.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-xl bg-surface-light/20 border border-border-light">
                    <div className="font-semibold">{plan.tour?.name || "Unknown tour"}</div>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {plan.travelers} travelers</span>
                      <Badge variant={plan.status === "booked" ? "success" : plan.status === "planning" ? "warning" : "default"}>{plan.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-5"><Sparkles className="w-5 h-5 text-accent" /> Personalized Recommendations</h2>
            {recommendations.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {recommendations.map((tour) => (
                  <Link key={tour.id} to={`/tours/${tour.id}`}>
                    <div className="group bg-surface-light/20 rounded-xl border border-border-light overflow-hidden hover:border-accent/30 transition-all duration-300 h-full">
                      <div className="relative h-28 overflow-hidden">
                        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{tour.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-text-muted mt-1"><MapPin className="w-3 h-3" /> {tour.location}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-accent">₹{tour.price.toLocaleString()}</span>
                          <span className="text-xs flex items-center gap-1"><Star className="w-3 h-3 text-accent fill-accent" /> {tour.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-surface-light/20 rounded-xl border border-border-light p-8 text-center">
                <Compass className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary">Save some tours to get personalized recommendations</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Compare CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10">
          <Link to="/compare">
            <div className="group relative bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl border border-border-light p-8 overflow-hidden hover:border-accent/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1"><span className="text-gradient">Compare Destinations</span></h2>
                  <p className="text-text-secondary">Side-by-side comparison to find your perfect trip</p>
                </div>
                <Button variant="accent" className="gap-2 shrink-0">Compare Now <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
