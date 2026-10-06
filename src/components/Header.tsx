import React from 'react';
import { Compass, Bookmark, Printer, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onPrint?: () => void;
  hasItinerary: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  onPrint,
  hasItinerary,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 font-sans">
                CityWander
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md border border-sky-200">
                3-Day Plans
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Structured time-by-time city itineraries & local recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasItinerary && onPrint && (
            <button
              onClick={onPrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          )}

          <button
            onClick={onOpenSaved}
            type="button"
            className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>Saved Trips</span>
            {savedCount > 0 && (
              <span className="ml-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
