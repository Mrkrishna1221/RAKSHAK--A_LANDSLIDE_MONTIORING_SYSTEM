import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";

interface RiskMapProps {
  latitude: number;
  longitude: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  location: string;
}

const riskColors: Record<string, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  VERY_HIGH: "#ef4444",
};

function createCustomIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 18px;
      height: 18px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 16px ${color}, 0 0 32px ${color}40;
      animation: pulse 2s ease-in-out infinite;
    "></div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }
    </style>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function createSmallIcon(color: string, label?: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: 50%;
      opacity: 0.8;
      border: 1px solid rgba(255,255,255,0.4);
      box-shadow: 0 0 6px ${color};
    "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 12, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

// Nearby hazard markers relative to selected location
const nearbyMarkers = [
  { lat: 0.02, lng: 0.03, type: "landslide", label: "Past landslide zone" },
  { lat: -0.015, lng: 0.02, type: "deformation", label: "Deformation detected" },
  { lat: 0.01, lng: -0.025, type: "landslide", label: "Historical event site" },
  { lat: -0.03, lng: -0.01, type: "deformation", label: "Ground movement zone" },
  { lat: 0.025, lng: 0.015, type: "landslide", label: "Susceptible slope" },
  { lat: -0.02, lng: 0.035, type: "deformation", label: "InSAR anomaly" },
];

// India boundary GeoJSON (simplified)
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

export default function RiskMap({ latitude, longitude, riskLevel, location }: RiskMapProps) {
  const color = riskColors[riskLevel];
  const radius = riskLevel === "VERY_HIGH" ? 3000 : riskLevel === "HIGH" ? 2000 : riskLevel === "MODERATE" ? 1500 : 1000;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-white/5 relative">
      <MapContainer
        center={[latitude, longitude]}
        zoom={12}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
        minZoom={5}
        maxZoom={18}
      >
        {/* CartoDB Dark Matter - works great with dark theme and has excellent India coverage */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapUpdater lat={latitude} lng={longitude} />

        {/* India boundary outline */}
        <GeoJSON
          data={indiaBoundary}
          style={{
            color: "#3b82f6",
            weight: 1.5,
            opacity: 0.3,
            fillColor: "#1e3a5f",
            fillOpacity: 0.05,
            dashArray: "5, 5",
          }}
        />

        {/* Main location marker */}
        <Marker position={[latitude, longitude]} icon={createCustomIcon(color)}>
          <Popup>
            <div className="text-sm font-medium text-gray-900">{location}</div>
            <div className="text-xs text-gray-600">Risk: {riskLevel.replace("_", " ")}</div>
          </Popup>
        </Marker>

        {/* Risk zone circle */}
        <Circle
          center={[latitude, longitude]}
          radius={radius}
          pathOptions={{
            color: color,
            fillColor: color,
            fillOpacity: 0.08,
            weight: 1.5,
            opacity: 0.5,
            dashArray: "4, 4",
          }}
        />

        {/* Nearby hazard markers */}
        {nearbyMarkers.map((m, i) => (
          <Marker
            key={i}
            position={[latitude + m.lat, longitude + m.lng]}
            icon={createSmallIcon(m.type === "landslide" ? "#f97316" : "#3b82f6")}
          >
            <Popup>
              <div className="text-xs text-gray-900">
                <div className="font-semibold">{m.label}</div>
                <div className="text-gray-500 mt-0.5">
                  {m.type === "landslide" ? "Historical landslide evidence" : "Satellite-detected deformation"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map overlay info */}
      <div className="absolute top-3 left-3 z-[1000] glass-strong rounded-md px-2.5 py-1.5 pointer-events-none">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">India — {location}</div>
        <div className="text-xs text-gray-200 font-medium">{latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] glass-strong rounded-md px-2.5 py-2 pointer-events-none">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
            <span className="text-[10px] text-gray-300">Selected Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] text-gray-300">Historical Landslide</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] text-gray-300">Deformation Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
