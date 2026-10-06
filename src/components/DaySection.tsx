import React, { useState } from 'react';
import { Calendar, MapPin, Filter } from 'lucide-react';
import { DayPlan } from '../types/itinerary.ts';
import { ActivityCard } from './ActivityCard.tsx';

interface DaySectionProps {
  day: DayPlan;
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
  dayIndex: number;
}

export const DaySection: React.FC<DaySectionProps> = ({
  day,
  completedIds,
  onToggleComplete,
  dayIndex,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<string>('All');

  const filteredActivities = day.activities.filter((act) => {
    if (filterPeriod === 'All') return true;
    return act.period.toLowerCase() === filterPeriod.toLowerCase();
  });

  const dayAccentColors = [
    { badge: 'bg-sky-600', ring: 'border-sky-500/20', text: 'text-sky-700' },
    { badge: 'bg-indigo-600', ring: 'border-indigo-500/20', text: 'text-indigo-700' },
    { badge: 'bg-amber-600', ring: 'border-amber-500/20', text: 'text-amber-700' },
  ];

  const accent = dayAccentColors[(day.dayNumber - 1) % dayAccentColors.length];

  return (
    <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden mb-8 transition-all">
      {/* Day Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`px-2.5 py-0.5 rounded-md text-white text-xs font-black uppercase tracking-wider ${accent.badge}`}>
                Day {day.dayNumber}
              </span>
              <span className="text-stone-300 text-xs font-medium">
                {day.activities.length} Planned Stops
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {day.title}
            </h2>

            <p className="mt-1 text-sm text-stone-300 max-w-2xl">
              {day.theme}
            </p>
          </div>

          {/* Neighborhood Badges */}
          {day.neighborhoods && day.neighborhoods.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
              <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-300" />
                Areas:
              </span>
              {day.neighborhoods.map((n) => (
                <span
                  key={n}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-stone-200 border border-white/10 text-xs font-medium backdrop-blur-xs transition-colors"
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Period Filter Tabs */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter Time:</span>
          </div>

          <div className="flex items-center gap-1">
            {['All', 'Morning', 'Afternoon', 'Evening'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterPeriod === period
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Timeline List */}
      <div className="p-5 sm:p-7 space-y-5 bg-stone-50/40">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm">
            No activities scheduled for {filterPeriod}.
          </div>
        ) : (
          filteredActivities.map((activity, idx) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isCompleted={completedIds.has(activity.id)}
              onToggleComplete={onToggleComplete}
              index={idx}
            />
          ))
        )}
      </div>
    </section>
  );
};
