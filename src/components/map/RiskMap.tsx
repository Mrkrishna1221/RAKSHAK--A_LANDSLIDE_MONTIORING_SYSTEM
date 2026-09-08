import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
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
      width: 16px;
      height: 16px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 12px ${color};
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function createSmallIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      opacity: 0.7;
      border: 1px solid rgba(255,255,255,0.3);
    "></div>`,
    iconSize: [8, 8],
    iconAnchor: [4, 4],
  });
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 12, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

const nearbyMarkers = [
  { lat: 0.02, lng: 0.03, type: "landslide" },
  { lat: -0.015, lng: 0.02, type: "deformation" },
  { lat: 0.01, lng: -0.025, type: "landslide" },
  { lat: -0.03, lng: -0.01, type: "deformation" },
  { lat: 0.025, lng: 0.015, type: "landslide" },
];

export default function RiskMap({ latitude, longitude, riskLevel, location }: RiskMapProps) {
  const color = riskColors[riskLevel];
  const radius = riskLevel === "VERY_HIGH" ? 3000 : riskLevel === "HIGH" ? 2000 : riskLevel === "MODERATE" ? 1500 : 1000;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-white/5">
      <MapContainer
        center={[latitude, longitude]}
        zoom={12}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapUpdater lat={latitude} lng={longitude} />
        <Marker position={[latitude, longitude]} icon={createCustomIcon(color)}>
          <Popup>
            <div className="text-sm font-medium">{location}</div>
            <div className="text-xs text-gray-500">Risk: {riskLevel.replace("_", " ")}</div>
          </Popup>
        </Marker>
        <Circle
          center={[latitude, longitude]}
          radius={radius}
          pathOptions={{
            color: color,
            fillColor: color,
            fillOpacity: 0.08,
            weight: 1,
            opacity: 0.4,
          }}
        />
        {nearbyMarkers.map((m, i) => (
          <Marker
            key={i}
            position={[latitude + m.lat, longitude + m.lng]}
            icon={createSmallIcon(m.type === "landslide" ? "#f97316" : "#3b82f6")}
          >
            <Popup>
              <div className="text-xs">
                {m.type === "landslide" ? "Historical Landslide" : "Deformation Zone"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
