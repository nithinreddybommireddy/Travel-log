import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Menu, X, LogOut, MapPin, LayoutDashboard,
  Layout, BarChart3, User, Search, ArrowRight, Command,
  Clock, Tag, Star, Flame, IndianRupee, ArrowUpDown,
  Sun, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/services/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { tours, type Tour } from "@/features/tours/data/tours";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Compare", href: "/compare" },
];

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mood Boards", href: "/mood-boards", icon: Layout },
  { label: "Compare", href: "/compare", icon: BarChart3 },
];

const RECENT_SEARCHES_KEY = "travellog_recent_searches";
const MAX_RECENT = 6;

interface RecentSearch {
  query: string;
  tourId: string;
  tourName: string;
  tourImage?: string;
  timestamp: number;
}

function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addRecentSearch(search: RecentSearch) {
  const recent = getRecentSearches().filter((s) => s.tourId !== search.tourId);
  recent.unshift(search);
  if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type PriceRange = "budget" | "mid" | "premium" | "luxury";

const priceRanges: { key: PriceRange; label: string; min: number; max?: number }[] = [
  { key: "budget", label: "Under ₹20K", min: 0, max: 20000 },
  { key: "mid", label: "₹20K–₹40K", min: 20000, max: 40000 },
  { key: "premium", label: "₹40K–₹70K", min: 40000, max: 70000 },
  { key: "luxury", label: "₹70K+", min: 70000 },
];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tour[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(getRecentSearches());
  const [priceFilter, setPriceFilter] = useState<PriceRange | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trendingTours = useMemo(() => {
    return [...tours].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  }, []);

  const priceRangeCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return priceRanges.map((range) => {
      const count = tours.filter((tour) => {
        const matchesText = !q ||
          tour.name.toLowerCase().includes(q) ||
          tour.location.toLowerCase().includes(q) ||
          tour.subtitle.toLowerCase().includes(q) ||
          tour.description.toLowerCase().includes(q) ||
          tour.category.toLowerCase().includes(q);
        const matchesPrice =
          tour.price >= range.min && (range.max ? tour.price < range.max : true);
        return matchesText && matchesPrice;
      }).length;
      return { key: range.key, count };
    });
  }, [query]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!query.trim() && !priceFilter) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const q = query.toLowerCase().trim();
    const range = priceRanges.find((r) => r.key === priceFilter);
    const filtered = tours.filter((tour) => {
      const matchesText = !q ||
        tour.name.toLowerCase().includes(q) ||
        tour.location.toLowerCase().includes(q) ||
        tour.subtitle.toLowerCase().includes(q) ||
        tour.description.toLowerCase().includes(q) ||
        tour.category.toLowerCase().includes(q);
      const matchesPrice = !range ||
        (tour.price >= range.min && (range.max ? tour.price < range.max : true));
      return matchesText && matchesPrice;
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });
    setResults(sorted.slice(0, 8));
    setSelectedIndex(0);
  }, [query, priceFilter, sortOrder]);

  const handleSelect = (id: string) => {
    const tour = tours.find((t) => t.id === id);
    if (tour) {
      addRecentSearch({
        query: query.trim() || tour.name,
        tourId: tour.id,
        tourName: tour.name,
        tourImage: tour.image,
        timestamp: Date.now(),
      });
    }
    onClose();
    navigate(`/tours/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex].id);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[60]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-xl mx-auto px-4"
      >
        <div className="bg-surface-light border border-border-light rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border-light">
            <Search className="w-5 h-5 text-text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search destinations, locations, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-base"
            />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-light font-mono">ESC</kbd>
              <span>to close</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range Filters & Sort */}
          {query.trim() && (
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
              {priceRanges.map((range, i) => {
                const active = priceFilter === range.key;
                const count = priceRangeCounts[i]?.count ?? 0;
                return (
                  <button
                    key={range.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriceFilter(active ? null : range.key);
                      setSortOrder(null);
                    }}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-150",
                      active
                        ? "bg-accent text-white shadow-sm shadow-accent/20"
                        : "bg-surface text-text-muted hover:text-text-primary hover:bg-surface-lighter border border-border-light/50"
                    )}
                  >
                    <IndianRupee className={cn("w-3 h-3", active && "text-white/80")} />
                    <span>{range.label}</span>
                    <span className={cn(
                      "ml-0.5 text-[10px] font-semibold",
                      active ? "text-white/70" : "text-text-muted/50"
                    )}>
                      ({count})
                    </span>
                    {active && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}

              <div className="w-px h-5 bg-border-light mx-1 shrink-0" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (sortOrder === "asc") {
                    setSortOrder("desc");
                  } else if (sortOrder === "desc") {
                    setSortOrder(null);
                    setPriceFilter(null);
                  } else {
                    setSortOrder("asc");
                    setPriceFilter(null);
                  }
                }}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-150",
                  sortOrder
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "bg-surface text-text-muted hover:text-text-primary hover:bg-surface-lighter border border-border-light/50"
                )}
              >
                <ArrowUpDown className="w-3 h-3" />
                {sortOrder === "asc" && "Lowest Price"}
                {sortOrder === "desc" && "Highest Price"}
                {!sortOrder && "Sort by Price"}
                {sortOrder && <X className="w-3 h-3 ml-1" />}
              </button>
            </div>
          )}

          {/* Results */}
          {query.trim() && (
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Destinations ({results.length})
                  </p>
                  {results.map((tour, index) => (
                    <button
                      key={tour.id}
                      onClick={() => handleSelect(tour.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left",
                        index === selectedIndex
                          ? "bg-accent/10 text-accent"
                          : "text-text-secondary hover:bg-surface-lighter hover:text-text-primary"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {tour.name}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Star className={cn(
                              "w-3 h-3",
                              index === selectedIndex ? "text-accent" : "text-amber-400"
                            )} />
                            <span className={cn(
                              "text-xs font-semibold",
                              index === selectedIndex ? "text-accent" : "text-text-muted"
                            )}>
                              {tour.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{tour.location}</span>
                          <span className="text-accent font-medium">₹{tour.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <ArrowRight className={cn(
                        "w-4 h-4 shrink-0 transition-all duration-200",
                        index === selectedIndex
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2"
                      )} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <Search className="w-8 h-8 text-text-muted/50 mx-auto mb-3" />
                  <p className="text-text-muted text-sm">No destinations found for "{query}"</p>
                  <p className="text-text-muted/60 text-xs mt-1">Try searching for a different location or category</p>
                </div>
              )}
            </div>
          )}

          {/* Empty state - Trending, Recent & Categories */}
          {!query.trim() && (
            <div className="">
              {/* Trending Destinations */}
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-accent" /> Trending Now
                  </p>
                  <Link
                    to="/tours"
                    onClick={onClose}
                    className="text-[11px] text-accent hover:text-accent/80 transition-colors font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none snap-x snap-mandatory">
                  {trendingTours.map((tour) => (
                    <button
                      key={tour.id}
                      onClick={() => handleSelect(tour.id)}
                      className="snap-start shrink-0 w-40 group text-left"
                    >
                      <div className="relative rounded-xl overflow-hidden mb-2 aspect-[4/3]">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-semibold truncate drop-shadow-lg">
                            {tour.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] text-white/90 font-medium">{tour.rating}</span>
                            <span className="text-[10px] text-white/60">({tour.reviews})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-muted truncate flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0" /> {tour.location.split(",")[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 my-1 border-t border-border-light" />

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="px-5 pt-3 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent
                    </p>
                    <button
                      onClick={() => { clearRecentSearches(); setRecentSearches([]); }}
                      className="text-[11px] text-text-muted hover:text-error transition-colors font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((item, index) => (
                      <button
                        key={`${item.tourId}-${item.timestamp}`}
                        onClick={() => handleSelect(item.tourId)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-left group",
                          "text-text-secondary hover:bg-surface-lighter hover:text-text-primary"
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-border-light/50">
                          <img
                            src={item.tourImage || ""}
                            alt={item.tourName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{item.tourName}</span>
                        </div>
                        <span className="text-[11px] text-text-muted/60 shrink-0 group-hover:hidden">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 hidden group-hover:block" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {recentSearches.length > 0 && (
                <div className="mx-5 border-t border-border-light" />
              )}

              {/* Category Quick Filters */}
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Browse by Category
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Beach", "Adventure", "Hill Station", "Cultural", "Romantic", "Wildlife"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setQuery(cat)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-text-secondary bg-surface hover:bg-surface-lighter hover:text-text-primary transition-all border border-border-light/50"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-text-muted/60 mt-4">
                  Tip: Press{" "}
                  <kbd className="px-1 py-0.5 rounded bg-surface border border-border-light font-mono">
                    <Command className="w-3 h-3 inline -mt-0.5" />K
                  </kbd>{" "}
                  to open search from anywhere
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
  }, [location]);

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-surface/80 backdrop-blur-xl border-b border-border-light/50 shadow-lg shadow-black/10"
            : isLanding
              ? "bg-transparent"
              : "bg-surface/60 backdrop-blur-md border-b border-border-light/30"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Compass className="w-7 h-7 text-accent transition-transform duration-300 group-hover:rotate-45" />
                <div className="absolute -inset-1 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                Travel<span className="text-accent">Log</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-lighter/50 border border-border-light/50 text-text-muted hover:text-text-primary hover:border-border-light hover:bg-surface-lighter transition-all duration-200 group"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="text-sm flex-1 text-left">Search destinations...</span>
                <div className="flex items-center gap-1 text-[11px] text-text-muted/60">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-light font-mono">
                    <Command className="w-3 h-3 inline -mt-0.5" />
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-light font-mono">K</kbd>
                </div>
              </button>
            </div>

            {/* Theme Toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Sun className={cn(
                "w-[18px] h-[18px] absolute transition-all duration-300",
                theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
              )} />
              <Moon className={cn(
                "w-[18px] h-[18px] absolute transition-all duration-300",
                theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
              )} />
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === link.href
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-lighter/50"
                  )}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3 ml-4">
              {isAuthenticated ? (
                <>
                  <Link to="/tours">
                    <Button variant="outline" size="sm" className="gap-2">
                      <MapPin className="w-4 h-4" /> Explore
                    </Button>
                  </Link>
                  <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-lighter transition-all">
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium">{user?.name?.split(" ")[0] || "User"}</span>
                    </button>
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-surface-light border border-border-light rounded-xl shadow-xl overflow-hidden">
                          <div className="p-2 space-y-1">
                            {dashboardLinks.map((link) => {
                              const Icon = link.icon;
                              return (
                                <Link key={link.href} to={link.href}
                                  className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    location.pathname === link.href
                                      ? "text-accent bg-accent/10"
                                      : "text-text-secondary hover:text-text-primary hover:bg-surface-lighter"
                                  )}>
                                  <Icon className="w-4 h-4" /> {link.label}
                                </Link>
                              );
                            })}
                          </div>
                          <div className="border-t border-border-light p-2">
                            <button onClick={() => signOut()}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-error hover:bg-error/10 w-full transition-all">
                              <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/auth"><Button variant="ghost" size="sm">Sign In</Button></Link>
                  <Link to="/auth"><Button variant="accent" size="sm">Get Started</Button></Link>
                </>
              )}
            </div>

            {/* Mobile right */}
            <div className="flex items-center gap-1 md:hidden">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Sun className={cn(
                  "w-[18px] h-[18px] absolute transition-all duration-300",
                  theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                )} />
                <Moon className={cn(
                  "w-[18px] h-[18px] absolute transition-all duration-300",
                  theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                )} />
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-lighter transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-lighter transition-all">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-border-light">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.label} to={link.href}
                    className={cn("block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      location.pathname === link.href
                        ? "text-accent bg-accent/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-lighter"
                    )}>
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <>
                    <div className="border-t border-border-light my-2" />
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-2">Planning Tools</div>
                    {dashboardLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link key={link.href} to={link.href}
                          className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                            location.pathname === link.href
                              ? "text-accent bg-accent/10"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-lighter"
                          )}>
                          <Icon className="w-4 h-4" /> {link.label}
                        </Link>
                      );
                    })}
                  </>
                )}
                <div className="border-t border-border-light pt-3 mt-3 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link to="/tours"><Button variant="outline" className="w-full gap-2"><MapPin className="w-4 h-4" /> Explore Tours</Button></Link>
                      <Button variant="ghost" className="w-full text-error" onClick={() => signOut()}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth"><Button variant="ghost" className="w-full">Sign In</Button></Link>
                      <Link to="/auth"><Button variant="accent" className="w-full">Get Started</Button></Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
