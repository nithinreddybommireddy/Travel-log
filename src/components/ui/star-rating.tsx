import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  showValue?: boolean;
}

export function StarRating({ rating, onRate, size = "sm", interactive = false, showValue = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const sizeMap = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };
  const starSize = sizeMap[size];

  const displayRating = interactive && hovered > 0 ? hovered : rating;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-all duration-150 ${
            star <= displayRating
              ? "text-amber-400 fill-amber-400"
              : "text-border-light fill-none"
          }`}
        >
          <Star className={`${starSize} ${star <= displayRating ? "" : "stroke-border-light"}`}
            fill={star <= displayRating ? "currentColor" : "none"} />
        </button>
      ))}
      {showValue && (
        <span className="text-xs text-text-muted ml-1">{displayRating.toFixed(1)}</span>
      )}
    </div>
  );
}

export function StaticStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  return <StarRating rating={rating} size={size} />;
}
