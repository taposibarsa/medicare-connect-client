'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAY_NAMES, getDayNameFromDate, toDateKey } from '@/lib/dayNames';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AvailabilityCalendar({
  availableDays = [],
  selectedDate = '',
  onSelectDate,
  mode = 'pick',
  minDate,
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const min = useMemo(() => {
    if (minDate) {
      const d = new Date(`${minDate}T12:00:00`);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return today;
  }, [minDate, today]);

  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) return new Date(`${selectedDate}T12:00:00`);
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result = [];

    for (let i = 0; i < startOffset; i += 1) {
      result.push({ key: `empty-${i}`, empty: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dateKey = toDateKey(date);
      const dayName = DAY_NAMES[date.getDay()];
      const isPast = date < min;
      const hasSchedule = availableDays.length === 0 || availableDays.includes(dayName);
      const isAvailable = !isPast && hasSchedule;
      const isSelected = selectedDate === dateKey;
      const isToday = toDateKey(date) === toDateKey(today);

      result.push({
        key: dateKey,
        day,
        dateKey,
        dayName,
        isAvailable,
        isSelected,
        isToday,
        empty: false,
      });
    }

    return result;
  }, [year, month, availableDays, selectedDate, min, today]);

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goMonth = (delta) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleSelect = (cell) => {
    if (mode !== 'pick' || !cell.isAvailable || !onSelectDate) return;
    onSelectDate(cell.dateKey);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/30">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-[#5e17eb] dark:hover:bg-slate-700"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-slate-800 dark:text-white">{monthLabel}</span>
        <button
          type="button"
          onClick={() => goMonth(1)}
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-[#5e17eb] dark:hover:bg-slate-700"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (cell.empty) {
            return <div key={cell.key} className="aspect-square" />;
          }

          const base =
            'flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition';

          let className = `${base} text-slate-300 dark:text-slate-600 cursor-not-allowed`;

          if (mode === 'display') {
            className = cell.isAvailable
              ? `${base} bg-[#5e17eb]/15 text-[#5e17eb] font-semibold`
              : `${base} text-slate-400 dark:text-slate-500`;
          } else if (cell.isAvailable) {
            className = cell.isSelected
              ? `${base} bg-[#5e17eb] text-white shadow-md cursor-pointer`
              : `${base} text-slate-700 hover:bg-[#5e17eb]/10 dark:text-slate-200 cursor-pointer`;
          }

          if (cell.isToday && !cell.isSelected) {
            className += ' ring-1 ring-[#5e17eb]/40';
          }

          return (
            <button
              key={cell.key}
              type="button"
              disabled={mode === 'pick' && !cell.isAvailable}
              onClick={() => handleSelect(cell)}
              title={
                mode === 'pick' && availableDays.length > 0
                  ? `${cell.dayName}${cell.isAvailable ? ' — available' : ' — unavailable'}`
                  : undefined
              }
              className={className}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      {mode === 'pick' && selectedDate && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Selected: {selectedDate} ({getDayNameFromDate(selectedDate)})
        </p>
      )}

      {mode === 'display' && availableDays.length > 0 && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Highlighted days match the doctor&apos;s weekly schedule.
        </p>
      )}
    </div>
  );
}
