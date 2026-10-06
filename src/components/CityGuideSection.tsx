import React, { useState } from 'react';
import { Lightbulb, Luggage, Navigation, CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import { Itinerary } from '../types/itinerary.ts';

interface CityGuideSectionProps {
  itinerary: Itinerary;
}

export const CityGuideSection: React.FC<CityGuideSectionProps> = ({ itinerary }) => {
  const [packedItems, setPackedItems] = useState<Set<number>>(new Set());

  const togglePacked = (index: number) => {
    setPackedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 mb-8 space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <span>{itinerary.cityName} Travel Essentials & Practical Guide</span>
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Everything you need to navigate the city smoothly, pack effectively, and travel like a local.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Curated Tips */}
        <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm mb-4">
              <div className="w-7 h-7 rounded-lg bg-sky-200/80 flex items-center justify-center text-sky-800">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span>Crucial Local Tips</span>
            </div>

            <ul className="space-y-3">
              {itinerary.curatedTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transit & Navigation */}
        <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-200/80 flex items-center justify-center text-indigo-800">
                <Navigation className="w-4 h-4" />
              </div>
              <span>Transit & Getting Around</span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
              {itinerary.transitTip}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-indigo-100/80 text-xs">
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
                <span className="text-stone-400 block mb-0.5 font-semibold">Currency</span>
                <span className="font-bold text-stone-800 text-sm">{itinerary.localCurrency}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
                <span className="text-stone-400 block mb-0.5 font-semibold">Language</span>
                <span className="font-bold text-stone-800 text-sm">{itinerary.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packing Highlights Checklist */}
      <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-800">
              <Luggage className="w-4 h-4" />
            </div>
            <span>Recommended Packing Checklist</span>
          </div>

          <span className="text-xs text-amber-800 font-medium">
            {packedItems.size} of {itinerary.packingHighlights.length} packed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {itinerary.packingHighlights.map((item, idx) => {
            const isPacked = packedItems.has(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => togglePacked(idx)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isPacked
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-white border-amber-200/60 hover:border-amber-300 text-stone-800'
                }`}
              >
                {isPacked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${isPacked ? 'line-through text-emerald-800/80' : ''}`}>
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
