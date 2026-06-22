import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 16, showValue = true }) {
  const value = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(value);
        return (
          <Star
            key={index}
            size={size}
            className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
          {value > 0 ? value.toFixed(1) : 'New'}
        </span>
      )}
    </div>
  );
}
