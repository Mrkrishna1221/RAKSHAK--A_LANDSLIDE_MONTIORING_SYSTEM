import React from "react";

interface IndiaOverviewMapProps {
  selectedLocation?: string;
  onLocationSelect?: (location: string) => void;
}

const locations = [
  "Mussoorie",
  "Shimla",
  "Darjeeling",
  "Dehradun",
  "Kullu",
  "Gangtok",
  "Sikkim",
  "Arunachal Pradesh",
  "Assam",
  "Meghalaya",
  "Manipur",
  "Mizoram",
  "Nagaland",
  "Tripura",
];

const IndiaOverviewMap: React.FC<IndiaOverviewMapProps> = ({
  selectedLocation,
  onLocationSelect,
}) => {
  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f14] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            India Risk Overview
          </h2>

          <p className="text-xs text-gray-400">
            Select a location to view landslide risk
          </p>
        </div>

        <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
          ● Live Monitoring
        </div>
      </div>

      <div className="grid max-h-[360px] grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3 lg:grid-cols-4">
        {locations.map((location) => {
          const selected = selectedLocation === location;

          return (
            <button
              key={location}
              type="button"
              aria-pressed={selected}
              onClick={() => onLocationSelect?.(location)}
              className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                selected
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-lg shadow-cyan-400/10"
                  : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.08]"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    selected
                      ? "bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]"
                      : "bg-yellow-400"
                  }`}
                />

                <span className="truncate text-sm font-medium">
                  {location}
                </span>
              </div>

              <p
                className={`text-[11px] ${
                  selected ? "text-cyan-200/70" : "text-gray-500"
                }`}
              >
                Risk monitoring active
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { IndiaOverviewMap };
export default IndiaOverviewMap;