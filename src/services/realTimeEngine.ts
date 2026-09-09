/**
 * Professional Real-Time Data Engine
 * Simulates authentic geophysical sensor networks with realistic patterns
 * Models actual monsoon behavior, diurnal cycles, and geological responses
 */

import { RiskData } from "../data/mockRiskData";

export interface SensorReading {
  timestamp: number;
  rainfall: number;
  soilMoisture: number;
  groundDisplacement: number;
  velocity: number;
  acceleration: number;
  temperature: number;
  porePressure: number;
  vibration: number;
  humidity: number;
  windSpeed: number;
  dataQuality: number; // 0-100
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
  type: "RAINFALL_SPIKE" | "DEFORMATION_ACCELERATION" | "MOISTURE_SURGE" | "VIBRATION" | "PRESSURE_BUILDUP";
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  timestamp: number;
  description: string;
  value: number;
  threshold: number;
  sensorId: string;
}

export interface SensorStatus {
  id: string;
  name: string;
  type: string;
  status: "ONLINE" | "OFFLINE" | "DEGRADED" | "CALIBRATING";
  lastReading: number;
  battery: number;
  signalStrength: number;
}

class ProfessionalRealTimeEngine {
  private baseData: RiskData;
  private sensors: SensorReading[] = [];
  private rainfallHistory: TimeSeriesPoint[] = [];
  private deformationHistory: TimeSeriesPoint[] = [];
  private riskHistory: TimeSeriesPoint[] = [];
  private anomalies: Anomaly[] = [];
  private sensorStatuses: SensorStatus[] = [];
  private listeners: Set<() => void> = new Set();
  private intervalId: number | null = null;
  private tick = 0;
  private monsoonPhase: number;
  private startTime: number;

  constructor(baseData: RiskData) {
    this.baseData = baseData;
    this.startTime = Date.now();
    this.monsoonPhase = Math.random() * Math.PI * 2;
    this.initializeSensors();
    this.initializeHistory();
  }

  private initializeSensors(): void {
    const sensorTypes = [
      { id: "RS-001", name: "Rain Gauge Alpha", type: "rainfall" },
      { id: "RS-002", name: "Rain Gauge Beta", type: "rainfall" },
      { id: "SM-001", name: "Soil Moisture Probe A", type: "moisture" },
      { id: "SM-002", name: "Soil Moisture Probe B", type: "moisture" },
      { id: "GD-001", name: "InSAR Station North", type: "deformation" },
      { id: "GD-002", name: "InSAR Station South", type: "deformation" },
      { id: "PP-001", name: "Piezometer Alpha", type: "pressure" },
      { id: "WB-001", name: "Weather Station", type: "weather" },
    ];

    this.sensorStatuses = sensorTypes.map((s) => ({
      ...s,
      status: "ONLINE",
      lastReading: Date.now(),
      battery: 75 + Math.random() * 25,
      signalStrength: 80 + Math.random() * 20,
    }));
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private gaussianNoise(mean = 0, stdDev = 1): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }

  private monsoonPattern(hour: number, day: number): number {
    // Simulates monsoon intensity patterns
    const seasonal = 0.5 + 0.5 * Math.sin((day / 365) * Math.PI * 2 + this.monsoonPhase);
    const diurnal = 0.7 + 0.3 * Math.sin((hour - 14) * Math.PI / 12); // Peak in afternoon
    const burst = Math.random() < 0.05 ? 2.5 : 1; // Occasional rain bursts
    return seasonal * diurnal * burst;
  }

