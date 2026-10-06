import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Clock, Utensils, CheckCircle } from 'lucide-react';

interface LoadingStateProps {
  city: string;
}

const STEPS = [
  { icon: MapPin, text: 'Analyzing city neighborhoods and transit links...' },
  { icon: Clock, text: 'Structuring realistic Morning, Afternoon & Evening schedules...' },
  { icon: Utensils, text: 'Pairing authentic local dining & cafe recommendations...' },
  { icon: Sparkles, text: 'Curating insider traveler tips & packing essentials...' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ city }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-xl shadow-sky-500/20 mb-6">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-stone-900">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-stone-900 tracking-tight">
        Crafting your 3-Day {city} Itinerary
      </h2>
      <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">
        Building a day-by-day, time-by-time plan with curated activities and local spots.
      </p>

      {/* Progressive Step Progress */}
      <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3.5 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-sky-700 font-bold'
                  : 'text-stone-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : isCurrent
                    ? 'bg-sky-100 text-sky-700 animate-pulse'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="flex-1">{step.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
