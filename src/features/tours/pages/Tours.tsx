import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Star, Search, Heart, Flame, Sparkles, Crown, ArrowUp, ArrowDown, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { tours, categories, getPriceTierInfo, type TourCategory, type PriceTier } from "@/features/tours/data/tours";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useSavedTours } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";

const priceBadgeIcons: Record<PriceTier, typeof Flame> = {
  budget: Flame,
  "mid-range": Sparkles,
  premium: Crown,
};

export function ToursPage() {
  const { user } = useAuth();
  const { savedTours, saveTour, removeSavedTour } = useSavedTours(user?.id);
  const { showToast } = useToast();
  const savedTourIds = savedTours.map((st) => st.tourId);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TourCategory | "all">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all");
  const [sortOrder, setSortOrder] = useState<"none" | "low-to-high" | "high-to-low" | "rating">("none");

  let filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tour.category === categoryFilter;
    const matchesPrice = priceFilter === "all" || (() => {
      if (priceFilter === "budget") return tour.price < 10000;
      if (priceFilter === "mid") return tour.price >= 10000 && tour.price < 25000;
      if (priceFilter === "premium") return tour.price >= 25000;
      return true;
    })();
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sortOrder === "low-to-high") {
    filteredTours = [...filteredTours].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    filteredTours = [...filteredTours].sort((a, b) => b.price - a.price);
  } else if (sortOrder === "rating") {
    filteredTours = [...filteredTours].sort((a, b) => b.rating - a.rating);
  }

  const handleToggleSave = (e: React.MouseEvent, tourId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = savedTourIds.includes(tourId);
    if (isSaved) {
      removeSavedTour(tourId);
      showToast("Removed from saved tours", "info");
    } else {
      saveTour(tourId);
      showToast("Tour saved to your collection!", "success");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge variant="accent" className="mb-4">{tours.length} Destinations</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Explore <span className="text-gradient">Destinations</span></h1>
          <p className="text-text-secondary max-w-2xl">Discover {tours.length} stunning destinations across India and around the world. Find your perfect adventure.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input placeholder="Search destinations..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-surface-lighter/50 rounded-xl border border-border-light p-1">
              <button onClick={() => setSortOrder(sortOrder === "low-to-high" ? "none" : "low-to-high")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  sortOrder === "low-to-high"
                    ? "bg-accent/15 text-accent shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}>
                <ArrowUp className="w-3.5 h-3.5" />
                Low Price
              </button>
              <button onClick={() => setSortOrder(sortOrder === "high-to-low" ? "none" : "high-to-low")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  sortOrder === "high-to-low"
                    ? "bg-accent/15 text-accent shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}>
                <ArrowDown className="w-3.5 h-3.5" />
                High Price
              </button>
              <div className="w-px h-5 bg-border-light" />
              <button onClick={() => setSortOrder(sortOrder === "rating" ? "none" : "rating")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  sortOrder === "rating"
                    ? "bg-amber/15 text-amber shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}>
                <Trophy className="w-3.5 h-3.5" />
                Top Rated
              </button>
              {sortOrder !== "none" && (
                <button onClick={() => setSortOrder("none")}
                  className="px-2 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary transition-all duration-200">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                categoryFilter === "all"
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-surface-lighter/50 text-text-secondary border border-border-light hover:border-accent/20 hover:text-text-primary"
              }`}>All</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  categoryFilter === cat.id
                    ? "text-white border"
                    : "bg-surface-lighter/50 text-text-secondary border border-border-light hover:border-accent/20 hover:text-text-primary"
                }`}
                style={categoryFilter === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Price Range Filters */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setPriceFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                priceFilter === "all"
                  ? "bg-surface-lighter text-text-primary border border-border-light"
                  : "text-text-muted hover:text-text-secondary border border-transparent"
              }`}>
              All Prices
            </button>
            <button onClick={() => setPriceFilter("budget")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                priceFilter === "budget"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-sm"
                  : "text-text-muted hover:text-text-secondary border border-transparent bg-surface-lighter/30"
              }`}>
              <span className="text-xs">₹</span>
              Under ₹10K
            </button>
            <button onClick={() => setPriceFilter("mid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                priceFilter === "mid"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                  : "text-text-muted hover:text-text-secondary border border-transparent bg-surface-lighter/30"
              }`}>
              <span className="text-xs">₹₹</span>
              ₹10K – ₹25K
            </button>
            <button onClick={() => setPriceFilter("premium")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                priceFilter === "premium"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm"
                  : "text-text-muted hover:text-text-secondary border border-transparent bg-surface-lighter/30"
              }`}>
              <span className="text-xs">₹₹₹</span>
              ₹25K+
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredTours.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <MapPin className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tours found</h3>
            <p className="text-text-secondary">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => {
              const tierInfo = getPriceTierInfo(tour.price);
              const PriceIcon = priceBadgeIcons[tierInfo.id];
              return (
              <motion.div key={tour.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, duration: 0.5 }}>
                <Link to={`/tours/${tour.id}`} className="block group relative bg-surface-light/30 rounded-2xl border border-border-light overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="outline" className="text-xs px-2.5 py-1 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0"
                        style={{ color: tierInfo.color }}>
                        <PriceIcon className="w-3 h-3" style={{ color: tierInfo.color }} />
                        {tierInfo.badge}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-surface-light/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border-light">
                      <span className="text-sm font-bold text-accent">₹{tour.price.toLocaleString()}</span>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm"
                        style={{ backgroundColor: `${categories.find(c => c.id === tour.category)?.color}40` }}>
                        {categories.find(c => c.id === tour.category)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">{tour.name}</h3>
                    <p className="text-xs text-text-muted mb-3">{tour.subtitle}</p>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{tour.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" /> {tour.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> {tour.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-accent" /> Max {tour.maxPeople}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-semibold">{tour.rating}</span>
                        <span className="text-xs text-text-muted">({tour.reviews})</span>
                      </div>
                      <span className="text-sm font-medium text-primary-light group-hover:translate-x-1 transition-transform">View Details →</span>
                    </div>
                  </div>
                  <button onClick={(e) => handleToggleSave(e, tour.id)}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 z-10 ${
                      savedTourIds.includes(tour.id)
                        ? "bg-accent/20 text-accent"
                        : "bg-surface-light/80 text-text-secondary hover:text-accent opacity-0 group-hover:opacity-100"
                    }`}>
                    <Heart className={`w-4 h-4 ${savedTourIds.includes(tour.id) ? "fill-accent" : ""}`} />
                  </button>
                </Link>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