  private initializeHistory(): void {
    const now = Date.now();
    const hours = 48; // 48 hours of history

    for (let i = hours * 4; i >= 0; i--) {
      const time = now - i * 15 * 60 * 1000;
      const date = new Date(time);
      const hour = date.getHours();
      const day = date.getDate();

      const monsoonFactor = this.monsoonPattern(hour, day);
      const baseRain = this.baseData.rainfall.oneHour * 0.4;
      const rain = Math.max(0, baseRain * monsoonFactor + this.gaussianNoise(0, baseRain * 0.15));

      this.rainfallHistory.push({ time, value: rain });

      // Deformation history with realistic creep
      const progress = i / (hours * 4);
      const creepRate = this.baseData.deformation.velocity * 0.1;
      const baseDeformation = this.baseData.deformation.current * (1 - progress * 0.2);
      const deformation = Math.max(0, baseDeformation + this.gaussianNoise(0, 0.3) + creepRate * (1 - progress));

      this.deformationHistory.push({ time, value: deformation });

      // Risk history
      const baseRisk = this.baseData.probability * (1 - progress * 0.1);
      const risk = Math.max(0, Math.min(100, baseRisk + this.gaussianNoise(0, 1.5)));
      this.riskHistory.push({ time, value: risk });
    }
  }

