/**
 * Rainfall Service - Real rainfall accumulation calculations
 * Uses Open-Meteo historical and forecast data
 */

import { weatherService } from './weather/weatherService';
import type { DataQuality } from './weather/providers/openmeteo';

export interface RainfallAccumulation {
  last1Hour: number;
  last3Hours: number;
  last6Hours: number;
  last12Hours: number;
  last24Hours: number;
  last7Days: number;
  currentIntensity: number;
  timestamp: number;
  source: string;
  quality: DataQuality;
}

export interface RainfallData {
  accumulation: RainfallAccumulation;
  forecastNext24h: number;
  forecastNext72h: number;
  lastUpdated: number;
}

class RainfallService {
  /**
   * Calculate rainfall accumulation from historical data
   */
  async getRainfallData(lat: number, lon: number): Promise<RainfallData> {
    // Get current weather (includes current precipitation)
    const weather = await weatherService.getWeather(lat, lon);

    // Get historical precipitation (last 7 days)
    const historical = await weatherService.getHistoricalPrecipitation(lat, lon, 7);

    const now = new Date();
    const currentTimestamp = now.getTime();

    // Calculate accumulations
    const accumulation = this.calculateAccumulation(historical, weather, currentTimestamp);

    // Calculate forecast precipitation
    const forecastNext24h = this.calculateForecastPrecipitation(weather.hourly, 24);
    const forecastNext72h = this.calculateForecastPrecipitation(weather.hourly, 72);

    return {
      accumulation,
      forecastNext24h,
      forecastNext72h,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Calculate rainfall accumulation over different time periods
   */
  private calculateAccumulation(
    historical: { time: string; precipitation: number }[],
    currentWeather: any,
    currentTimestamp: number
  ): RainfallAccumulation {
    const now = new Date(currentTimestamp);

    // Filter data by time periods
    const last1h = this.sumPrecipitation(historical, now, 1);
    const last3h = this.sumPrecipitation(historical, now, 3);
    const last6h = this.sumPrecipitation(historical, now, 6);
    const last12h = this.sumPrecipitation(historical, now, 12);
    const last24h = this.sumPrecipitation(historical, now, 24);
    const last7d = this.sumPrecipitation(historical, now, 24 * 7);

    // Current intensity from weather data
    const currentIntensity = currentWeather.current?.precipitation || 0;

    return {
      last1Hour: last1h,
      last3Hours: last3h,
      last6Hours: last6h,
      last12Hours: last12h,
      last24Hours: last24h,
      last7Days: last7d,
      currentIntensity,
      timestamp: currentTimestamp,
      source: 'Open-Meteo',
      quality: 'OBSERVED',
    };
  }

  /**
   * Sum precipitation over a time period
   */
  private sumPrecipitation(
    data: { time: string; precipitation: number }[],
    now: Date,
    hoursBack: number
  ): number {
    const cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);

    return data
      .filter((entry) => {
        const entryTime = new Date(entry.time);
        return entryTime >= cutoff && entryTime <= now;
      })
      .reduce((sum, entry) => sum + (entry.precipitation || 0), 0);
  }

  /**
   * Calculate forecast precipitation
   */
  private calculateForecastPrecipitation(hourly: any[], hours: number): number {
    const nextHours = hourly.slice(0, hours);
    return nextHours.reduce((sum, h) => sum + (h.precipitation || 0), 0);
  }

  /**
   * Get rainfall intensity category
   */
  getIntensityCategory(mmPerHour: number): {
    label: string;
    color: string;
    description: string;
  } {
    if (mmPerHour === 0) {
      return { label: 'No Rain', color: 'text-gray-400', description: 'No rainfall detected' };
    } else if (mmPerHour < 2.5) {
      return { label: 'Light', color: 'text-blue-400', description: 'Light rain' };
    } else if (mmPerHour < 7.5) {
      return { label: 'Moderate', color: 'text-cyan-400', description: 'Moderate rain' };
    } else if (mmPerHour < 15) {
      return { label: 'Heavy', color: 'text-yellow-400', description: 'Heavy rain' };
    } else if (mmPerHour < 30) {
      return { label: 'Very Heavy', color: 'text-orange-400', description: 'Very heavy rain' };
    } else {
      return { label: 'Extreme', color: 'text-red-400', description: 'Extreme rainfall' };
    };
  }
}

export const rainfallService = new RainfallService();
