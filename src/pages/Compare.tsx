import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Users, Shield, DollarSign, CheckCircle2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tours } from "@/data/tours";

const difficultyScores = { easy: 2, medium: 4, hard: 6 };
const maxPrice = Math.max(...tours.map((t) => t.price));

function RadarChart({ tours: selectedTours }: { tours: typeof tours }) {
  const features = ["Price Value", "Duration", "Rating", "Reviews", "Difficulty"];
  const width = 220;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 80;

  const getScores = (tour: typeof tours[0]) => [
    Math.round((1 - tour.price / maxPrice) * 5),
    Math.min(tour.duration.split(" ")[0] ? parseInt(tour.duration.split(" ")[0]) : 5, 7),
    tour.rating,
    Math.min(tour.reviews / 100, 5),
    difficultyScores[tour.difficulty],
  ];

  const colors = ["#3b82f6", "#f59e0b", "#10b981"];

  const toPoint = (index: number, value: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 7) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  return (
    <div className="flex justify-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={features
              .map((_, i) => {
                const p = toPoint(i, (level / 5) * 7, features.length);
                return `${p.x},${p.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}
        {/* Axes */}
        {features.map((_, i) => {
          const p = toPoint(i, 7, features.length);
          return (
            <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          );
        })}
        {/* Labels */}
        {features.map((label, i) => {
          const p = toPoint(i, 7.8, features.length);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize={10}>
              {label}
            </text>
          );
        })}
        {/* Data */}
        {selectedTours.map((tour, ti) => {
          const scores = getScores(tour);
          const points = scores
            .map((score, i) => {
              const p = toPoint(i, score, features.length);
              return `${p.x},${p.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={ti}
              points={points}
              fill={colors[ti]}
              fillOpacity={0.15}
              stroke={colors[ti]}
              strokeWidth={2}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedTours = tours.filter((t) => selectedIds.includes(t.id));
  const maxSelected = 3;

  const toggleTour = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id));
    } else if (selectedIds.length < maxSelected) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparisonMetrics = [
    {
      label: "Price",
      icon: DollarSign,
      getValue: (tour: typeof tours[0]) => `₹${tour.price.toLocaleString()}`,
      getScore: (tour: typeof tours[0]) => Math.round((1 - tour.price / maxPrice) * 100),
    },
    {
      label: "Duration",
      icon: Clock,
      getValue: (tour: typeof tours[0]) => tour.duration,
      getScore: () => null,
    },
    {
      label: "Rating",
      icon: Star,
      getValue: (tour: typeof tours[0]) => `${tour.rating} ★`,
      getScore: (tour: typeof tours[0]) => Math.round(tour.rating * 20),
    },
    {
      label: "Difficulty",
      icon: Shield,
      getValue: (tour: typeof tours[0]) => tour.difficulty,
      getScore: (tour: typeof tours[0]) => difficultyScores[tour.difficulty] * 16.7,
    },
    {
      label: "Group Size",
      icon: Users,
      getValue: (tour: typeof tours[0]) => `Max ${tour.maxPeople}`,
      getScore: () => null,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <Badge variant="accent" className="mb-3">Compare</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            Destination <span className="text-gradient">Comparator</span>
          </h1>
          <p className="text-text-secondary">
            Select up to 3 destinations to compare side-by-side and find your perfect trip.
          </p>
        </motion.div>

        {/* Tour Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-sm font-semibold text-text-secondary mb-3">
            Select destinations ({selectedIds.length}/{maxSelected})
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tours.map((tour) => {
              const isSelected = selectedIds.includes(tour.id);
              const isDisabled = !isSelected && selectedIds.length >= maxSelected;
              return (
                <button
                  key={tour.id}
                  onClick={() => toggleTour(tour.id)}
                  disabled={isDisabled}
                  className={`flex-shrink-0 w-36 group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-accent shadow-lg shadow-accent/20"
                      : isDisabled
                      ? "border-border-light opacity-40 cursor-not-allowed"
                      : "border-border-light hover:border-accent/40"
                  }`}
                >
                  <div className="h-20 overflow-hidden">
                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 bg-surface-light">
                    <div className="text-xs font-semibold truncate">{tour.name}</div>
                    <div className="text-[10px] text-text-muted">₹{tour.price.toLocaleString()}</div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 p-0.5 rounded-full bg-accent">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {selectedTours.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-surface-light/20 rounded-2xl border border-border-light border-dashed"
          >
            <Plus className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Select destinations to compare</h2>
            <p className="text-text-secondary">Choose up to 3 tours above to see a detailed comparison.</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-light/30 rounded-2xl border border-border-light p-8"
            >
              <h2 className="text-xl font-bold mb-6 text-center">Feature Comparison</h2>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <RadarChart tours={selectedTours} />
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedTours.map((tour, i) => (
                    <div key={tour.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"][i] }} />
                      <span className="text-sm" style={{ color: ["#3b82f6", "#f59e0b", "#10b981"][i] }}>{tour.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Metrics Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-light/30 rounded-2xl border border-border-light overflow-hidden"
            >
              <div className="p-6 border-b border-border-light">
                <h2 className="text-xl font-bold">Detailed Comparison</h2>
              </div>
              <div className="divide-y divide-border-light">
                {comparisonMetrics.map((metric) => (
                  <div key={metric.label} className="grid grid-cols-[140px_repeat(3,1fr)] lg:grid-cols-[160px_repeat(3,1fr)]">
                    <div className="p-4 flex items-center gap-2 text-sm font-medium text-text-secondary border-r border-border-light bg-surface-lighter/20">
                      <metric.icon className="w-4 h-4 text-accent" />
                      {metric.label}
                    </div>
                    {selectedTours.map((tour, i) => (
                      <div key={tour.id} className={`p-4 ${i < selectedTours.length - 1 ? "border-r border-border-light" : ""}`}>
                        <div className="font-semibold text-sm">{metric.getValue(tour)}</div>
                        {metric.getScore(tour) !== null && (
                          <div className="mt-2 h-1.5 rounded-full bg-surface-lighter overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${metric.getScore(tour)}%`,
                                backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"][i],
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Fill empty slots */}
                    {selectedTours.length < 3 && Array.from({ length: 3 - selectedTours.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-4 border-r border-border-light last:border-r-0" />
                    ))}
                  </div>
                ))}

                {/* Highlights */}
                <div className="grid grid-cols-[140px_repeat(3,1fr)] lg:grid-cols-[160px_repeat(3,1fr)]">
                  <div className="p-4 flex items-center gap-2 text-sm font-medium text-text-secondary border-r border-border-light bg-surface-lighter/20">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Highlights
                  </div>
                  {selectedTours.map((tour, i) => (
                    <div key={tour.id} className={`p-4 ${i < selectedTours.length - 1 ? "border-r border-border-light" : ""}`}>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {tour.highlights.slice(0, 3).map((h, j) => (
                          <li key={j} className="flex items-start gap-1">
                            <span className="text-accent mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Winner / CTA */}
            {selectedTours.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl border border-accent/20 p-6">
                  <div>
                    <h3 className="font-bold text-lg">Can't decide?</h3>
                    <p className="text-sm text-text-secondary">Check out the full details of each destination</p>
                  </div>
                  {selectedTours.map((tour) => (
                    <Link key={tour.id} to={`/tours/${tour.id}`}>
                      <Button variant="outline" size="sm">{tour.name}</Button>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
