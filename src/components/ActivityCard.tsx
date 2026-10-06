import React from 'react';
import { 
  Clock, 
  MapPin, 
  Utensils, 
  Lightbulb, 
  DollarSign, 
  CheckCircle2, 
  Circle,
  Landmark,
  Camera,
  Compass,
  ShoppingBag,
  Trees,
  Sparkles
} from 'lucide-react';
import { Activity } from '../types/itinerary.ts';

interface ActivityCardProps {
  activity: Activity;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  index: number;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isCompleted,
  onToggleComplete,
  index,
}) => {
  // Category styling and icon selector
  const getCategoryTheme = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('culinary') || cat.includes('dining')) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badge: 'bg-amber-100 text-amber-900',
        icon: Utensils,
      };
    }
    if (cat.includes('culture') || cat.includes('art') || cat.includes('museum') || cat.includes('historic')) {
      return {
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-900',
        icon: Landmark,
      };
    }
    if (cat.includes('nature') || cat.includes('walk') || cat.includes('park') || cat.includes('garden')) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-900',
        icon: Trees,
      };
    }
    if (cat.includes('shop') || cat.includes('market') || cat.includes('bazaar')) {
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        badge: 'bg-rose-100 text-rose-900',
        icon: ShoppingBag,
      };
    }
    if (cat.includes('scenic') || cat.includes('view') || cat.includes('sunset') || cat.includes('panoram')) {
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        badge: 'bg-purple-100 text-purple-900',
        icon: Camera,
      };
    }
    return {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      badge: 'bg-sky-100 text-sky-900',
      icon: Compass,
    };
  };

  const periodStyles: Record<string, string> = {
    Morning: 'bg-amber-100/80 text-amber-900 border-amber-300/60',
    Afternoon: 'bg-sky-100/80 text-sky-900 border-sky-300/60',
    Evening: 'bg-indigo-100/80 text-indigo-900 border-indigo-300/60',
    Night: 'bg-purple-100/80 text-purple-900 border-purple-300/60',
  };

  const theme = getCategoryTheme(activity.category);
  const CategoryIcon = theme.icon;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
          : 'border-stone-200/90 hover:border-sky-300 hover:shadow-md'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Header: Time badge, Period, Category, and Mark Complete */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-stone-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Time Slot Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 text-white text-xs font-semibold tracking-wide">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{activity.time}</span>
            </div>

            {/* Period Badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                periodStyles[activity.period] || 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {activity.period}
            </span>

            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${theme.bg}`}
            >
              <CategoryIcon className="w-3 h-3" />
              <span>{activity.category}</span>
            </span>
          </div>

          {/* Right badges: Cost & Completion toggle */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                activity.estimatedCost === 'Free'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
              title={`Cost level: ${activity.estimatedCost}`}
            >
              {activity.estimatedCost}
            </span>

            <button
              type="button"
              onClick={() => onToggleComplete(activity.id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-emerald-700 transition-colors cursor-pointer"
              title={isCompleted ? 'Mark as unvisited' : 'Mark as visited'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold hidden sm:inline">Visited</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
                  <span className="hidden sm:inline">Check off</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title and Duration */}
        <div className="mt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-lg sm:text-xl font-bold text-stone-900 leading-snug ${
                isCompleted ? 'line-through text-stone-500' : ''
              }`}
            >
              {activity.title}
            </h3>
            <span className="shrink-0 text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
              {activity.duration}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 text-stone-600 text-sm leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Recommended Food and Insider Tip */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-100">
          {activity.recommendedFood && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-950 text-xs">
              <div className="w-6 h-6 rounded-lg bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-800 mt-0.5">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">Where & What to Eat:</span>
                <span className="text-amber-900/90 leading-normal">{activity.recommendedFood}</span>
              </div>
            </div>
          )}

          {activity.insiderTip && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-sky-950 text-xs">
              <div className="w-6 h-6 rounded-lg bg-sky-200/80 flex items-center justify-center shrink-0 text-sky-800 mt-0.5">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-sky-900 block mb-0.5">Local Insider Tip:</span>
                <span className="text-sky-900/90 leading-normal">{activity.insiderTip}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