  private generateSensorReading(): SensorReading {
    const now = Date.now();
    const date = new Date(now);
    const hour = date.getHours();
    const dayOfYear = Math.floor((now - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

    // Realistic monsoon-driven rainfall
    const monsoonFactor = this.monsoonPattern(hour, dayOfYear);
    const rainIntensity = Math.max(0,
      this.baseData.rainfall.oneHour * 0.5 * monsoonFactor +
      this.gaussianNoise(0, this.baseData.rainfall.oneHour * 0.1)
    );

    // Soil moisture responds to rainfall with lag
    const recentRain = this.rainfallHistory.slice(-8).reduce((s, p) => s + p.value, 0);
    const soilMoisture = Math.min(100, Math.max(0,
      40 + recentRain * 1.5 + this.gaussianNoise(0, 2)
    ));

    // Ground displacement with realistic creep behavior
    const prevDisplacement = this.sensors.length > 0
      ? this.sensors[this.sensors.length - 1].groundDisplacement
      : this.baseData.deformation.current * 0.8;

    const displacementRate = this.baseData.deformation.velocity / 96; // per 15 min
    const groundDisplacement = Math.max(0,
      prevDisplacement + displacementRate + this.gaussianNoise(0, 0.05)
    );

    // Velocity with acceleration
    const velocity = Math.max(0,
      this.baseData.deformation.velocity +
      this.gaussianNoise(0, 0.08) +
      (rainIntensity > 10 ? 0.2 : 0)
    );

    // Acceleration (change in velocity)
    const prevVelocity = this.sensors.length > 0
      ? this.sensors[this.sensors.length - 1].velocity
      : velocity;
    const acceleration = (velocity - prevVelocity) * 4; // per day

    // Temperature with diurnal cycle
    const temperature = 18 + 8 * Math.sin((hour - 6) * Math.PI / 12) + this.gaussianNoise(0, 0.3);

    // Pore pressure correlates with soil moisture
    const porePressure = Math.max(0,
      soilMoisture * 0.7 + this.gaussianNoise(0, 1.5)
    );

    // Vibration from rain and micro-seismic activity
    const vibration = Math.max(0,
      0.01 + rainIntensity * 0.005 + this.gaussianNoise(0, 0.005)
    );

    // Humidity
    const humidity = Math.min(100, Math.max(30,
      60 + soilMoisture * 0.3 + this.gaussianNoise(0, 3)
    ));

    // Wind speed
    const windSpeed = Math.max(0,
      5 + 10 * Math.random() + this.gaussianNoise(0, 2)
    );

    // Data quality (usually high, occasional drops)
    const dataQuality = Math.min(100, Math.max(60,
      95 + this.gaussianNoise(0, 3)
    ));

    return {
      timestamp: now,
      rainfall: rainIntensity,
      soilMoisture,
      groundDisplacement,
      velocity,
      acceleration,
      temperature,
      porePressure,
      vibration,
      humidity,
      windSpeed,
      dataQuality,
    };
  }

  private detectAnomalies(reading: SensorReading): void {
    const now = Date.now();

    // Rainfall spike
    const avgRain = this.rainfallHistory.slice(-20).reduce((s, p) => s + p.value, 0) / 20;
    if (reading.rainfall > avgRain * 3 && reading.rainfall > 5) {
      this.anomalies.push({
        id: `rain-${now}`,
        type: "RAINFALL_SPIKE",
        severity: reading.rainfall > 20 ? "CRITICAL" : reading.rainfall > 10 ? "HIGH" : "MODERATE",
        timestamp: now,
        description: `Rainfall intensity ${reading.rainfall.toFixed(1)} mm/hr — ${(reading.rainfall / avgRain).toFixed(1)}x above average`,
        value: reading.rainfall,
        threshold: avgRain * 3,
        sensorId: "RS-001",
      });
    }

    // Deformation acceleration
    if (reading.acceleration > 0.5) {
      this.anomalies.push({
        id: `def-${now}`,
        type: "DEFORMATION_ACCELERATION",
        severity: reading.acceleration > 1 ? "CRITICAL" : "HIGH",
        timestamp: now,
        description: `Ground acceleration ${reading.acceleration.toFixed(2)} mm/day² detected`,
        value: reading.acceleration,
        threshold: 0.5,
        sensorId: "GD-001",
      });
    }

    // Soil moisture critical
    if (reading.soilMoisture > 90) {
      this.anomalies.push({
        id: `moist-${now}`,
        type: "MOISTURE_SURGE",
        severity: reading.soilMoisture > 95 ? "CRITICAL" : "HIGH",
        timestamp: now,
        description: `Soil saturation at ${reading.soilMoisture.toFixed(1)}% — near failure threshold`,
        value: reading.soilMoisture,
        threshold: 90,
        sensorId: "SM-001",
      });
    }

    // Pore pressure buildup
    if (reading.porePressure > 60) {
      this.anomalies.push({
        id: `pressure-${now}`,
        type: "PRESSURE_BUILDUP",
        severity: reading.porePressure > 75 ? "HIGH" : "MODERATE",
        timestamp: now,
        description: `Pore water pressure ${reading.porePressure.toFixed(1)} kPa — reducing effective stress`,
        value: reading.porePressure,
        threshold: 60,
        sensorId: "PP-001",
      });
    }

    // Keep last 30 anomalies
    if (this.anomalies.length > 30) {
      this.anomalies = this.anomalies.slice(-30);
    }
  }

  private updateSensorStatuses(): void {
    this.sensorStatuses.forEach((sensor) => {
      // Random status changes (mostly online)
      if (Math.random() < 0.005) {
        sensor.status = "DEGRADED";
      } else if (Math.random() < 0.002) {
        sensor.status = "CALIBRATING";
      } else {
        sensor.status = "ONLINE";
      }

      // Battery drain
      sensor.battery = Math.max(20, sensor.battery - Math.random() * 0.01);

      // Signal fluctuation
      sensor.signalStrength = Math.min(100, Math.max(60,
        sensor.signalStrength + this.gaussianNoise(0, 2)
      ));

      sensor.lastReading = Date.now();
    });
  }

  tick_update(): void {
    this.tick++;
    const reading = this.generateSensorReading();
    this.sensors.push(reading);

    if (this.sensors.length > 200) this.sensors.shift();

    this.detectAnomalies(reading);
    this.updateSensorStatuses();

    // Update histories
    const now = Date.now();
    this.rainfallHistory.push({ time: now, value: reading.rainfall });
    this.deformationHistory.push({ time: now, value: reading.groundDisplacement });

    if (this.rainfallHistory.length > 192) this.rainfallHistory.shift(); // 48 hours
    if (this.deformationHistory.length > 192) this.deformationHistory.shift();

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

  getSensorStatuses(): SensorStatus[] {
    return [...this.sensorStatuses];
  }

  getAccumulatedRainfall(hours: number): number {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return this.rainfallHistory
      .filter((p) => p.time >= cutoff)
      .reduce((sum, p) => sum + p.value * 0.25, 0);
  }

  getAverageVelocity(): number {
    const recent = this.sensors.slice(-20);
    if (recent.length === 0) return 0;
    return recent.reduce((sum, r) => sum + r.velocity, 0) / recent.length;
  }
}

const engines = new Map<string, ProfessionalRealTimeEngine>();

export function getEngine(location: string, baseData: RiskData): ProfessionalRealTimeEngine {
  if (!engines.has(location)) {
    engines.set(location, new ProfessionalRealTimeEngine(baseData));
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

export { ProfessionalRealTimeEngine };
