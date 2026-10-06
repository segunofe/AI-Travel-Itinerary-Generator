import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  Globe, 
  Sparkles,
  Sun,
  Coins,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Itinerary } from '../types/itinerary.ts';
import { DaySection } from './DaySection.tsx';
import { CityGuideSection } from './CityGuideSection.tsx';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  isSaved: boolean;
  onSaveToggle: (itinerary: Itinerary) => void;
  onPrint: () => void;
  onReset: () => void;
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  isSaved,
  onSaveToggle,
  onPrint,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'day-1' | 'day-2' | 'day-3' | 'guide'>('all');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const totalActivities = itinerary.days.reduce((acc, d) => acc + d.activities.length, 0);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = () => {
    let text = `# 3-Day Travel Itinerary: ${itinerary.cityName}, ${itinerary.country}\n`;
    text += `${itinerary.tagline}\n\n`;
    text += `Overview: ${itinerary.overview}\n`;
    text += `Best Season: ${itinerary.bestSeason} | Currency: ${itinerary.localCurrency}\n\n`;

    itinerary.days.forEach((d) => {
      text += `## ${d.title}\n`;
      text += `Theme: ${d.theme}\n`;
      text += `Neighborhoods: ${d.neighborhoods.join(', ')}\n\n`;
      d.activities.forEach((a) => {
        text += `- [${a.time}] ${a.title} (${a.duration}, Cost: ${a.estimatedCost})\n`;
        text += `  ${a.description}\n`;
        if (a.recommendedFood) text += `  Food: ${a.recommendedFood}\n`;
        if (a.insiderTip) text += `  Tip: ${a.insiderTip}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* City Overview Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-slate-900 rounded-3xl text-white p-6 sm:p-10 shadow-xl border border-stone-800 mb-8">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold tracking-wide">
                  <MapPin className="w-3.5 h-3.5" />
                  {itinerary.country}
                </span>
                {itinerary.preferences && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 text-xs font-medium">
                    {itinerary.preferences.style} • {itinerary.preferences.pace} Pace
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {itinerary.cityName}
              </h1>

              <p className="mt-2 text-base sm:text-lg text-sky-200 font-medium max-w-2xl">
                {itinerary.tagline}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onSaveToggle(itinerary)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Saved to Trips</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save Trip</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Plan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
            {itinerary.overview}
          </p>

          {/* Key Facts Strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Best Season</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                {itinerary.bestSeason}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold mb-1">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Currency</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {itinerary.localCurrency}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold mb-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Language</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {itinerary.language}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Trip Progress</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">
                {completedIds.size} / {totalActivities} checked off
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-20 bg-stone-50/90 backdrop-blur-md py-3 mb-6 border-b border-stone-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              All 3 Days
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('day-1')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'day-1'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Day 1
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('day-2')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'day-2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Day 2
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('day-3')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'day-3'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Day 3
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              City Guide & Packing
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            ← Plan another city
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'guide' ? (
        <CityGuideSection itinerary={itinerary} />
      ) : (
        <div className="space-y-2">
          {itinerary.days
            .filter((d) => {
              if (activeTab === 'all') return true;
              if (activeTab === 'day-1') return d.dayNumber === 1;
              if (activeTab === 'day-2') return d.dayNumber === 2;
              if (activeTab === 'day-3') return d.dayNumber === 3;
              return true;
            })
            .map((day, idx) => (
              <DaySection
                key={day.dayNumber}
                day={day}
                completedIds={completedIds}
                onToggleComplete={toggleComplete}
                dayIndex={idx}
              />
            ))}

          {activeTab === 'all' && (
            <div className="mt-8">
              <CityGuideSection itinerary={itinerary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
