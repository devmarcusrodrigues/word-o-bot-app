import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, totalStars = 3, className, starClassName }: StarRatingProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: totalStars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-8 w-8 transition-all duration-300",
            i < rating
              ? "text-chart-4 fill-chart-4"
              : "text-muted-foreground/30",
            starClassName
          )}
        />
      ))}
    </div>
  );
}
