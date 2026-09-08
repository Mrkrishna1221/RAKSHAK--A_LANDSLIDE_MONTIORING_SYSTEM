import React from "react";
import { useRealTimeData } from "../../hooks/useRealTimeData";
import { RiskData } from "../../data/mockRiskData";
import { TimeSeriesPoint } from "../../services/realTimeEngine";
import LiveRiskGauge from "./LiveRiskGauge";
import LiveSensorPanel from "./LiveSensorPanel";
import LiveFeatureImportance from "./LiveFeatureImportance";
import LivePredictionChart from "./LivePredictionChart";
import LiveAnomalyFeed from "./LiveAnomalyFeed";
import LiveModelMetrics from "./LiveModelMetrics";
import { Play, Pause, Activity, Radio } from "lucide-react";

interface LiveDashboardProps {
  baseData: RiskData;
}

export default function LiveDashboard({ baseData }: LiveDashboardProps) {
  const {
    currentReading,
    rainfallHistory,
    deformationHistory,
    anomalies,
    mlOutput,
    isRunning,
    toggle,
  } = useRealTimeData(baseData, 3000);

  if (!currentReading || !mlOutput) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Initializing real-time systems...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Live Risk Monitor</h2>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          )}
        </div>
        
        <button
          onClick={toggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isRunning
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
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

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Risk gauge and metrics */}
        <div className="space-y-6">
          <LiveRiskGauge mlOutput={mlOutput} />
          <LiveModelMetrics metrics={mlOutput.modelMetrics} />
        </div>

        {/* Middle column - Sensors and features */}
        <div className="space-y-6">
          <LiveSensorPanel reading={currentReading} />
          <LiveFeatureImportance features={mlOutput.featureImportance} />
        </div>

        {/* Right column - Predictions and anomalies */}
        <div className="space-y-6">
          <LivePredictionChart
            predictions={mlOutput.predictions24h}
            confidenceInterval={mlOutput.confidenceInterval}
          />
          <LiveAnomalyFeed anomalies={anomalies} />
        </div>
      </div>

      {/* Full-width charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Rainfall Time Series (24h)
          </h3>
          <div className="h-48">
            <RainfallChart data={rainfallHistory} />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Ground Deformation (24h)
          </h3>
          <div className="h-48">
            <DeformationChart data={deformationHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple chart components (you can replace with Chart.js or Recharts)
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
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
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
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
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
      />
    </svg>
  );
}
