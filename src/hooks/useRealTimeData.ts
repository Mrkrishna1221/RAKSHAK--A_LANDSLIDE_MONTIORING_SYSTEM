import { useState, useEffect, useCallback } from "react";
import { RiskData } from "../data/mockRiskData";
import { getEngine, ProfessionalRealTimeEngine, SensorReading, TimeSeriesPoint, Anomaly, SensorStatus } from "../services/realTimeEngine";
import { getMLEngine, MLEngine, ModelOutput } from "../services/mlEngine";

export interface RealTimeState {
  currentReading: SensorReading | null;
  rainfallHistory: TimeSeriesPoint[];
  deformationHistory: TimeSeriesPoint[];
  riskHistory: TimeSeriesPoint[];
  anomalies: Anomaly[];
  sensorStatuses: SensorStatus[];
  mlOutput: ModelOutput | null;
  isRunning: boolean;
}

export function useRealTimeData(baseData: RiskData, updateInterval = 3000) {
  const [state, setState] = useState<RealTimeState>({
    currentReading: null,
    rainfallHistory: [],
    deformationHistory: [],
    riskHistory: [],
    anomalies: [],
    sensorStatuses: [],
    mlOutput: null,
    isRunning: false,
  });

  const [engine, setEngine] = useState<ProfessionalRealTimeEngine | null>(null);
  const [mlEngine, setMLEngine] = useState<MLEngine | null>(null);

  // Initialize engines
  useEffect(() => {
    const rtEngine = getEngine(baseData.location, baseData);
    const ml = getMLEngine(baseData);
    
    setEngine(rtEngine);
    setMLEngine(ml);

    // Initial state
    rtEngine.tick_update();
    const reading = rtEngine.getCurrentReading();
    if (reading) {
      const output = ml.computeRisk(reading);
      setState({
        currentReading: reading,
        rainfallHistory: rtEngine.getRainfallHistory(),
        deformationHistory: rtEngine.getDeformationHistory(),
        riskHistory: rtEngine.getRiskHistory(),
        anomalies: rtEngine.getAnomalies(),
        sensorStatuses: rtEngine.getSensorStatuses(),
        mlOutput: output,
        isRunning: false,
      });
    }

    return () => {
      rtEngine.stop();
    };
  }, [baseData]);

  // Subscribe to updates
  useEffect(() => {
    if (!engine || !mlEngine) return;

    const unsubscribe = engine.subscribe(() => {
      const reading = engine.getCurrentReading();
      if (reading) {
        const output = mlEngine.computeRisk(reading);
        setState({
          currentReading: reading,
          rainfallHistory: engine.getRainfallHistory(),
          deformationHistory: engine.getDeformationHistory(),
          riskHistory: engine.getRiskHistory(),
          anomalies: engine.getAnomalies(),
          sensorStatuses: engine.getSensorStatuses(),
          mlOutput: output,
          isRunning: true,
        });
      }
    });

    return unsubscribe;
  }, [engine, mlEngine]);

  const start = useCallback(() => {
    if (engine) {
      engine.start(updateInterval);
      setState((s) => ({ ...s, isRunning: true }));
    }
  }, [engine, updateInterval]);

  const stop = useCallback(() => {
    if (engine) {
      engine.stop();
      setState((s) => ({ ...s, isRunning: false }));
    }
  }, [engine]);

  const toggle = useCallback(() => {
    if (state.isRunning) {
      stop();
    } else {
      start();
    }
  }, [state.isRunning, start, stop]);

  return {
    ...state,
    start,
    stop,
    toggle,
  };
}
