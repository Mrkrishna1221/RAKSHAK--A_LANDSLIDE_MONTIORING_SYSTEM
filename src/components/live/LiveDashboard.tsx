import React, { useCallback, useEffect, useState } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  elevation: number;
}

const LiveLocationMonitoring: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const getWeatherData = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m` +
          `&hourly=precipitation,rain` +
          `&forecast_days=1` +
          `&timezone=auto`;

        const elevationUrl =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&current=temperature_2m` +
          `&elevation=true`;

        const [weatherResponse, elevationResponse] = await Promise.all([
          fetch(weatherUrl),
          fetch(elevationUrl),
        ]);

        if (!weatherResponse.ok) {
          throw new Error("Weather API failed");
        }

        const weatherJson = await weatherResponse.json();
        const elevationJson = await elevationResponse.json();

        const current = weatherJson.current ?? {};

        const weatherResult: WeatherData = {
          temperature: Number(current.temperature_2m ?? 0),
          rainfall: Number(current.rain ?? 0),
          precipitation: Number(current.precipitation ?? 0),
          windSpeed: Number(current.wind_speed_10m ?? 0),
          humidity: Number(current.relative_humidity_2m ?? 0),
          elevation: Number(elevationJson.elevation ?? 0),
        };

        setWeather(weatherResult);
        setLastUpdated(new Date().toLocaleTimeString());
        setError("");
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Unable to fetch live weather data");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setLocation(locationData);

        await getWeatherData(
          locationData.latitude,
          locationData.longitude
        );
      },
      (geoError) => {
        console.error("GPS error:", geoError);

        let message = "Unable to access your location";

        if (geoError.code === 1) {
          message =
            "Location permission denied. Please allow location access.";
        } else if (geoError.code === 2) {
          message = "Location unavailable. Try again.";
        } else if (geoError.code === 3) {
          message = "Location request timed out.";
        }

        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [getWeatherData]);

  useEffect(() => {
    getCurrentLocation();

    const interval = window.setInterval(() => {
      getCurrentLocation();
    }, 60000);

    return () => window.clearInterval(interval);
  }, [getCurrentLocation]);

  const formatNumber = (value: unknown, digits = 2) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(digits) : "0.00";
  };

  return (
    <section className="min-h-screen bg-[#080808] px-5 py-12 text-white">
      {/* Heading */}
      <div className="mx-auto mb-12 max-w-7xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          🛰️ Live Location Monitoring
        </h1>

        <p className="mt-4 text-lg text-gray-300">
          Real-time weather, rainfall, and risk assessment at your exact GPS
          coordinates
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Data sources: Open-Meteo API • Browser Geolocation • Open Elevation
          API
        </p>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold">RAKSHAK</h2>
            <p className="text-gray-300">
              Real-Time Landslide Risk Monitoring
            </p>
          </div>

          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-gray-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🔄 {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Location Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-8 shadow-2xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-3xl">📍</span>

            <div>
              <h3 className="text-xl font-semibold">Live Location</h3>
              <p className="text-sm text-gray-400">
                GPS position updated automatically
              </p>
            </div>

            <span className="ml-auto rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs text-green-300">
              ● LIVE
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm text-gray-400">Latitude</p>
              <p className="text-lg font-medium">
                {location
                  ? `${formatNumber(location.latitude, 6)}°`
                  : "Detecting..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Longitude</p>
              <p className="text-lg font-medium">
                {location
                  ? `${formatNumber(location.longitude, 6)}°`
                  : "Detecting..."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Accuracy</p>
              <p className="text-lg font-medium">
                {location
                  ? `±${Math.round(location.accuracy)}m`
                  : "Detecting..."}
              </p>
            </div>
          </div>
        </div>

        {/* Live Weather Data */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm text-gray-400">🌡️ Temperature</p>
            <p className="mt-3 text-3xl font-bold">
              {weather ? `${formatNumber(weather.temperature, 1)}°C` : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm text-gray-400">🌧️ Rainfall</p>
            <p className="mt-3 text-3xl font-bold">
              {weather ? `${formatNumber(weather.rainfall, 2)} mm` : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm text-gray-400">💨 Wind Speed</p>
            <p className="mt-3 text-3xl font-bold">
              {weather ? `${formatNumber(weather.windSpeed, 1)} km/h` : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-sm text-gray-400">⛰️ Elevation</p>
            <p className="mt-3 text-3xl font-bold">
              {weather ? `${formatNumber(weather.elevation, 0)} m` : "--"}
            </p>
          </div>
        </div>

        {/* Additional Data */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">💧 Humidity</p>
              <p className="mt-2 text-xl font-semibold">
                {weather ? `${formatNumber(weather.humidity, 0)}%` : "--"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">🌦️ Precipitation</p>
              <p className="mt-2 text-xl font-semibold">
                {weather
                  ? `${formatNumber(weather.precipitation, 2)} mm`
                  : "--"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">🕒 Last Updated</p>
              <p className="mt-2 text-xl font-semibold">
                {lastUpdated ?? "Updating..."}
              </p>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Data sources: Open-Meteo weather API • Browser Geolocation API
          </p>

          <p className="mt-2">
            Last updated: {lastUpdated ?? "Fetching live data..."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveLocationMonitoring;