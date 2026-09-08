/**
 * Real-Time Data Engine
 * Simulates live sensor feeds with realistic patterns, noise, and correlations
 * Models actual geophysical behavior for landslide prediction
 */

import { RiskData } from "../data/mockRiskData";

export interface SensorReading {
  timestamp: number;
  rainfall: number; // mm/hr
  soilMoisture: number; // %
  groundDisplacement: number; // mm
  velocity: number; // mm/day
  temperature: number; // °C
  porePressure: number; // kPa
  vibration: number; // mm/s
}

export interface TimeSeriesPoint {
  time: number;
  value: number;
  predicted?: number;
  upperBound?: number;
  lowerBound?: number;
}

export interface Anomaly {
  id: string;
  type: "RAINFALL_SPIKE" | "DEFORMATION_ACCELERATION" | "MOISTURE_SURGE" | "VIBRATION";
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  timestamp: number;
  description: string;
  value: number;
  threshold: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  aucRoc: number;
  confidence: number;
  lastTrained: number;
  trainingSamples: number;
}

class RealTimeEngine {
  private baseData: RiskData;
  private sensors: SensorReading[] = [];
  private rainfallHistory: TimeSeriesPoint[] = [];
  private deformationHistory: TimeSeriesPoint[] = [];
  private riskHistory: TimeSeriesPoint[] = [];
  private anomalies: Anomaly[] = [];
  private listeners: Set<() => void> = new Set();
  private intervalId: number | null = null;
  private tick = 0;
  private lastRainfallAccumulator = 0;
  private noiseSeed = Math.random() * 1000;

  constructor(baseData: RiskData) {
    this.baseData = baseData;
    this.initializeHistory();
  }

