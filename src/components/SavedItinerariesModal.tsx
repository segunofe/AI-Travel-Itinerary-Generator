import React from 'react';
import { X, Trash2, Calendar, MapPin, ArrowRight, Bookmark } from 'lucide-react';
import { Itinerary } from '../types/itinerary.ts';

interface SavedItinerariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: Itinerary[];
  onSelectTrip: (trip: Itinerary) => void;
  onDeleteTrip: (cityName: string) => void;
}

export const SavedItinerariesModal: React.FC<SavedItinerariesModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Your Saved 3-Day Itineraries</h2>
              <p className="text-xs text-stone-500">
                {savedTrips.length} {savedTrips.length === 1 ? 'trip' : 'trips'} saved on this device
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              <p className="font-semibold text-stone-600 mb-1">No saved itineraries yet</p>
              <p className="text-xs">Generate a 3-day itinerary and click "Save Trip" to keep it here.</p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.cityName}
                className="group p-4 rounded-2xl border border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-base text-stone-900 truncate">
                      {trip.cityName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium shrink-0">
                      {trip.country}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 mb-1">
                    {trip.tagline}
                  </p>
                  <div className="text-[11px] text-stone-400 flex items-center gap-2">
                    <span>3 Days • {trip.days.reduce((acc, d) => acc + d.activities.length, 0)} Stops</span>
                    {trip.preferences && <span>• {trip.preferences.style}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTrip(trip.cityName)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
