import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, Loader2, X, Radio, Signal } from "lucide-react";
import { locations } from "../../data/mockRiskData";

interface GpsTrackerProps {
  onSelectLocation: (name: string) => void;
}

interface GpsState {
  loading: boolean;
  error: string | null;
  coords: { lat: number; lng: number } | null;
  nearestLocation: { name: string; distance: number; region: string } | null;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GpsTracker({ onSelectLocation }: GpsTrackerProps) {
  const [gpsState, setGpsState] = useState<GpsState>({
    loading: false,
    error: null,
    coords: null,
    nearestLocation: null,
  });
  const [showResult, setShowResult] = useState(false);

  const trackLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsState({
        loading: false,
        error: "Geolocation is not supported by your browser",
        coords: null,
        nearestLocation: null,
      });
      setShowResult(true);
      return;
    }

    setGpsState({ loading: true, error: null, coords: null, nearestLocation: null });
    setShowResult(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest monitored location
        let nearest = { name: "", distance: Infinity, region: "" };
        for (const loc of locations) {
          const dist = haversineDistance(latitude, longitude, loc.lat, loc.lng);
          if (dist < nearest.distance) {
            nearest = { name: loc.name, distance: dist, region: loc.region };
          }
        }

        setGpsState({
          loading: false,
          error: null,
          coords: { lat: latitude, lng: longitude },
          nearestLocation: nearest,
        });
        setShowResult(true);
      },
      (err) => {
        let errorMsg = "Unable to retrieve location";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable GPS access.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable";
            break;
          case err.TIMEOUT:
            errorMsg = "Location request timed out";
            break;
        }
        setGpsState({ loading: false, error: errorMsg, coords: null, nearestLocation: null });
        setShowResult(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const dismiss = () => {
    setShowResult(false);
    setGpsState({ loading: false, error: null, coords: null, nearestLocation: null });
  };

  return (
    <div className="relative">
      <button
        onClick={trackLocation}
        disabled={gpsState.loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] disabled:opacity-50"
        aria-label="Track my GPS location"
      >
        {gpsState.loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Navigation className="w-4 h-4" />
        )}
        <span>{gpsState.loading ? "Tracking..." : "Track My Location"}</span>
        <Signal className="w-3 h-3 opacity-50" />
      </button>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl p-4 border border-white/10 z-40 shadow-2xl"
          >
            <button
              onClick={dismiss}
              className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {gpsState.error ? (
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-red-500/20">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-red-300 font-medium">GPS Error</p>
                  <p className="text-xs text-gray-400 mt-1">{gpsState.error}</p>
                </div>
              </div>
            ) : gpsState.coords && gpsState.nearestLocation ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Navigation className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      GPS Locked
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {gpsState.coords.lat.toFixed(4)}°N, {gpsState.coords.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Nearest Monitoring Station
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {gpsState.nearestLocation.name}
                      </p>
                      <p className="text-xs text-gray-400">{gpsState.nearestLocation.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        {gpsState.nearestLocation.distance < 1
                          ? `${(gpsState.nearestLocation.distance * 1000).toFixed(0)} m`
                          : `${gpsState.nearestLocation.distance.toFixed(1)} km`}
                      </p>
                      <p className="text-[10px] text-gray-500">away</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectLocation(gpsState.nearestLocation!.name);
                    dismiss();
                  }}
                  className="w-full mt-3 px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Radio className="w-3 h-3" />
                  Analyze {gpsState.nearestLocation.name}
                </button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
