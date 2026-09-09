/**
 * RAKSHAK Risk Engine
 * 
 * Calculates dynamic landslide risk score based on real environmental data.
 * 
 * IMPORTANT: This is an environmental estimate, NOT an official emergency warning.
 * The scoring weights are configurable and should be calibrated against historical
 * landslide events before being used for any operational purpose.
 */

import type { RainfallAccumulation } from './rainfall';
import type { TerrainData } from './terrain';
import type { WeatherData } from './weather/providers/openmeteo';

export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface RiskFactors {
  rainfall: { score: number; weight: number; details: string };
  terrain: { score: number; weight: number; details: string };
  forecast: { score: number; weight: number; details: string };
  environmental: { score: number; weight: number; details: string };
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactors;
  explanation: string[];
  timestamp: number;
  disclaimer: string;
}

/**
 * Configurable risk weights and thresholds
 * These should be calibrated against historical landslide data
 */
export const RISK_CONFIG = {
  weights: {
    rainfall: 0.35,
    terrain: 0.30,
    forecast: 0.20,
    environmental: 0.15,
  },
  thresholds: {
    LOW: { min: 0, max: 20 },
    MODERATE: { min: 21, max: 40 },
    ELEVATED: { min: 41, max: 60 },
    HIGH: { min: 61, max: 80 },
    CRITICAL: { min: 81, max: 100 },
  },
  rainfall: {
    // Score thresholds for 24h rainfall (mm)
    low: 10,
    moderate: 30,
    elevated: 60,
    high: 100,
    critical: 150,
    // Score thresholds for 7-day rainfall (mm)
    weeklyLow: 50,
    weeklyModerate: 150,
    weeklyElevated: 250,
    weeklyHigh: 400,
    weeklyCritical: 600,
    // Current intensity thresholds (mm/h)
    intensityModerate: 5,
    intensityHigh: 15,
    intensityCritical: 30,
  },
  terrain: {
    // Slope angle thresholds (degrees)
    lowSlope: 10,
    moderateSlope: 20,
    elevatedSlope: 30,
    highSlope: 40,
    criticalSlope: 50,
    // Elevation thresholds (meters)
    highElevation: 1500,
    veryHighElevation: 3000,
  },
};

export function getRiskLevel(score: number): RiskLevel {
  if (score <= RISK_CONFIG.thresholds.LOW.max) return 'LOW';
  if (score <= RISK_CONFIG.thresholds.MODERATE.max) return 'MODERATE';
  if (score <= RISK_CONFIG.thresholds.ELEVATED.max) return 'ELEVATED';
  if (score <= RISK_CONFIG.thresholds.HIGH.max) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#22c55e';
    case 'MODERATE': return '#eab308';
    case 'ELEVATED': return '#f97316';
    case 'HIGH': return '#ef4444';
    case 'CRITICAL': return '#dc2626';
  }
}

/**
 * Calculate rainfall risk component (0-100)
 */
export function calculateRainfallRisk(rainfall: RainfallAccumulation): {
  score: number;
  details: string;
} {
  let score = 0;
  const details: string[] = [];

  // 24-hour rainfall contribution (up to 50 points)
  const rain24h = rainfall.last24Hours;
  if (rain24h >= RISK_CONFIG.rainfall.critical) {
    score += 50;
    details.push(`Critical: ${rain24h.toFixed(0)}mm in 24h`);
  } else if (rain24h >= RISK_CONFIG.rainfall.high) {
    score += 40;
    details.push(`Heavy: ${rain24h.toFixed(0)}mm in 24h`);
  } else if (rain24h >= RISK_CONFIG.rainfall.elevated) {
    score += 30;
    details.push(`Significant: ${rain24h.toFixed(0)}mm in 24h`);
  } else if (rain24h >= RISK_CONFIG.rainfall.moderate) {
    score += 20;
    details.push(`Moderate: ${rain24h.toFixed(0)}mm in 24h`);
  } else if (rain24h >= RISK_CONFIG.rainfall.low) {
    score += 10;
    details.push(`Light: ${rain24h.toFixed(0)}mm in 24h`);
  } else {
    details.push(`Minimal: ${rain24h.toFixed(1)}mm in 24h`);
  }

  // 7-day rainfall contribution (up to 30 points)
  const rain7d = rainfall.last7Days;
  if (rain7d >= RISK_CONFIG.rainfall.weeklyCritical) {
    score += 30;
    details.push(`Extreme weekly accumulation: ${rain7d.toFixed(0)}mm`);
  } else if (rain7d >= RISK_CONFIG.rainfall.weeklyHigh) {
    score += 24;
    details.push(`Heavy weekly accumulation: ${rain7d.toFixed(0)}mm`);
  } else if (rain7d >= RISK_CONFIG.rainfall.weeklyElevated) {
    score += 18;
    details.push(`Significant weekly accumulation: ${rain7d.toFixed(0)}mm`);
  } else if (rain7d >= RISK_CONFIG.rainfall.weeklyModerate) {
    score += 12;
    details.push(`Moderate weekly accumulation: ${rain7d.toFixed(0)}mm`);
  } else if (rain7d >= RISK_CONFIG.rainfall.weeklyLow) {
    score += 6;
  }

  // Current intensity (up to 20 points)
  const intensity = rainfall.currentIntensity;
  if (intensity >= RISK_CONFIG.rainfall.intensityCritical) {
    score += 20;
    details.push(`Extreme current intensity: ${intensity.toFixed(1)} mm/h`);
  } else if (intensity >= RISK_CONFIG.rainfall.intensityHigh) {
    score += 14;
    details.push(`Heavy current intensity: ${intensity.toFixed(1)} mm/h`);
  } else if (intensity >= RISK_CONFIG.rainfall.intensityModerate) {
    score += 8;
    details.push(`Moderate current intensity: ${intensity.toFixed(1)} mm/h`);
  } else if (intensity > 0) {
    score += 3;
  }

  return {
    score: Math.min(100, score),
    details: details.join('; '),
  };
}

