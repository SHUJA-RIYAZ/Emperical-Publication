import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  className?: string;
}

export function RatingStars({ rating, reviewsCount, className }: RatingStarsProps) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating} out of 5${reviewsCount != null ? ` from ${reviewsCount} reviews` : ""}`}
    >
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground" aria-hidden>
        {rating.toFixed(1)}
        {reviewsCount != null && ` (${reviewsCount})`}
      </span>
    </div>
  );
}
