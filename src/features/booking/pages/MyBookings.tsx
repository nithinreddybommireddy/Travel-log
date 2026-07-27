import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TicketCheck, Calendar, Users, MapPin, Star, Clock,
  ArrowRight, Search, X, Tag, Filter, ArrowUpDown,
  Trash2, AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tours } from "@/features/tours/data/tours";


interface TravelerInfo {
  name: string;
  age: string;
  phone: string;
}

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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  travelerDetails?: TravelerInfo[];
}

function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem("travellog_bookings");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function deleteBooking(id: string): void {
  try {
    const bookings = getBookings().filter((b) => b.id !== id);
    localStorage.setItem("travellog_bookings", JSON.stringify(bookings));
  } catch { /* ignore */ }
}

export function MyBookingsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const bookings = useMemo(() => getBookings(), [refreshKey]);

  const totalSpent = bookings.reduce((sum, b) => sum + b.totalPaid, 0);
  const activeBookings = bookings.filter((b) => b.status === "confirmed").length;

  const statuses = useMemo(() => {
    const set = new Set(bookings.map((b) => b.status));
    return Array.from(set);
  }, [bookings]);

  const filtered = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.tourName.toLowerCase().includes(q) ||
          b.tourName.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.startDate.toLowerCase().includes(q) ||
          (b.customerName && b.customerName.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case "newest": return b.bookedAt - a.bookedAt;
        case "oldest": return a.bookedAt - b.bookedAt;
        case "highest": return b.totalPaid - a.totalPaid;
        case "lowest": return a.totalPaid - b.totalPaid;
        default: return 0;
      }
    });

    return result;
  }, [bookings, searchQuery, statusFilter, sortOrder]);

  const handleDelete = (id: string, tourName: string) => {
    if (window.confirm(`Cancel booking for ${tourName}? This action cannot be undone.`)) {
      deleteBooking(id);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Badge variant="accent" className="mb-3">My Bookings</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Your Trips</h1>
          <p className="text-text-secondary text-lg">
            Manage all your confirmed tours and past adventures.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: TicketCheck, label: "Total Bookings", value: bookings.length, color: "#f59e0b" },
            { icon: Calendar, label: "Active", value: activeBookings, color: "#22c55e" },
            { icon: Users, label: "Total Travelers", value: bookings.reduce((s, b) => s + b.travelers, 0), color: "#3b82f6" },
            { icon: Star, label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "#ec4899" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-surface-light/30 rounded-xl border border-border-light p-4 sm:p-5 hover:border-accent/20 transition-all duration-300"
            >
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

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by tour name, booking ID, or traveler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-lighter/30 border border-border-light rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="appearance-none bg-surface-lighter/30 border border-border-light rounded-xl px-4 py-2.5 pr-8 text-sm outline-none focus:border-accent/50 transition-colors cursor-pointer"
              >
                <option value="">All Status</option>
                {statuses.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="appearance-none bg-surface-lighter/30 border border-border-light rounded-xl px-4 py-2.5 pr-8 text-sm outline-none focus:border-accent/50 transition-colors cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest ₹</option>
                <option value="lowest">Lowest ₹</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-light/20 rounded-2xl border border-border-light p-12 text-center"
          >
            <AlertCircle className="w-14 h-14 text-text-muted mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {searchQuery || statusFilter ? "No matching bookings found" : "No bookings yet"}
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't booked any tours yet. Start exploring and book your next adventure!"}
            </p>
            {!searchQuery && !statusFilter && (
              <Button onClick={() => navigate("/tours")}>
                Browse Tours
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking, i) => {
              const tour = tours.find((t) => t.id === booking.tourId);
              const bookingDate = new Date(booking.bookedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group bg-surface-light/20 rounded-xl border border-border-light overflow-hidden hover:border-accent/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 p-4 sm:p-5">
                    {/* Tour Image */}
                    <Link
                      to={`/booking/${booking.id}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 block"
                    >
                      <img
                        src={tour?.image || ""}
                        alt={booking.tourName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Info */}
                    <Link
                      to={`/booking/${booking.id}`}
                      className="flex-1 min-w-0 block"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">
                          {booking.tourName}
                        </h3>
                        <Badge
                          variant={booking.status === "confirmed" ? "success" : "default"}
                          className="text-[10px] capitalize"
                        >
                          {booking.status}
                        </Badge>
                        {booking.coupon && (
                          <Badge variant="outline" className="text-[10px] text-accent border-accent/30">
                            <Tag className="w-2.5 h-2.5 mr-0.5" />
                            {booking.coupon}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap text-xs text-text-muted mt-1.5">
                        {tour && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {tour.location.split(",")[0]}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {booking.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {booking.travelers} traveler{booking.travelers > 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {bookingDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold text-accent">
                          ₹{booking.totalPaid.toLocaleString()}
                        </span>
                        {booking.discount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-0.5">
                            <Tag className="w-2.5 h-2.5" /> Saved ₹{booking.discount.toLocaleString()}
                          </span>
                        )}
                        {booking.customerName && (
                          <span className="text-[10px] text-text-muted">
                            · {booking.customerName}
                          </span>
                        )}
                      </div>
                      {booking.travelerDetails && booking.travelerDetails.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {booking.travelerDetails.map((t, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-lighter/40 border border-border-light text-text-muted">
                              {t.name || `T${i + 1}`}{t.age ? ` (${t.age})` : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>

                    {/* Actions */}
                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 text-text-muted hover:text-error hover:bg-error/10"
                        onClick={() => handleDelete(booking.id, booking.tourName)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Link to={`/booking/${booking.id}`}>
                        <Button variant="ghost" size="icon" className="w-9 h-9">
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-text-muted mb-4">
              Showing {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </p>
            <Button variant="outline" onClick={() => navigate("/tours")}>
              Book Another Tour
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
