import React from "react";
import { useInView } from "../../hooks/useAnimations";
import { History, MapPin, Calendar, AlertTriangle } from "lucide-react";

const historicalEvents = [
  { year: 2023, location: "Kedarnath corridor", magnitude: "Major", casualties: "Multiple", trigger: "Extreme rainfall" },
  { year: 2021, location: "Chamoli, Uttarakhand", magnitude: "Major", casualties: "Significant", trigger: "Glacial lake outburst + rainfall" },
  { year: 2019, location: "Wayanad, Kerala", magnitude: "Severe", casualties: "Multiple", trigger: "Heavy monsoon rainfall" },
  { year: 2017, location: "Malpa, Uttarakhand", magnitude: "Moderate", casualties: "Few", trigger: "Rainfall + seismic activity" },
  { year: 2014, location: "Himachal Pradesh", magnitude: "Severe", casualties: "Significant", trigger: "Prolonged rainfall" },
  { year: 2013, location: "Uttarakhand", magnitude: "Catastrophic", casualties: "Thousands", trigger: "Cloud burst + glacial melt" },
];

export default function HistoricalLandslides() {
  const { ref, isInView } = useInView(0.1);

  return (
    <div ref={ref} className="glass rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
          Historical Landslide Events
        </h3>
      </div>

      <p className="text-sm text-gray-400 mb-5">
        Past landslide events inform susceptibility models. Regions with recurring events receive higher baseline risk scores.
      </p>

      <div className="space-y-2">
        {historicalEvents.map((event, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease",
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-sm font-bold text-gray-200">{event.year}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-200 truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className={`px-1.5 py-0.5 rounded ${
                  event.magnitude === "Catastrophic" ? "bg-red-500/10 text-red-400" :
                  event.magnitude === "Severe" ? "bg-orange-500/10 text-orange-400" :
                  event.magnitude === "Major" ? "bg-amber-500/10 text-amber-400" :
                  "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {event.magnitude}
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {event.trigger}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Data sourced from national landslide databases. Historical events are used as training features for susceptibility models — not as direct predictions.
      </p>
    </div>
  );
}
