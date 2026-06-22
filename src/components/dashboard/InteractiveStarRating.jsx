'use client';

import { Star } from 'lucide-react';

export default function InteractiveStarRating({ value = 0, onChange, size = 22 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < value;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            className="rounded p-0.5 transition hover:scale-110"
            aria-label={`Rate ${index + 1} stars`}
          >
            <Star
              size={size}
              className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
            />
          </button>
        );
      })}
    </div>
  );
}
