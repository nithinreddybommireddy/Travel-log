import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getShortTripsByTourId, shortTripCategories } from "@/data/short-trips";

interface ShortTripsSectionProps {
  tourId: string;
  tourName: string;
}

export function ShortTripsSection({ tourId, tourName }: ShortTripsSectionProps) {
  const navigate = useNavigate();
  const trips = getShortTripsByTourId(tourId);

  if (trips.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Badge variant="accent" className="mb-2">Nearby Experiences</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">Short Trips in {tourName}</h2>
              <p className="text-text-secondary mt-1 text-sm">
                Quick local excursions — perfect for a day of exploration
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(`/tours/${tourId}/short-trips`)}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trips.slice(0, 4).map((trip, i) => {
            const catInfo = shortTripCategories.find((c) => c.id === trip.category);
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/tours/${tourId}/short-trips`)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-border-light bg-surface-lighter/20 hover:bg-surface-lighter/40 hover:border-accent/30 transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        {catInfo?.icon} {catInfo?.label}
                      </span>
                      <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        ₹{trip.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm group-hover:text-accent transition-colors line-clamp-1">
                    {trip.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2">{trip.description}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      {trip.rating}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {trip.landmarks.slice(0, 2).map((lm) => (
                      <span key={lm}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-surface-lighter/50 text-text-muted border border-border-light">
                        {lm}
                      </span>
                    ))}
                    {trip.landmarks.length > 2 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-lighter/50 text-text-muted">
                        +{trip.landmarks.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
