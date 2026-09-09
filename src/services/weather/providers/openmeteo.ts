/**
 * Weather Service - Real weather data from Open-Meteo
 * Open-Meteo is free, no API key required, CORS-enabled
 * https://open-meteo.com/en/docs
 */

export type DataQuality = 'OBSERVED' | 'MODEL_ESTIMATE' | 'FORECAST';

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number; // current mm/h
  rain: number; // current rain mm/h
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  weatherCode: number;
  timestamp: number;
  source: string;
  quality: DataQuality;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
}

export interface WeatherResponse {
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastUpdated: number;
}

// WMO Weather interpretation codes
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown';
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

export class OpenMeteoProvider {
  private readonly baseUrl = 'https://api.open-meteo.com/v1';

  async getWeather(lat: number, lon: number): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'rain',
        'precipitation_probability',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'precipitation',
        'precipitation_probability',
        'weather_code',
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'weather_code',
      ].join(','),
      forecast_days: '7',
      timezone: 'auto',
    });

    const response = await fetch(`${this.baseUrl}/forecast?${params}`);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();

    const current: WeatherData = {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      precipitationProbability: data.current.precipitation_probability ?? 0,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.pressure_msl,
      cloudCover: data.current.cloud_cover,
      weatherCode: data.current.weather_code,
      timestamp: new Date(data.current.time).getTime(),
      source: 'Open-Meteo',
      quality: 'MODEL_ESTIMATE',
    };

    const hourly: HourlyForecast[] = (data.hourly.time || []).map(
      (time: string, i: number) => ({
        time,
        temperature: data.hourly.temperature_2m[i],
        precipitation: data.hourly.precipitation[i],
        precipitationProbability: data.hourly.precipitation_probability?.[i] ?? 0,
        weatherCode: data.hourly.weather_code[i],
      })
    );

    const daily: DailyForecast[] = (data.daily.time || []).map(
      (date: string, i: number) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitationSum: data.daily.precipitation_sum[i],
        precipitationProbabilityMax: data.daily.precipitation_probability_max?.[i] ?? 0,
        weatherCode: data.daily.weather_code[i],
      })
    );

    return {
      current,
      hourly,
      daily,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Get historical precipitation data for rainfall accumulation
   */
  async getHistoricalPrecipitation(
    lat: number,
    lon: number,
    days: number = 7
  ): Promise<{ time: string; precipitation: number }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      hourly: 'precipitation',
      timezone: 'auto',
    });

    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params}`
    );

    if (!response.ok) {
      throw new Error(`Open-Meteo Archive API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.hourly.time || []).map((time: string, i: number) => ({
      time,
      precipitation: data.hourly.precipitation[i] || 0,
    }));
  }
}

export const openMeteoProvider = new OpenMeteoProvider();