  private gaussianNoise(mean = 0, stdDev = 1): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }

  private perlinNoise(t: number, seed: number): number {
    // Simplified Perlin-like noise
    const x = Math.sin(t * 0.1 + seed) * 0.5 +
              Math.sin(t * 0.23 + seed * 1.3) * 0.3 +
              Math.sin(t * 0.47 + seed * 2.1) * 0.2;
    return x;
  }

  private initializeHistory(): void {
    const now = Date.now();
    const hours = 24;

    // Generate historical rainfall data
    for (let i = hours * 4; i >= 0; i--) {
      const time = now - i * 15 * 60 * 1000; // 15-min intervals
      const hourOfDay = new Date(time).getHours();
      
      // Realistic rainfall pattern: more rain in afternoon/evening
      const diurnalFactor = 1 + 0.3 * Math.sin((hourOfDay - 6) * Math.PI / 12);
      const baseRain = this.baseData.rainfall.oneHour * 0.3;
      const rain = Math.max(0, baseRain * diurnalFactor + this.gaussianNoise(0, baseRain * 0.2));
      
      this.rainfallHistory.push({
        time,
        value: rain,
      });
    }

    // Generate historical deformation data
    for (let i = hours * 4; i >= 0; i--) {
      const time = now - i * 15 * 60 * 1000;
      const progress = i / (hours * 4);
      
      // Deformation trend: accelerating over time based on risk level
      const trendMultiplier = this.baseData.riskLevel === "VERY_HIGH" ? 2.5 :
                             this.baseData.riskLevel === "HIGH" ? 1.8 :
                             this.baseData.riskLevel === "MODERATE" ? 1.2 : 0.8;
      
      const baseDeformation = this.baseData.deformation.current * (1 - progress * 0.3);
      const deformation = baseDeformation + this.gaussianNoise(0, 0.5) * trendMultiplier;
      
      this.deformationHistory.push({
        time,
        value: Math.max(0, deformation),
      });
    }

    // Generate risk history
    for (let i = hours * 4; i >= 0; i--) {
      const time = now - i * 15 * 60 * 1000;
      const progress = i / (hours * 4);
      
      const baseRisk = this.baseData.probability * (1 - progress * 0.15);
      const risk = Math.max(0, Math.min(100, baseRisk + this.gaussianNoise(0, 2)));
      
      this.riskHistory.push({
        time,
        value: risk,
      });
    }
  }

  private generateSensorReading(): SensorReading {
    const now = Date.now();
    const hourOfDay = new Date(now).getHours();
    
    // Realistic sensor correlations
    const rainIntensity = this.baseData.rainfall.oneHour * 
      (0.7 + 0.3 * Math.sin(hourOfDay * Math.PI / 12)) *
      (1 + this.perlinNoise(this.tick * 0.1, this.noiseSeed) * 0.4);
    
    const soilMoisture = Math.min(100, 
      this.baseData.terrain.elevation * 0.02 + 
      rainIntensity * 2 + 
      this.gaussianNoise(0, 3)
    );

    const groundDisplacement = this.baseData.deformation.current + 
      this.gaussianNoise(0, 0.3) +
      this.perlinNoise(this.tick * 0.05, this.noiseSeed + 1) * 0.5;

    const velocity = this.baseData.deformation.velocity + 
      this.gaussianNoise(0, 0.1) +
      (this.tick % 20 === 0 ? Math.random() * 0.3 : 0);

    const temperature = 15 + 10 * Math.sin(hourOfDay * Math.PI / 12) + 
      this.gaussianNoise(0, 0.5);

    const porePressure = soilMoisture * 0.8 + this.gaussianNoise(0, 2);
    
    const vibration = Math.max(0, 
      0.02 + rainIntensity * 0.01 + this.gaussianNoise(0, 0.01)
    );

    return {
      timestamp: now,
      rainfall: Math.max(0, rainIntensity),
      soilMoisture: Math.max(0, Math.min(100, soilMoisture)),
      groundDisplacement: Math.max(0, groundDisplacement),
      velocity: Math.max(0, velocity),
      temperature,
      porePressure: Math.max(0, porePressure),
      vibration: Math.max(0, vibration),
    };
  }

  private detectAnomalies(reading: SensorReading): void {
    const now = Date.now();

    // Rainfall spike detection
    if (reading.rainfall > this.baseData.rainfall.oneHour * 2.5) {
      this.anomalies.push({
        id: `rain-${now}`,
        type: "RAINFALL_SPIKE",
        severity: reading.rainfall > this.baseData.rainfall.oneHour * 4 ? "CRITICAL" : "HIGH",
        timestamp: now,
        description: `Rainfall intensity ${reading.rainfall.toFixed(1)} mm/hr exceeds 24h average by ${(reading.rainfall / this.baseData.rainfall.oneHour * 100 - 100).toFixed(0)}%`,
        value: reading.rainfall,
        threshold: this.baseData.rainfall.oneHour * 2.5,
      });
    }

    // Deformation acceleration
    if (reading.velocity > this.baseData.deformation.velocity * 1.8) {
      this.anomalies.push({
        id: `def-${now}`,
        type: "DEFORMATION_ACCELERATION",
        severity: reading.velocity > this.baseData.deformation.velocity * 3 ? "CRITICAL" : "HIGH",
        timestamp: now,
        description: `Ground velocity ${reading.velocity.toFixed(2)} mm/day — acceleration detected`,
        value: reading.velocity,
        threshold: this.baseData.deformation.velocity * 1.8,
      });
    }

    // Soil moisture surge
    if (reading.soilMoisture > 85) {
      this.anomalies.push({
        id: `moist-${now}`,
        type: "MOISTURE_SURGE",
        severity: reading.soilMoisture > 95 ? "HIGH" : "MODERATE",
        timestamp: now,
        description: `Soil saturation at ${reading.soilMoisture.toFixed(1)}% — critical threshold approaching`,
        value: reading.soilMoisture,
        threshold: 85,
      });
    }

    // Keep only last 20 anomalies
    if (this.anomalies.length > 20) {
      this.anomalies = this.anomalies.slice(-20);
    }
  }

  private updateHistory(reading: SensorReading): void {
    const now = Date.now();

    this.rainfallHistory.push({ time: now, value: reading.rainfall });
    this.deformationHistory.push({ time: now, value: reading.groundDisplacement });

    // Keep last 96 points (24 hours at 15-min intervals)
    if (this.rainfallHistory.length > 96) this.rainfallHistory.shift();
    if (this.deformationHistory.length > 96) this.deformationHistory.shift();
  }

  tick_update(): void {
    this.tick++;
    const reading = this.generateSensorReading();
    this.sensors.push(reading);
    
    // Keep last 100 readings
    if (this.sensors.length > 100) this.sensors.shift();

    this.detectAnomalies(reading);
    this.updateHistory(reading);

    // Notify listeners
    this.listeners.forEach((fn) => fn());
  }

  start(intervalMs = 3000): void {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(() => this.tick_update(), intervalMs);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getCurrentReading(): SensorReading | null {
    return this.sensors[this.sensors.length - 1] || null;
  }

  getRainfallHistory(): TimeSeriesPoint[] {
    return [...this.rainfallHistory];
  }

  getDeformationHistory(): TimeSeriesPoint[] {
    return [...this.deformationHistory];
  }

  getRiskHistory(): TimeSeriesPoint[] {
    return [...this.riskHistory];
  }

  getAnomalies(): Anomaly[] {
    return [...this.anomalies];
  }

  getSensorHistory(): SensorReading[] {
    return [...this.sensors];
  }

  getAccumulatedRainfall(hours: number): number {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.rainfallHistory
      .filter((p) => p.time >= cutoff)
      .reduce((sum, p) => sum + p.value * 0.25, 0); // 15-min intervals = 0.25 hr
  }

  getAverageVelocity(): number {
    const recent = this.sensors.slice(-10);
    if (recent.length === 0) return 0;
    return recent.reduce((sum, r) => sum + r.velocity, 0) / recent.length;
  }

  getAcceleration(): number {
    const recent = this.sensors.slice(-20);
    if (recent.length < 10) return 0;
    const firstHalf = recent.slice(0, 10);
    const secondHalf = recent.slice(-10);
    const v1 = firstHalf.reduce((s, r) => s + r.velocity, 0) / 10;
    const v2 = secondHalf.reduce((s, r) => s + r.velocity, 0) / 10;
    return (v2 - v1) / (10 * 3 / 60 / 24); // mm/day²
  }
}

// Singleton instances per location
const engines = new Map<string, RealTimeEngine>();

export function getEngine(location: string, baseData: RiskData): RealTimeEngine {
  if (!engines.has(location)) {
    engines.set(location, new RealTimeEngine(baseData));
  }
  return engines.get(location)!;
}

export function resetEngine(location: string): void {
  const engine = engines.get(location);
  if (engine) {
    engine.stop();
    engines.delete(location);
  }
}

export { RealTimeEngine };
