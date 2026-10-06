import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, X } from 'lucide-react';
import { GenerationRequest } from '../types/itinerary.ts';

interface CitySearchHeroProps {
  onGenerate: (req: GenerationRequest) => void;
  isLoading: boolean;
  currentCity?: string;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', emoji: '🗼' },
  { name: 'Paris', country: 'France', emoji: '🥐' },
  { name: 'Rome', country: 'Italy', emoji: '🏛️' },
  { name: 'Barcelona', country: 'Spain', emoji: '🏖️' },
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️' },
  { name: 'New York', country: 'USA', emoji: '🗽' },
  { name: 'Amsterdam', country: 'Netherlands', emoji: '🚲' },
  { name: 'Bangkok', country: 'Thailand', emoji: '🍜' },
];

const TRAVEL_STYLES = [
  'Balanced Highlights',
  'Culture & History',
  'Foodie & Culinary',
  'Relaxed & Scenic',
  'Budget Explorer',
  'Nightlife & Modern',
];

const PACES = [
  { label: 'Moderate', desc: '4 curated stops/day' },
  { label: 'Relaxed', desc: 'Leisurely pace' },
  { label: 'Action-Packed', desc: 'Maximum sights' },
];

const COMPANIONS = ['Solo Traveler', 'Couple', 'Family', 'Friends'];

export const CitySearchHero: React.FC<CitySearchHeroProps> = ({
  onGenerate,
  isLoading,
  currentCity = '',
}) => {
  const [cityInput, setCityInput] = useState(currentCity);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('Balanced Highlights');
  const [selectedPace, setSelectedPace] = useState('Moderate');
  const [selectedCompanion, setSelectedCompanion] = useState('Solo Traveler');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim() || isLoading) return;
    onGenerate({
      city: cityInput.trim(),
      style: selectedStyle,
      pace: selectedPace,
      companion: selectedCompanion,
    });
  };

  const handleCityChipClick = (cityName: string) => {
    setCityInput(cityName);
    onGenerate({
      city: cityName,
      style: selectedStyle,
      pace: selectedPace,
      companion: selectedCompanion,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-stone-50/50 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-sky-200/50 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-200/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-900 border border-sky-200/80 text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Curated Day-by-Day, Time-by-Time Schedules</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
          Where would you like to spend{' '}
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
            3 days?
          </span>
        </h1>

        <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Type any destination to generate a realistic, structured 3-day itinerary with exact morning, afternoon, and evening time slots, curated spots, and local tips.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-2xl shadow-lg shadow-stone-200/60 border border-stone-200 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all">
            <div className="relative flex-1 flex items-center pl-3">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter any city name (e.g. Kyoto, Barcelona, Cape Town)..."
                disabled={isLoading}
                className="w-full pl-3 pr-8 py-2.5 text-stone-900 text-base placeholder:text-stone-400 bg-transparent focus:outline-none"
              />
              {cityInput && (
                <button
                  type="button"
                  onClick={() => setCityInput('')}
                  className="absolute right-2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  showFilters
                    ? 'bg-stone-100 border-stone-300 text-stone-900'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                title="Customize style, pace & travel companions"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preferences</span>
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                type="submit"
                disabled={isLoading || !cityInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Preferences Bar */}
          {showFilters && (
            <div className="mt-3 p-4 bg-white/95 rounded-2xl border border-stone-200 shadow-sm text-left transition-all space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Travel Vibe
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TRAVEL_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        selectedStyle === style
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Daily Pace
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PACES.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setSelectedPace(p.label)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs text-center border transition-all cursor-pointer ${
                          selectedPace === p.label
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 font-medium'
                        }`}
                      >
                        <div>{p.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Traveling With
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {COMPANIONS.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setSelectedCompanion(comp)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs text-center border transition-all cursor-pointer ${
                          selectedCompanion === comp
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-semibold'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 font-medium'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Quick Popular City Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-xs font-medium text-stone-400 mr-1">Popular:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              disabled={isLoading}
              onClick={() => handleCityChipClick(c.name)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-sky-50 text-stone-700 hover:text-sky-700 rounded-full text-xs font-medium border border-stone-200 hover:border-sky-300 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