/**
 * Calculate terrain risk component (0-100)
 */
export function calculateTerrainRisk(terrain: TerrainData): {
  score: number;
  details: string;
} {
  let score = 0;
  const details: string[] = [];

  // Slope contribution (up to 70 points)
  const slope = terrain.slope;
  if (slope >= RISK_CONFIG.terrain.criticalSlope) {
    score += 70;
    details.push(`Very steep: ${slope.toFixed(1)}°`);
  } else if (slope >= RISK_CONFIG.terrain.highSlope) {
    score += 56;
    details.push(`Steep: ${slope.toFixed(1)}°`);
  } else if (slope >= RISK_CONFIG.terrain.elevatedSlope) {
    score += 42;
    details.push(`Moderately steep: ${slope.toFixed(1)}°`);
  } else if (slope >= RISK_CONFIG.terrain.moderateSlope) {
    score += 28;
    details.push(`Sloped: ${slope.toFixed(1)}°`);
  } else if (slope >= RISK_CONFIG.terrain.lowSlope) {
    score += 14;
    details.push(`Gentle slope: ${slope.toFixed(1)}°`);
  } else {
    details.push(`Flat terrain: ${slope.toFixed(1)}°`);
  }

  // Elevation contribution (up to 30 points)
  if (terrain.elevation >= RISK_CONFIG.terrain.veryHighElevation) {
    score += 30;
    details.push(`Very high elevation: ${terrain.elevation}m`);
  } else if (terrain.elevation >= RISK_CONFIG.terrain.highElevation) {
    score += 20;
    details.push(`High elevation: ${terrain.elevation}m`);
  } else if (terrain.elevation > 500) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    details: details.join('; '),
  };
}

/**
 * Calculate forecast risk component (0-100)
 */
export function calculateForecastRisk(
  forecastNext24h: number,
  forecastNext72h: number,
  precipitationProbability: number
): { score: number; details: string } {
  let score = 0;
  const details: string[] = [];

  // Next 24h forecast (up to 50 points)
  if (forecastNext24h >= 100) {
    score += 50;
    details.push(`Heavy rainfall forecast: ${forecastNext24h.toFixed(0)}mm in 24h`);
  } else if (forecastNext24h >= 50) {
    score += 35;
    details.push(`Significant rainfall expected: ${forecastNext24h.toFixed(0)}mm in 24h`);
  } else if (forecastNext24h >= 20) {
    score += 20;
    details.push(`Rainfall expected: ${forecastNext24h.toFixed(0)}mm in 24h`);
  } else if (forecastNext24h >= 5) {
    score += 10;
  }

  // Next 72h forecast (up to 30 points)
  if (forecastNext72h >= 200) {
    score += 30;
    details.push(`Extended heavy rainfall: ${forecastNext72h.toFixed(0)}mm in 72h`);
  } else if (forecastNext72h >= 100) {
    score += 20;
    details.push(`Extended rainfall: ${forecastNext72h.toFixed(0)}mm in 72h`);
  } else if (forecastNext72h >= 40) {
    score += 10;
  }

  // Precipitation probability (up to 20 points)
  if (precipitationProbability >= 80) {
    score += 20;
    details.push(`High probability of precipitation: ${precipitationProbability}%`);
  } else if (precipitationProbability >= 50) {
    score += 12;
    details.push(`Moderate precipitation probability: ${precipitationProbability}%`);
  } else if (precipitationProbability >= 30) {
    score += 6;
  }

  return {
    score: Math.min(100, score),
    details: details.join('; ') || 'No significant rainfall forecast',
  };
}

