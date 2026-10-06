import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { CitySearchHero } from './components/CitySearchHero.tsx';
import { ItineraryDisplay } from './components/ItineraryDisplay.tsx';
import { LoadingState } from './components/LoadingState.tsx';
import { SavedItinerariesModal } from './components/SavedItinerariesModal.tsx';
import { Itinerary, GenerationRequest } from './types/itinerary.ts';
import { Compass, AlertCircle, RefreshCw, Sparkles, MapPin, ArrowRight } from 'lucide-react';

const FEATURED_CITIES = [
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    tag: 'Neon Vistas & Ancient Shrines',
    description: 'From Shibuya crossing to historic Asakusa and peaceful Meiji Jingu.'
  },
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    tag: 'Art, Cafes & Grand Boulevards',
    description: 'Iconic Eiffel views, Louvre masterpieces, and bohemian Montmartre.'
  },
  {
    city: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    tag: 'Ancient Wonders & Piazza Life',
    description: 'The Colosseum, Trevi fountain wishes, and Trastevere culinary strolls.'
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
    tag: 'Gaudí Architecture & Mediterranean Sea',
    description: 'Sagrada Família marvels, Gothic Quarter lanes, and tapas by the beach.'
  }
];

export default function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCity, setLastCity] = useState('');
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Load saved trips from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('citywander_saved_trips');
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read saved trips:', e);
    }
  }, []);

  // Save trips to localStorage helper
  const updateSavedTrips = (trips: Itinerary[]) => {
    setSavedTrips(trips);
    try {
      localStorage.setItem('citywander_saved_trips', JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips:', e);
    }
  };

  const handleGenerate = async (req: GenerationRequest) => {
    setIsLoading(true);
    setError(null);
    setLastCity(req.city);

    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: Itinerary = await res.json();
      setItinerary(data);

      // Scroll smoothly to results
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating plan:', err);
      setError(err.message || 'Unable to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToggle = (target: Itinerary) => {
    const exists = savedTrips.some((t) => t.cityName.toLowerCase() === target.cityName.toLowerCase());
    let next: Itinerary[];
    if (exists) {
      next = savedTrips.filter((t) => t.cityName.toLowerCase() !== target.cityName.toLowerCase());
    } else {
      next = [target, ...savedTrips];
    }
    updateSavedTrips(next);
  };

  const handleDeleteTrip = (cityName: string) => {
    const next = savedTrips.filter((t) => t.cityName.toLowerCase() !== cityName.toLowerCase());
    updateSavedTrips(next);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCurrentSaved = !!(
    itinerary &&
    savedTrips.some((t) => t.cityName.toLowerCase() === itinerary.cityName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-sky-200">
      {/* App Header */}
      <Header
        savedCount={savedTrips.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onPrint={handlePrint}
        hasItinerary={!!itinerary}
      />

      <main className="flex-1">
        {/* City Input & Preferences Hero */}
        <CitySearchHero
          onGenerate={handleGenerate}
          isLoading={isLoading}
          currentCity={itinerary?.cityName || lastCity}
        />

        {/* Loading Indicator */}
        {isLoading && <LoadingState city={lastCity} />}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <span className="font-bold block mb-1">Failed to generate plan</span>
                <span>{error}</span>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => handleGenerate({ city: lastCity })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white font-medium text-xs rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try again</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Display */}
        {itinerary && !isLoading && (
          <div id="itinerary-results">
            <ItineraryDisplay
              itinerary={itinerary}
              isSaved={isCurrentSaved}
              onSaveToggle={handleSaveToggle}
              onPrint={handlePrint}
              onReset={() => {
                setItinerary(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Initial Empty State / Featured Destinations */}
        {!itinerary && !isLoading && !error && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Featured 3-Day Destinations
              </h2>
              <p className="mt-2 text-stone-500 text-sm">
                Click any city card below to instantly generate a full 3-day travel itinerary with day-by-day schedules, time badges, and dining spots.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_CITIES.map((dest) => (
                <div
                  key={dest.city}
                  onClick={() => handleGenerate({ city: dest.city })}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-sky-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 block mb-0.5">
                        {dest.country}
                      </span>
                      <h3 className="text-xl font-black text-white">
                        {dest.city}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-700 mb-1">
                        {dest.tag}
                      </p>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                      <span>Explore 3-Day Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-stone-800">CityWander</span>
            <span>— Smart 3-Day Travel Itineraries</span>
          </div>
          <p className="text-stone-400">
            Crafted with structured schedules, time slots & local recommendations.
          </p>
        </div>
      </footer>

      {/* Saved Itineraries Drawer / Modal */}
      <SavedItinerariesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(selected) => {
          setItinerary(selected);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        onDeleteTrip={handleDeleteTrip}
      />
    </div>
  );
}
