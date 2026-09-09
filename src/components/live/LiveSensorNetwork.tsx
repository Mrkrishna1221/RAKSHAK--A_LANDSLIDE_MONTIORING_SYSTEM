import React from "react";
import { SensorStatus } from "../../services/realTimeEngine";
import { Wifi, WifiOff, Battery, Signal, MapPin } from "lucide-react";

interface LiveSensorNetworkProps {
  sensors: SensorStatus[];
}

export default function LiveSensorNetwork({ sensors }: LiveSensorNetworkProps) {
  const getStatusColor = (status: SensorStatus["status"]) => {
    switch (status) {
      case "ONLINE": return "text-green-400 bg-green-500/10 border-green-500/30";
      case "OFFLINE": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "DEGRADED": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "CALIBRATING": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    }
  };

  const getStatusIcon = (status: SensorStatus["status"]) => {
    switch (status) {
      case "ONLINE": return <Wifi className="w-3.5 h-3.5" />;
      case "OFFLINE": return <WifiOff className="w-3.5 h-3.5" />;
      case "DEGRADED": return <Wifi className="w-3.5 h-3.5" />;
      case "CALIBRATING": return <Signal className="w-3.5 h-3.5" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "rainfall": return "🌧️";
      case "moisture": return "💧";
      case "deformation": return "📡";
      case "pressure": return "🔵";
      case "weather": return "🌡️";
      default: return "📍";
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Sensor Network
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-gray-400">Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-gray-400">Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-gray-400">Offline</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className={`p-4 rounded-xl border transition-all ${getStatusColor(sensor.status)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(sensor.type)}</span>
                <div>
                  <div className="text-xs font-semibold text-white">{sensor.name}</div>
                  <div className="text-[10px] text-gray-400">{sensor.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(sensor.status)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Battery className="w-3 h-3" />
                  Battery
                </span>
                <span className="font-medium text-white">{sensor.battery.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    sensor.battery > 50 ? "bg-green-400" : sensor.battery > 20 ? "bg-yellow-400" : "bg-red-400"
                  }`}
                  style={{ width: `${sensor.battery}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  Signal
                </span>
                <span className="font-medium text-white">{sensor.signalStrength.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${sensor.signalStrength}%` }}
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-[10px] text-gray-500">
                Last reading: {new Date(sensor.lastReading).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