/**
 * Calculate environmental risk component (0-100)
 */
export function calculateEnvironmentalRisk(weather: WeatherData): {
  score: number;
  details: string;
} {
  let score = 0;
  const details: string[] = [];

  // Humidity (up to 40 points)
  if (weather.humidity >= 95) {
    score += 40;
    details.push(`Very high humidity: ${weather.humidity}%`);
  } else if (weather.humidity >= 85) {
    score += 28;
    details.push(`High humidity: ${weather.humidity}%`);
  } else if (weather.humidity >= 70) {
    score += 15;
    details.push(`Elevated humidity: ${weather.humidity}%`);
  }

  // Cloud cover (up to 30 points)
  if (weather.cloudCover >= 90) {
    score += 30;
    details.push(`Heavy cloud cover: ${weather.cloudCover}%`);
  } else if (weather.cloudCover >= 70) {
    score += 20;
    details.push(`Significant cloud cover: ${weather.cloudCover}%`);
  } else if (weather.cloudCover >= 50) {
    score += 10;
  }

  // Pressure drop (up to 30 points) - lower pressure = more unstable
  if (weather.pressure < 1000) {
    score += 30;
    details.push(`Very low pressure: ${weather.pressure.toFixed(0)} hPa`);
  } else if (weather.pressure < 1010) {
    score += 20;
    details.push(`Low pressure: ${weather.pressure.toFixed(0)} hPa`);
  } else if (weather.pressure < 1015) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    details: details.join('; ') || 'Normal environmental conditions',
  };
}

/**
 * Calculate overall RAKSHAK Risk Score
 */
export function calculateRakshakRisk(
  rainfall: RainfallAccumulation,
  terrain: TerrainData,
  weather: WeatherData,
  forecastNext24h: number,
  forecastNext72h: number
): RiskResult {
  const rainfallRisk = calculateRainfallRisk(rainfall);
  const terrainRisk = calculateTerrainRisk(terrain);
  const forecastRisk = calculateForecastRisk(
    forecastNext24h,
    forecastNext72h,
    weather.precipitationProbability
  );
  const environmentalRisk = calculateEnvironmentalRisk(weather);

  const factors: RiskFactors = {
    rainfall: {
      score: rainfallRisk.score,
      weight: RISK_CONFIG.weights.rainfall,
      details: rainfallRisk.details,
    },
    terrain: {
      score: terrainRisk.score,
      weight: RISK_CONFIG.weights.terrain,
      details: terrainRisk.details,
    },
    forecast: {
      score: forecastRisk.score,
      weight: RISK_CONFIG.weights.forecast,
      details: forecastRisk.details,
    },
    environmental: {
      score: environmentalRisk.score,
      weight: RISK_CONFIG.weights.environmental,
      details: environmentalRisk.details,
    },
  };

  // Weighted score
  const score = Math.round(
    rainfallRisk.score * RISK_CONFIG.weights.rainfall +
    terrainRisk.score * RISK_CONFIG.weights.terrain +
    forecastRisk.score * RISK_CONFIG.weights.forecast +
    environmentalRisk.score * RISK_CONFIG.weights.environmental
  );

  const level = getRiskLevel(score);

  // Generate explanation
  const explanation: string[] = [];
  const sortedFactors = Object.entries(factors)
    .sort(([, a], [, b]) => b.score * b.weight - a.score * a.weight);

  for (const [key, factor] of sortedFactors) {
    if (factor.score > 20) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      explanation.push(`${label}: ${factor.details}`);
    }
  }

  if (explanation.length === 0) {
    explanation.push('No immediate risk factors detected.');
  }

  return {
    score,
    level,
    factors,
    explanation,
    timestamp: Date.now(),
    disclaimer:
      'RAKSHAK Risk Score is an environmental estimate based on available data. It is not an official emergency warning. Always follow guidance from local authorities.',
  };
}
