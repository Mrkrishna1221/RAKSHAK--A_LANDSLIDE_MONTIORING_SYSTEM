import React from "react";
import { SensorReading } from "../../services/realTimeEngine";
import { Droplets, Thermometer, Waves, Gauge, Activity } from "lucide-react";

interface LiveSensorPanelProps {
  reading: SensorReading;
}

export default function LiveSensorPanel({ reading }: LiveSensorPanelProps) {
  const sensors = [
    { icon: Droplets, label: "Rainfall", value: reading.rainfall.toFixed(1), unit: "mm/hr", color: "text-blue-400" },
    { icon: Waves, label: "Soil Moisture", value: reading.soilMoisture.toFixed(1), unit: "%", color: "text-cyan-400" },
    { icon: Activity, label: "Displacement", value: reading.groundDisplacement.toFixed(2), unit: "mm", color: "text-amber-400" },
    { icon: Gauge, label: "Velocity", value: reading.velocity.toFixed(2), unit: "mm/day", color: "text-orange-400" },
    { icon: Thermometer, label: "Temperature", value: reading.temperature.toFixed(1), unit: "°C", color: "text-red-400" },
    { icon: Waves, label: "Pore Pressure", value: reading.porePressure.toFixed(1), unit: "kPa", color: "text-purple-400" },
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Live Sensor Readings</h3>
      <div className="grid grid-cols-2 gap-3">
        {sensors.map((sensor, i) => {
          const Icon = sensor.icon;
          return (
            <div key={i} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${sensor.color}`} />
                <span className="text-xs text-gray-400">{sensor.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">{sensor.value}</span>
                <span className="text-xs text-gray-500">{sensor.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
