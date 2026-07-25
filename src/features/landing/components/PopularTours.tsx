import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Star, ArrowRight, ArrowLeft, Flame, Sparkles, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { tours, getPriceTierInfo, type PriceTier } from "@/features/tours/data/tours";
import { useRef, useState } from "react";
import { cn } from "@/utils/cn";

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "danger",
} as const;

const priceBadgeIcons: Record<PriceTier, typeof Flame> = {
  budget: Flame,
  "mid-range": Sparkles,
  premium: Crown,
};

export function PopularTours() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="tours" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-light/50 to-surface pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="accent" className="mb-4">Popular Destinations</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Most Popular{" "}
            <span className="text-gradient">Tours</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Hand-picked destinations loved by our travelers. Each experience is crafted
            to give you the adventure of a lifetime.
          </p>
        </motion.div>

        {/* Scroll Controls */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "p-2 rounded-lg border border-border-light transition-all duration-200",
              canScrollLeft
                ? "text-text-primary hover:bg-surface-lighter hover:border-primary/30"
                : "text-text-muted opacity-40 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "p-2 rounded-lg border border-border-light transition-all duration-200",
              canScrollRight
                ? "text-text-primary hover:bg-surface-lighter hover:border-primary/30"
                : "text-text-muted opacity-40 cursor-not-allowed"
            )}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tours.map((tour, index) => {
            const tierInfo = getPriceTierInfo(tour.price);
            const PriceIcon = priceBadgeIcons[tierInfo.id];
            return (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex-shrink-0 w-[350px] snap-start"
            >
              <Link to={`/tours/${tour.id}`}>
                <div className="group relative bg-surface-light/30 rounded-2xl border border-border-light overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />

                    {/* Difficulty Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant={difficultyColors[tour.difficulty]}>
                        {tour.difficulty}
                      </Badge>
                    </div>

                    {/* Price Tier Badge */}
                    <div className="absolute top-4 left-4 mt-8">
                      <Badge variant="outline" className="text-xs px-2 py-0.5 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0"
                        style={{ color: tierInfo.color }}>
                        <PriceIcon className="w-3 h-3" style={{ color: tierInfo.color }} />
                        {tierInfo.badge}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="absolute top-4 right-4 bg-surface-light/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border-light">
                      <span className="text-sm font-bold text-accent">₹{tour.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {tour.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        {tour.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-accent" />
                        Max {tour.maxPeople}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-semibold">{tour.rating}</span>
                        <span className="text-xs text-text-muted">({tour.reviews} reviews)</span>
                      </div>
                      <span className="text-sm font-medium text-primary-light group-hover:translate-x-1 transition-transform">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
