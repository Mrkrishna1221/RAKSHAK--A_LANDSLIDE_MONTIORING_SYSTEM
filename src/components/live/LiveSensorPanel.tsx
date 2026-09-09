import React from "react";
import { SensorReading } from "../../services/realTimeEngine";
import { Droplets, Thermometer, Waves, Gauge, Activity, Wind, Droplet, Zap } from "lucide-react";

interface LiveSensorPanelProps {
  reading: SensorReading;
}

export default function LiveSensorPanel({ reading }: LiveSensorPanelProps) {
  const sensors = [
    { icon: Droplets, label: "Rainfall", value: reading.rainfall.toFixed(1), unit: "mm/hr", color: "text-blue-400", bg: "bg-blue-500/10", threshold: 15, critical: 25 },
    { icon: Droplet, label: "Soil Moisture", value: reading.soilMoisture.toFixed(1), unit: "%", color: "text-cyan-400", bg: "bg-cyan-500/10", threshold: 75, critical: 90 },
    { icon: Activity, label: "Displacement", value: reading.groundDisplacement.toFixed(2), unit: "mm", color: "text-amber-400", bg: "bg-amber-500/10", threshold: 5, critical: 10 },
    { icon: Gauge, label: "Velocity", value: reading.velocity.toFixed(2), unit: "mm/day", color: "text-orange-400", bg: "bg-orange-500/10", threshold: 1.5, critical: 3 },
    { icon: Zap, label: "Acceleration", value: reading.acceleration.toFixed(3), unit: "mm/d²", color: "text-red-400", bg: "bg-red-500/10", threshold: 0.3, critical: 0.8 },
    { icon: Waves, label: "Pore Pressure", value: reading.porePressure.toFixed(1), unit: "kPa", color: "text-purple-400", bg: "bg-purple-500/10", threshold: 50, critical: 70 },
    { icon: Thermometer, label: "Temperature", value: reading.temperature.toFixed(1), unit: "°C", color: "text-rose-400", bg: "bg-rose-500/10", threshold: 35, critical: 40 },
    { icon: Wind, label: "Wind Speed", value: reading.windSpeed.toFixed(1), unit: "km/h", color: "text-teal-400", bg: "bg-teal-500/10", threshold: 30, critical: 50 },
  ];

  const getBarColor = (value: number, threshold: number, critical: number) => {
    if (value >= critical) return "bg-red-500";
    if (value >= threshold) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Live Sensors
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-gray-400">Quality: {reading.dataQuality.toFixed(0)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sensors.map((sensor, i) => {
          const Icon = sensor.icon;
          const numValue = parseFloat(sensor.value);
          const barWidth = Math.min(100, (numValue / sensor.critical) * 100);

          return (
            <div
              key={i}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${sensor.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${sensor.color}`} />
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {sensor.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-bold text-white">{sensor.value}</span>
                <span className="text-[10px] text-gray-500">{sensor.unit}</span>
              </div>
              <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(numValue, sensor.threshold, sensor.critical)}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
