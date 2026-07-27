import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Heart, MapPin, Calendar, X, Upload,
  Trash2, User, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  TripPhoto,
  getTripPhotos,
  addTripPhoto,
  deleteTripPhoto,
  likeTripPhoto,
} from "@/features/tripphotos/services/tripPhotoService";
import { tours } from "@/features/tours/data/tours";

const suggestedLocations = tours.map((t) => t.name).slice(0, 10);

export function TripPhotosPage() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");

  // Upload form state
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [visitedDate, setVisitedDate] = useState("");

  useEffect(() => {
    setPhotos(getTripPhotos());
  }, []);

  const refresh = () => setPhotos(getTripPhotos());

  const filteredPhotos = photos.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.caption.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.userName.toLowerCase().includes(q)
    );
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim() || !location.trim()) {
      showToast("Please fill in all required fields", "info");
      return;
    }
    if (!user) {
      showToast("You must be signed in to share photos", "info");
      return;
    }

    addTripPhoto({
      imageUrl: imageUrl.trim(),
      caption: caption.trim(),
      location: location.trim(),
      visitedDate: visitedDate || new Date().toISOString().split("T")[0],
      userName: user.name,
      userEmail: user.email,
      userAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=f59e0b&textColor=ffffff`,
    });

    showToast("Trip photo shared! 🎉", "success");
    setImageUrl("");
    setCaption("");
    setLocation("");
    setVisitedDate("");
    setShowUpload(false);
    refresh();
  };

  const handleLike = (id: string) => {
    if (!isAuthenticated) {
      showToast("Sign in to like photos!", "info");
      return;
    }
    const result = likeTripPhoto(id, user!.email);
    if (result) refresh();
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    deleteTripPhoto(id, user.email);
    refresh();
    showToast("Photo removed", "info");
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-light/30 to-surface" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, var(--color-primary) 0%, transparent 40%), radial-gradient(circle at 70% 60%, var(--color-accent) 0%, transparent 40%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge variant="accent" className="mb-4">Community</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Trip{" "}
              <span className="text-gradient">Photos</span>
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto mb-8">
              Share your travel memories and discover amazing destinations
              through the eyes of fellow travelers.
            </p>

            {/* Search + Upload */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  placeholder="Search photos by caption, location, or traveler..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {isAuthenticated && (
                <Button
                  variant="accent"
                  className="gap-2 shrink-0"
                  onClick={() => setShowUpload(true)}
                >
                  <Camera className="w-4 h-4" />
                  Share Your Trip
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No photos yet</h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              {search.trim()
                ? "No photos match your search. Try a different keyword!"
                : "Be the first to share your travel memories with the community!"}
            </p>
            {isAuthenticated && !search.trim() && (
              <Button
                variant="accent"
                size="lg"
                className="gap-2"
                onClick={() => setShowUpload(true)}
              >
                <Camera className="w-5 h-5" />
                Share Your First Photo
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
                className="break-inside-avoid"
              >
                <div className="group relative bg-surface-light/40 backdrop-blur-sm rounded-2xl border border-border-light overflow-hidden hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ minHeight: "200px" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1e293b/f59e0b?text=Photo`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm font-medium mb-2 line-clamp-2">{photo.caption}</p>

                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-accent" />
                        {photo.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(photo.visitedDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* User + Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border-light">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/20 overflow-hidden">
                          {photo.userAvatar ? (
                            <img
                              src={photo.userAvatar}
                              alt={photo.userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-accent m-1.5" />
                          )}
                        </div>
                        <span className="text-xs text-text-muted">{photo.userName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(photo.id)}
                          className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-lg ${
                            user && photo.likedBy.includes(user.email)
                              ? "text-red-400 bg-red-400/10"
                              : "text-text-muted hover:text-red-400 hover:bg-red-400/10"
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              user && photo.likedBy.includes(user.email) ? "fill-red-400" : ""
                            }`}
                          />
                          {photo.likes > 0 && <span>{photo.likes}</span>}
                        </button>

                        {user && photo.userEmail === user.email && (
                          <button
                            onClick={() => handleDelete(photo.id)}
                            className="text-text-muted hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-surface-light border border-border-light rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Share Your Trip</h3>
                    <p className="text-xs text-text-muted">Post a photo from your travels</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Photo URL *</label>
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-border-light">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                          (e.target as HTMLImageElement).classList.add("hidden");
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Caption *</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-border-light bg-surface-lighter/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 resize-none"
                    placeholder="What made this trip special..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Location *</label>
                    <Input
                      placeholder="e.g. Manali, Goa..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      list="location-suggestions"
                    />
                    <datalist id="location-suggestions">
                      {suggestedLocations.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Date Visited</label>
                    <Input
                      type="date"
                      value={visitedDate}
                      onChange={(e) => setVisitedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Share Photo
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
