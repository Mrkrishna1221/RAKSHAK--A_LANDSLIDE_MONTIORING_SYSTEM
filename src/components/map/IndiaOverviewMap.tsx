import React from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Circle } from "react-leaflet";
import L from "leaflet";
import { locations, mockRiskData } from "../../data/mockRiskData";

const riskColors: Record<string, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  VERY_HIGH: "#ef4444",
};

function createLocationDot(color: string, name: string, risk: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="position: relative; cursor: pointer;">
      <div style="
        width: 14px;
        height: 14px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 12px ${color}, 0 0 24px ${color}40;
      "></div>
      <div style="
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 10px;
        font-weight: 600;
        color: white;
        background: rgba(10,10,11,0.85);
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid ${color}40;
        backdrop-filter: blur(4px);
      ">${name}</div>
    </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

// Simplified India boundary
const indiaBoundary = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "India" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [68.18, 23.69], [69.07, 22.45], [70.32, 21.56], [71.61, 20.87],
          [72.63, 20.42], [73.23, 19.45], [73.81, 18.52], [74.28, 17.45],
          [74.32, 16.21], [74.87, 15.12], [75.73, 14.21], [76.42, 13.12],
          [77.12, 12.32], [77.56, 11.52], [78.12, 10.45], [78.87, 9.22],
          [79.18, 8.45], [79.82, 8.92], [80.23, 9.87], [80.32, 10.32],
          [80.12, 11.21], [80.28, 12.56], [80.32, 13.45], [80.62, 14.21],
          [81.12, 15.32], [82.12, 16.45], [83.21, 17.32], [84.32, 18.21],
          [85.12, 19.12], [86.45, 19.87], [87.32, 20.87], [88.45, 21.65],
          [88.87, 22.45], [89.02, 23.12], [88.87, 24.21], [88.45, 25.12],
          [88.32, 26.32], [88.72, 27.12], [89.56, 28.12], [90.12, 28.65],
          [91.21, 29.12], [92.12, 28.65], [93.21, 28.32], [94.12, 28.45],
          [95.21, 28.12], [96.32, 28.45], [97.12, 28.12], [97.45, 27.65],
          [97.32, 27.12], [96.87, 26.45], [96.12, 25.87], [95.45, 25.32],
          [94.87, 24.87], [94.12, 24.32], [93.32, 23.87], [92.65, 23.12],
          [92.12, 22.65], [91.87, 22.12], [91.45, 21.87], [90.45, 21.65],
          [89.65, 21.45], [88.87, 21.65], [88.45, 21.45], [87.65, 21.56],
          [86.87, 21.12], [85.87, 20.65], [84.87, 19.87], [83.87, 18.87],
          [82.45, 17.65], [81.32, 16.54], [80.45, 15.87], [80.12, 14.65],
          [79.87, 13.87], [79.65, 12.87], [79.32, 11.45], [78.87, 10.32],
          [78.45, 9.45], [77.87, 8.32], [77.45, 8.12], [76.87, 8.45],
          [76.12, 9.12], [75.45, 10.21], [75.12, 11.12], [74.87, 11.87],
          [74.32, 12.65], [73.87, 13.45], [73.45, 14.32], [72.87, 15.45],
          [72.32, 16.32], [72.65, 17.45], [72.45, 18.32], [72.12, 19.12],
          [71.87, 20.32], [71.12, 20.87], [70.45, 21.45], [69.65, 22.12],
          [68.87, 23.12], [68.18, 23.69]
        ]]
      }
    }
  ]
};

// Himalayan landslide-prone zone (simplified polygon)
const himalayanZone = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Himalayan Landslide Zone" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [72.5, 30.0], [73.5, 31.0], [74.5, 32.0], [75.5, 32.5],
          [76.5, 32.8], [77.5, 32.5], [78.5, 32.0], [79.5, 31.5],
          [80.5, 31.0], [81.5, 30.5], [82.5, 30.2], [83.5, 30.0],
          [84.5, 29.5], [85.5, 29.0], [86.5, 28.5], [87.5, 28.0],
          [88.5, 27.5], [89.5, 28.0], [90.5, 28.5], [91.5, 28.5],
          [92.5, 28.0], [93.5, 27.8], [94.5, 28.0], [95.5, 27.8],
          [96.5, 28.0], [97.0, 27.5], [96.5, 27.0], [95.5, 26.5],
          [94.5, 26.5], [93.5, 26.8], [92.5, 27.0], [91.5, 27.0],
          [90.5, 27.0], [89.5, 26.5], [88.5, 26.5], [87.5, 26.5],
          [86.5, 26.8], [85.5, 27.0], [84.5, 27.5], [83.5, 27.8],
          [82.5, 28.0], [81.5, 28.5], [80.5, 29.0], [79.5, 29.5],
          [78.5, 30.0], [77.5, 30.5], [76.5, 30.8], [75.5, 30.5],
          [74.5, 30.2], [73.5, 30.0], [72.5, 30.0]
        ]]
      }
    }
  ]
};

export default function IndiaOverviewMap() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-white/5 relative">
      <MapContainer
        center={[24.0, 80.0]}
        zoom={5}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* India boundary */}
        <GeoJSON
          data={indiaBoundary}
          style={{
            color: "#3b82f6",
            weight: 1.5,
            opacity: 0.4,
            fillColor: "#1e3a5f",
            fillOpacity: 0.08,
          }}
        />

        {/* Himalayan landslide-prone zone */}
        <GeoJSON
          data={himalayanZone}
          style={{
            color: "#ef4444",
            weight: 1,
            opacity: 0.3,
            fillColor: "#ef4444",
            fillOpacity: 0.06,
            dashArray: "4, 4",
          }}
        />

        {/* Monitored locations */}
        {locations.map((loc) => {
          const data = mockRiskData[loc.name];
          if (!data) return null;
          const color = riskColors[data.riskLevel];

          return (
            <React.Fragment key={loc.name}>
              <Marker
                position={[loc.lat, loc.lng]}
                icon={createLocationDot(color, loc.name, data.riskLevel)}
              >
                <Popup>
                  <div className="text-gray-900">
                    <div className="font-semibold text-sm">{loc.name}</div>
                    <div className="text-xs text-gray-500">{loc.region}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: color }}
                      />
                      <span className="text-xs font-medium" style={{ color }}>
                        {data.probability}% — {data.riskLevel.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[loc.lat, loc.lng]}
                radius={50000}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.04,
                  weight: 0.5,
                  opacity: 0.2,
                  dashArray: "3, 3",
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Overlay labels */}
      <div className="absolute top-3 left-3 z-[1000] glass-strong rounded-md px-2.5 py-1.5 pointer-events-none">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">National Monitoring Network</div>
        <div className="text-xs text-gray-200 font-medium">India — {locations.length} Active Stations</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] glass-strong rounded-md px-2.5 py-2 pointer-events-none">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Risk Levels</div>
        <div className="space-y-1">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
              <span className="text-[10px] text-gray-300">{level.replace("_", " ")}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
            <div className="w-2.5 h-2.5 rounded-sm border border-red-500/40" style={{ background: "rgba(239,68,68,0.1)" }} />
            <span className="text-[10px] text-gray-300">Landslide Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
