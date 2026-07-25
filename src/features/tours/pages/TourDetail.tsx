import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Users, Star, Calendar, Shield,
  CheckCircle2, ArrowLeft, Heart, Maximize2, Sun,
  Plane, Globe, DollarSign, Clock3, Mountain, Map as MapIcon, Users2,
  UtensilsCrossed, Flame, Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { TourMap } from "@/components/ui/tour-map";
import { AttractionsMap, getDirectionsUrl } from "@/components/ui/attractions-map";
import { ShortTripsSection } from "@/components/ui/short-trips-section";
import { tours, categories } from "@/features/tours/data/tours";
import { getShortTripsByTourId } from "@/features/tours/data/short-trips";
import { getFoodByTourId, foodTypes } from "@/features/tours/data/food";
import { useAuth } from "@/features/auth/services/auth-context";
import { useSavedTours, useFoodReviews } from "@/services/storage-service";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/ui/star-rating";

const difficultyConfig = {
  easy: { badge: "success" as const },
  medium: { badge: "warning" as const },
  hard: { badge: "danger" as const },
};

export function TourDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { savedTours, saveTour, removeSavedTour } = useSavedTours(user?.id);
  const { showToast } = useToast();
  const isSaved = id ? savedTours.some((st) => st.tourId === id) : false;

  const navigate = useNavigate();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Food review state
  const { addReview, getReviewsForFood, getAverageRating, getReviewCount } = useFoodReviews();
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState<string | null>(null);

  const handleAddReview = useCallback((foodId: string) => {
    if (selectedRating === 0) return;
    addReview(foodId, user?.id || "guest", user?.name || "You", selectedRating, reviewComment);
    setSelectedRating(0);
    setReviewComment("");
    setShowReviewForm(null);
    showToast("Review added!", "success");
  }, [selectedRating, reviewComment, user, addReview, showToast]);

  const tour = tours.find((t) => t.id === id);

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

  const diff = difficultyConfig[tour.difficulty];
  const categoryInfo = categories.find((c) => c.id === tour.category);

  const handleToggleSave = () => {
    if (!id) return;
    if (isSaved) {
      removeSavedTour(id);
      showToast("Removed from saved tours", "info");
    } else {
      saveTour(id);
      showToast("Tour saved to your collection!", "success");
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <motion.img initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
          src={tour.image} alt={tour.name} className="w-full h-full object-cover cursor-pointer"
          onClick={() => openLightbox(0)} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

        {/* Image count indicator */}
        {tour.images.length > 1 && (
          <button onClick={() => openLightbox(0)}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center gap-2">
            <Maximize2 className="w-4 h-4" />
            <span className="text-xs font-medium">{tour.images.length} photos</span>
          </button>
        )}

        {/* Thumbnail strip */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
            {tour.images.map((img, i) => (
              <button key={i} onClick={() => openLightbox(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === 0 ? "border-accent" : "border-transparent hover:border-white/40"
                }`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-20 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Tours
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant={diff.badge}>{tour.difficulty}</Badge>
                {categoryInfo && (
                  <Badge variant="outline" className="gap-1" style={{ borderColor: categoryInfo.color, color: categoryInfo.color }}>
                    {categoryInfo.label}
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1"><Star className="w-3 h-3 text-accent fill-accent" /> {tour.rating} ({tour.reviews} reviews)</Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">{tour.name}</h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl">{tour.subtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-text-secondary leading-relaxed">{tour.longDescription}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold mb-6">Tour Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-lighter/30 border border-border-light hover:border-accent/20 transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
              <div className="space-y-3">
                {tour.itinerary.map((item, i) => (
                  <div key={i} className="group flex gap-4 p-5 rounded-xl bg-surface-lighter/20 border border-border-light hover:border-accent/20 transition-all duration-300">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                      {i < tour.itinerary.length - 1 && <div className="w-px flex-1 bg-border-light group-hover:bg-accent/30 transition-colors" />}
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
              className="rounded-2xl border border-border-light bg-surface-lighter/20 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Location Details</h3>
                    <p className="text-xs text-text-muted">{tour.location}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Plane, label: "Nearest Airport", value: tour.nearestAirport },
                    { icon: Globe, label: "Languages", value: tour.languages.join(", ") },
                    { icon: DollarSign, label: "Currency", value: tour.currency },
                    { icon: Clock3, label: "Time Zone", value: tour.timeZone },
                    ...(tour.altitude ? [{ icon: Mountain, label: "Altitude", value: tour.altitude }] : []),
                    ...(tour.areaKm2 ? [{ icon: MapIcon, label: "Area", value: tour.areaKm2 }] : []),
                    ...(tour.population ? [{ icon: Users2, label: "Population", value: tour.population }] : []),
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="col-span-2 sm:col-span-1 flex items-start gap-3 p-3 rounded-xl bg-surface-lighter/40 border border-border-light">
                        <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-xs text-text-muted">{item.label}</div>
                          <div className="text-sm font-medium break-words">{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Known For Tags */}
                <div className="mt-4 pt-4 border-t border-border-light">
                  <div className="text-xs text-text-muted mb-3">Known For</div>
                  <div className="flex flex-wrap gap-2">
                    {tour.knownFor.map((item, i) => (
                      <span key={i}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Popular Attractions Map */}
            {(() => {
              const trips = getShortTripsByTourId(tour.id).filter(t => t.popular);
              if (trips.length < 2) return null;
              return (
                <AttractionsMap
                  pins={trips.map(t => ({ name: t.name, lat: t.coordinates.lat, lng: t.coordinates.lng }))}
                  centerLat={tour.coordinates.lat}
                  centerLng={tour.coordinates.lng}
                  destinationName={tour.name}
                />
              );
            })()}

            {/* Local Food & Dining */}
            {(() => {
              const foods = getFoodByTourId(tour.id);
              if (foods.length === 0) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-border-light bg-surface-lighter/20 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b border-border-light">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Local Food & Dining</h3>
                        <p className="text-xs text-text-muted">Must-try restaurants & dishes in {tour.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border-light">
                    {foods.slice(0, 4).map((food) => {
                      const foodTypeInfo = foodTypes.find(t => t.id === food.type);
                      const userAvgRating = getAverageRating(food.id);
                      const userReviewCount = getReviewCount(food.id);
                      const existingReviews = getReviewsForFood(food.id);
                      return (
                        <div key={food.id} className="p-4 sm:p-5 hover:bg-surface-lighter/30 transition-colors">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
                              <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-sm">{food.name}</h4>
                                {food.popular && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                    <Flame className="w-2.5 h-2.5" /> Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text-muted line-clamp-1 mb-1.5">{food.description}</p>
                              <div className="flex items-center gap-2 text-xs text-text-muted mb-1.5 flex-wrap">
                                <span className="font-semibold text-accent">{food.priceRange}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-accent fill-accent" /> {food.rating}
                                </span>
                                <span>•</span>
                                <span className="px-1.5 py-0.5 rounded bg-surface-lighter/50 text-[10px]">{foodTypeInfo?.label}</span>
                                {userAvgRating > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-amber-400">
                                      <StarRating rating={Math.round(userAvgRating)} size="sm" />
                                      ({userReviewCount})
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-[11px] font-medium text-amber-400 shrink-0">🍽️ {food.signatureDish}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {food.mustTry.slice(0, 3).map((dish) => (
                                  <span key={dish}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-surface-lighter/50 text-text-muted border border-border-light">
                                    {dish}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <a
                                  href={getDirectionsUrl(food.coordinates.lat, food.coordinates.lng, food.name)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors"
                                >
                                  <Navigation className="w-3 h-3" /> Directions
                                </a>
                                <button
                                  onClick={() => {
                                    setShowReviewForm(showReviewForm === food.id ? null : food.id);
                                    setShowReviews(null);
                                    setSelectedRating(0);
                                    setReviewComment("");
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                  <Star className="w-3 h-3" /> Rate
                                </button>
                                {existingReviews.length > 0 && (
                                  <button
                                    onClick={() => setShowReviews(showReviews === food.id ? null : food.id)}
                                    className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors"
                                  >
                                    {existingReviews.length} review{existingReviews.length !== 1 ? "s" : ""}
                                  </button>
                                )}
                              </div>

                              {/* Review Form */}
                              {showReviewForm === food.id && (
                                <div className="mt-3 p-3 rounded-xl bg-surface-lighter/40 border border-border-light space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-text-muted">Your rating:</span>
                                    <StarRating
                                      rating={selectedRating}
                                      onRate={setSelectedRating}
                                      size="md"
                                      interactive
                                    />
                                    {selectedRating > 0 && (
                                      <span className="text-xs font-medium text-amber-400">
                                        {selectedRating}/5
                                      </span>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Add a comment (optional)..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full text-xs bg-surface-lighter/50 border border-border-light rounded-lg px-3 py-2 outline-none focus:border-accent/50 transition-colors placeholder:text-text-muted/50"
                                    maxLength={200}
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => { setShowReviewForm(null); setSelectedRating(0); setReviewComment(""); }}
                                      className="text-[11px] px-3 py-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleAddReview(food.id)}
                                      disabled={selectedRating === 0}
                                      className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all ${
                                        selectedRating > 0
                                          ? "bg-amber-500 text-white hover:bg-amber-600"
                                          : "bg-surface-lighter/50 text-text-muted cursor-not-allowed"
                                      }`}
                                    >
                                      Submit Review
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Reviews Display */}
                              {showReviews === food.id && existingReviews.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {existingReviews.slice(0, 3).map((rev) => (
                                    <div key={rev.id} className="p-2.5 rounded-xl bg-surface-lighter/30 border border-border-light">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium">{rev.userName}</span>
                                          <StarRating rating={rev.rating} size="sm" />
                                        </div>
                                        <span className="text-[10px] text-text-muted">
                                          {new Date(rev.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      {rev.comment && (
                                        <p className="text-[11px] text-text-muted">{rev.comment}</p>
                                      )}
                                    </div>
                                  ))}
                                  {existingReviews.length > 3 && (
                                    <p className="text-[10px] text-text-muted text-center">
                                      +{existingReviews.length - 3} more reviews
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {foods.length > 4 && (
                    <div className="p-3 border-t border-border-light text-center">
                      <span className="text-xs text-text-muted">+{foods.length - 4} more dining options</span>
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-24 h-fit">
            <div className="bg-surface-light/40 backdrop-blur-sm rounded-2xl border border-border-light p-6 space-y-6">
              <div className="text-center pb-6 border-b border-border-light">
                <div className="text-3xl font-bold text-accent">₹{tour.price.toLocaleString()}</div>
                <div className="text-sm text-text-muted">per person</div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: MapPin, label: "Location", value: tour.location },
                  { icon: Clock, label: "Duration", value: tour.duration },
                  { icon: Users, label: "Group Size", value: `Max ${tour.maxPeople} people` },
                  { icon: Calendar, label: "Accommodation", value: tour.accommodation },
                  { icon: Shield, label: "Difficulty", value: tour.difficulty },
                  { icon: Sun, label: "Best Season", value: tour.bestSeason },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <div className="text-xs text-text-muted">{item.label}</div>
                        <div className="text-sm font-medium">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-4 border-t border-border-light">
                <Button size="lg" className="w-full gap-2" onClick={() => navigate(`/checkout/${tour.id}`)}>Book This Tour</Button>
                <div className="flex gap-2">
                  <Button variant={isSaved ? "default" : "secondary"} size="icon"
                    className={`flex-1 ${isSaved ? "bg-accent hover:bg-accent-dark" : ""}`}
                    onClick={handleToggleSave}>
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                  </Button>
                  <Button variant="secondary" className="flex-[3] gap-2" onClick={handleToggleSave}>
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-accent text-accent" : ""}`} />
                    {isSaved ? "Saved" : "Save to Favorites"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Short Trips Nearby */}
      <ShortTripsSection tourId={tour.id} tourName={tour.name} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={tour.images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => setLightboxIndex((i) => (i === 0 ? tour.images.length - 1 : i - 1))}
            onNext={() => setLightboxIndex((i) => (i === tour.images.length - 1 ? 0 : i + 1))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
