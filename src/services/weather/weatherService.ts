/**
 * Weather Service - Provider abstraction with fallback
 * Combines multiple weather data sources with intelligent caching
 */

import { openMeteoProvider, type WeatherResponse } from './providers/openmeteo';
import { imdProvider } from './providers/imd';

export type { WeatherResponse };

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class WeatherServiceCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number = 10 * 60 * 1000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new WeatherServiceCache();

export class WeatherService {
  /**
   * Get weather data with provider fallback
   * Primary: Open-Meteo (free, no API key)
   * Fallback: IMD (if configured)
   */
  async getWeather(lat: number, lon: number): Promise<WeatherResponse> {
    const cacheKey = `weather:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = cache.get<WeatherResponse>(cacheKey);
    if (cached) return cached;

    // Try Open-Meteo first (most reliable, no key needed)
    try {
      const data = await openMeteoProvider.getWeather(lat, lon);
      cache.set(cacheKey, data, 10 * 60 * 1000); // 10 min cache
      return data;
    } catch (error) {
      console.warn('Open-Meteo failed, trying IMD:', error);
    }

    // Try IMD as fallback
    if (imdProvider.available()) {
      try {
        const data = await imdProvider.getWeather(lat, lon);
        cache.set(cacheKey, data, 10 * 60 * 1000);
        return data;
      } catch (error) {
        console.warn('IMD provider also failed:', error);
      }
    }

    throw new Error('All weather providers unavailable. Please check your connection.');
  }

  /**
   * Get historical precipitation data
   */
  async getHistoricalPrecipitation(
    lat: number,
    lon: number,
    days: number = 7
  ): Promise<{ time: string; precipitation: number }[]> {
    const cacheKey = `precip_hist:${lat.toFixed(3)},${lon.toFixed(3)}:${days}`;
    const cached = cache.get<{ time: string; precipitation: number }[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await openMeteoProvider.getHistoricalPrecipitation(lat, lon, days);
      cache.set(cacheKey, data, 30 * 60 * 1000); // 30 min cache
      return data;
    } catch (error) {
      console.warn('Historical precipitation fetch failed:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();
