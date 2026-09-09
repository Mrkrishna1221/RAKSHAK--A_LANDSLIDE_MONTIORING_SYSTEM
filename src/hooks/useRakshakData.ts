/**
 * useRakshakData - Main hook that combines all real-time services
 * Provides unified access to GPS, weather, rainfall, terrain, and risk data
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { locationService, type LocationData } from '../services/location';
import { weatherService, type WeatherResponse } from '../services/weather/weatherService';
import { rainfallService, type RainfallData } from '../services/rainfall';
import { terrainService, type TerrainData } from '../services/terrain';
import { calculateRakshakRisk, type RiskResult } from '../services/risk';

export interface RakshakData {
  location: LocationData | null;
  weather: WeatherResponse | null;
  rainfall: RainfallData | null;
  terrain: TerrainData | null;
  risk: RiskResult | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

export interface UseRakshakDataReturn extends RakshakData {
  refresh: () => Promise<void>;
  isStale: boolean;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const STALE_THRESHOLD = 15 * 60 * 1000; // 15 minutes

export function useRakshakData(): UseRakshakDataReturn {
  const [data, setData] = useState<RakshakData>({
    location: null,
    weather: null,
    rainfall: null,
    terrain: null,
    risk: null,
    loading: true,
    error: null,
    lastUpdated: 0,
  });

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLocationRef = useRef<{ lat: number; lon: number } | null>(null);

  const fetchData = useCallback(async (lat: number, lon: number) => {
    try {
      // Fetch all data in parallel
      const [weather, rainfall, terrain] = await Promise.all([
        weatherService.getWeather(lat, lon),
        rainfallService.getRainfallData(lat, lon),
        terrainService.getTerrain(lat, lon),
      ]);

      // Calculate risk
      const risk = calculateRakshakRisk(
        rainfall.accumulation,
        terrain,
        weather.current,
        rainfall.forecastNext24h,
        rainfall.forecastNext72h
      );

      setData((prev) => ({
        ...prev,
        weather,
        rainfall,
        terrain,
        risk,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      }));
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!lastLocationRef.current) return;
    setData((prev) => ({ ...prev, loading: true }));
    await fetchData(lastLocationRef.current.lat, lastLocationRef.current.lon);
  }, [fetchData]);

  useEffect(() => {
    // Start watching location
    const stopWatching = locationService.watchLocation((location) => {
      setData((prev) => ({ ...prev, location }));

      if (location.status === 'active') {
        const { latitude, longitude, accuracy } = location;

        // Only refetch if location changed significantly (>100m)
        const lastLoc = lastLocationRef.current;
        const hasMovedSignificantly =
          !lastLoc ||
          Math.abs(lastLoc.lat - latitude) > 0.001 ||
          Math.abs(lastLoc.lon - longitude) > 0.001;

        if (hasMovedSignificantly && accuracy < 100) {
          lastLocationRef.current = { lat: latitude, lon: longitude };
          fetchData(latitude, longitude);
        }
      }
    });

    // Set up periodic refresh
    refreshTimeoutRef.current = setInterval(() => {
      if (lastLocationRef.current) {
        fetchData(lastLocationRef.current.lat, lastLocationRef.current.lon);
      }
    }, REFRESH_INTERVAL);

    return () => {
      stopWatching();
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  }, [fetchData]);

  const isStale = data.lastUpdated > 0 && Date.now() - data.lastUpdated > STALE_THRESHOLD;

  return {
    ...data,
    refresh,
    isStale,
  };
}
