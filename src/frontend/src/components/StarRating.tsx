import { Star } from "lucide-react";
import { useState } from "react";

interface RatingData {
  avg: number;
  count: number;
  myRating: number;
}

interface StarRatingProps {
  productId: string;
  productType: "merch" | "audiobook";
  interactive?: boolean;
  size?: "sm" | "md";
}

function getRatingData(productType: string, productId: string): RatingData {
  try {
    const raw = localStorage.getItem(
      `mystoryova_rating_${productType}_${productId}`,
    );
    if (raw) return JSON.parse(raw);
  } catch {}
  return { avg: 0, count: 0, myRating: 0 };
}

function saveRating(
  productType: string,
  productId: string,
  rating: number,
  current: RatingData,
): RatingData {
  const wasRated = current.myRating > 0;
  const newCount = wasRated ? current.count : current.count + 1;
  // recalculate avg: remove old rating if existed, add new
  const sumBefore = current.avg * current.count;
  const sumAdjusted = wasRated ? sumBefore - current.myRating : sumBefore;
  const newAvg = (sumAdjusted + rating) / newCount;
  const next: RatingData = {
    avg: newAvg,
    count: newCount,
    myRating: rating,
  };
  localStorage.setItem(
    `mystoryova_rating_${productType}_${productId}`,
    JSON.stringify(next),
  );
  return next;
}

export default function StarRating({
  productId,
  productType,
  interactive = false,
  size = "md",
}: StarRatingProps) {
  const [data, setData] = useState<RatingData>(() =>
    getRatingData(productType, productId),
  );
  const [hovered, setHovered] = useState(0);

  const starClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const filled = Math.round(data.avg);
  const canRate = interactive && data.myRating === 0;
  const displayFill = hovered > 0 && canRate ? hovered : filled;

  const handleRate = (star: number) => {
    if (!interactive) return;
    const next = saveRating(productType, productId, star, data);
    setData(next);
    setHovered(0);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleRate(star)}
            onMouseEnter={() => canRate && setHovered(star)}
            className={`transition-colors ${
              interactive && canRate
                ? "cursor-pointer hover:scale-110"
                : "cursor-default"
            }`}
          >
            <Star
              className={`${starClass} transition-colors ${
                star <= displayFill
                  ? "fill-primary text-primary"
                  : "fill-transparent text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
      </div>
      {data.count > 0 ? (
        <span className="text-xs text-muted-foreground">({data.count})</span>
      ) : null}
      {canRate && hovered === 0 && (
        <span className="text-xs text-muted-foreground">Rate this</span>
      )}
      {data.myRating > 0 && <span className="text-xs text-primary">Rated</span>}
    </div>
  );
}
