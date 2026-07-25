import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Star, MapPin, ArrowLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TourMap } from "@/components/ui/tour-map";
import { tours } from "@/features/tours/data/tours";
import { getShortTripsByTourId, shortTripCategories } from "@/features/tours/data/short-trips";

const categoryColors: Record<string, string> = {
  historical: "#8b5cf6", nature: "#22c55e", spiritual: "#f59e0b",
  adventure: "#ef4444", cultural: "#3b82f6", food: "#ec4899",
  shopping: "#06b6d4", wildlife: "#84cc16", romantic: "#f43f5e",
};

export function ShortTripsPage() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const tour = tours.find((t) => t.id === id);
  const allTrips = id ? getShortTripsByTourId(id) : [];
  const categories = shortTripCategories;

  const filteredTrips = allTrips.filter((trip) => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.landmarks.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || trip.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Destination Not Found</h1>
          <p className="text-text-secondary mb-6">This destination doesn't exist.</p>
          <Link to="/tours"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Tours</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="relative h-[30vh] sm:h-[35vh] overflow-hidden">
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Link to={`/tours/${tour.id}`}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to {tour.name}
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="accent">{allTrips.length} Experiences</Badge>
              <Badge variant="outline" className="gap-1">
                <MapPin className="w-3 h-3" /> {tour.location}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Short Trips in {tour.name}</h1>
            <p className="text-text-secondary mt-1">Quick local excursions around {tour.name}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input placeholder="Search trips, landmarks..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              categoryFilter === "all"
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-surface-lighter/50 text-text-secondary border border-border-light hover:border-accent/20"
            }`}>All</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                categoryFilter === cat.id
                  ? "text-white border"
                  : "bg-surface-lighter/50 text-text-secondary border border-border-light hover:border-accent/20"
              }`}
              style={categoryFilter === cat.id ? { backgroundColor: categoryColors[cat.id] || "#f59e0b", borderColor: categoryColors[cat.id] || "#f59e0b" } : undefined}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="mb-8">
          <TourMap lat={tour.coordinates.lat} lng={tour.coordinates.lng} name={tour.name} location={tour.location} />
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">No short trips match your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrips.map((trip, i) => {
              const catInfo = categories.find((c) => c.id === trip.category);
              const catColor = categoryColors[trip.category] || "#f59e0b";
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl overflow-hidden border border-border-light bg-surface-lighter/20 hover:bg-surface-lighter/40 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={trip.image} alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-medium text-white px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: catColor }}>
                        {catInfo?.icon} {catInfo?.label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-lg font-bold text-white drop-shadow-lg">
                        ₹{trip.price.toLocaleString()}
                      </span>
                      <div className="text-[10px] text-white/80 text-right">per person</div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">{trip.name}</h3>
                    <p className="text-sm text-text-muted line-clamp-2">{trip.description}</p>

                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {trip.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" /> {trip.rating} ({trip.reviews})
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {trip.landmarks.map((lm) => (
                        <span key={lm}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-surface-lighter/50 text-text-muted border border-border-light">
                          {lm}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1">
                      <div className="text-[11px] text-text-muted mb-1">🕐 {trip.bestTime}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
