import React from "react";
import { useRealTimeData } from "../../hooks/useRealTimeData";
import { RiskData } from "../../data/mockRiskData";
import { TimeSeriesPoint, SensorStatus } from "../../services/realTimeEngine";
import LiveRiskGauge from "./LiveRiskGauge";
import LiveSensorPanel from "./LiveSensorPanel";
import LiveFeatureImportance from "./LiveFeatureImportance";
import LivePredictionChart from "./LivePredictionChart";
import LiveAnomalyFeed from "./LiveAnomalyFeed";
import LiveModelMetrics from "./LiveModelMetrics";
import LiveSensorNetwork from "./LiveSensorNetwork";
import { Play, Pause, Activity, Radio, Wifi, WifiOff, Zap, TrendingUp } from "lucide-react";

interface LiveDashboardProps {
  baseData: RiskData;
}

export default function LiveDashboard({ baseData }: LiveDashboardProps) {
  const {
    currentReading,
    rainfallHistory,
    deformationHistory,
    anomalies,
    sensorStatuses,
    mlOutput,
    isRunning,
    toggle,
  } = useRealTimeData(baseData, 3000);

  if (!currentReading || !mlOutput) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Initializing real-time monitoring systems...
        </div>
      </div>
    );
  }

  const onlineSensors = sensorStatuses.filter(s => s.status === "ONLINE").length;
  const totalSensors = sensorStatuses.length;
  const avgBattery = sensorStatuses.reduce((s, x) => s + x.battery, 0) / totalSensors;
  const avgSignal = sensorStatuses.reduce((s, x) => s + x.signalStrength, 0) / totalSensors;

  return (
    <div className="space-y-6">
      {/* Header with controls and status */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                <Activity className="w-7 h-7 text-blue-400" />
              </div>
              {isRunning && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Real-Time Monitoring</h2>
              <p className="text-sm text-gray-400">
                {baseData.location} • {baseData.latitude.toFixed(4)}°N, {baseData.longitude.toFixed(4)}°E
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System status */}
            <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">
                  <span className="font-semibold text-green-400">{onlineSensors}</span>/{totalSensors} Online
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">
                  <span className="font-semibold text-yellow-400">{avgBattery.toFixed(0)}%</span> Battery
                </span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">
                  <span className="font-semibold text-blue-400">{avgSignal.toFixed(0)}%</span> Signal
                </span>
              </div>
            </div>

            {/* Live indicator */}
            {isRunning && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-xs text-green-400 font-semibold">LIVE</span>
              </div>
            )}

            {/* Control button */}
            <button
              onClick={toggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                isRunning
                  ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Live Feed
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Risk gauge and metrics */}
        <div className="lg:col-span-4 space-y-6">
          <LiveRiskGauge mlOutput={mlOutput} />
          <LiveModelMetrics metrics={mlOutput.modelMetrics} />
        </div>

        {/* Middle column - Sensors and features */}
        <div className="lg:col-span-4 space-y-6">
          <LiveSensorPanel reading={currentReading} />
          <LiveFeatureImportance features={mlOutput.featureImportance} />
        </div>

        {/* Right column - Predictions and anomalies */}
        <div className="lg:col-span-4 space-y-6">
          <LivePredictionChart
            predictions={mlOutput.predictions24h}
            confidenceInterval={mlOutput.confidenceInterval}
          />
          <LiveAnomalyFeed anomalies={anomalies} />
        </div>
      </div>

      {/* Full-width sensor network */}
      <LiveSensorNetwork sensors={sensorStatuses} />

      {/* Time series charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Rainfall Time Series (48h)
            </h3>
            <span className="text-xs text-gray-500">
              Last: {currentReading.rainfall.toFixed(1)} mm/hr
            </span>
          </div>
          <div className="h-48">
            <RainfallChart data={rainfallHistory} />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Ground Deformation (48h)
            </h3>
            <span className="text-xs text-gray-500">
              Last: {currentReading.groundDisplacement.toFixed(2)} mm
            </span>
          </div>
          <div className="h-48">
            <DeformationChart data={deformationHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced chart components
function RainfallChart({ data }: { data: TimeSeriesPoint[] }) {
  if (data.length === 0) return <div className="text-gray-500 text-sm">No data</div>;

  const max = Math.max(...data.map((d) => d.value));
  const width = 100;
  const height = 100;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.value / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#rainGradient)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
        filter="url(#glow)"
      />
    </svg>
  );
}

function DeformationChart({ data }: { data: TimeSeriesPoint[] }) {
  if (data.length === 0) return <div className="text-gray-500 text-sm">No data</div>;

  const max = Math.max(...data.map((d) => d.value));
  const width = 100;
  const height = 100;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.value / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="defGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#defGradient)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
        filter="url(#glow2)"
      />
    </svg>
  );
}
