import React from 'react';
import { useRakshakData } from '../hooks/useRakshakData';
import { getRiskColor, type RiskLevel } from '../services/risk';
import { getWeatherIcon, getWeatherDescription } from '../services/weather/providers/openmeteo';
import { MapPin, Cloud, Droplets, Mountain, AlertTriangle, RefreshCw, Navigation } from 'lucide-react';

export default function RealTimeDashboard() {
  const { location, weather, rainfall, terrain, risk, loading, error, lastUpdated, refresh, isStale } = useRakshakData();

  if (loading && !location) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Acquiring your location...</p>
          <p className="text-gray-400 text-sm mt-2">Please allow location access in your browser</p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="glass rounded-2xl p-8 max-w-md border border-red-500/30">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2 text-center">Unable to Load Data</h2>
          <p className="text-gray-300 mb-4 text-center text-sm">{error}</p>
          <button
            onClick={refresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const riskColor = risk ? getRiskColor(risk.level) : '#6b7280';

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">RAKSHAK</h1>
            <p className="text-gray-400 text-sm">Real-Time Landslide Risk Monitoring</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>

        {/* Stale data warning */}
        {isStale && (
          <div className="bg-yellow-900/50 border border-yellow-500/50 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">Data may be outdated. Last updated {Math.round((Date.now() - lastUpdated) / 60000)} minutes ago.</p>
          </div>
        )}

        {/* Location Card */}
        {location && location.status === 'active' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-white font-semibold mb-2">📍 Live Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Latitude</span>
                    <p className="text-white font-mono">{location.latitude.toFixed(6)}°</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Longitude</span>
                    <p className="text-white font-mono">{location.longitude.toFixed(6)}°</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Accuracy</span>
                    <p className="text-white">±{Math.round(location.accuracy)}m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Weather Card */}
          {weather && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Cloud className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                  <h2 className="text-white font-semibold">🌤️ Current Weather</h2>
                  <p className="text-gray-400 text-xs">{weather.current.source}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getWeatherIcon(weather.current.weatherCode)}</span>
                  <div>
                    <p className="text-white text-3xl font-bold">{Math.round(weather.current.temperature)}°C</p>
                    <p className="text-gray-400 text-sm">{getWeatherDescription(weather.current.weatherCode)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Feels like</span>
                    <p className="text-white">{Math.round(weather.current.apparentTemperature)}°C</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Humidity</span>
                    <p className="text-white">{weather.current.humidity}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Wind</span>
                    <p className="text-white">{Math.round(weather.current.windSpeed)} km/h</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Pressure</span>
                    <p className="text-white">{Math.round(weather.current.pressure)} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rainfall Card */}
          {rainfall && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Droplets className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h2 className="text-white font-semibold">🌧️ Rainfall</h2>
                  <p className="text-gray-400 text-xs">{rainfall.accumulation.source}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Current Intensity</p>
                  <p className="text-white text-2xl font-bold">{rainfall.accumulation.currentIntensity.toFixed(1)} mm/h</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Last 1h</span>
                    <p className="text-white">{rainfall.accumulation.last1Hour.toFixed(1)} mm</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last 6h</span>
                    <p className="text-white">{rainfall.accumulation.last6Hours.toFixed(1)} mm</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last 24h</span>
                    <p className="text-white">{rainfall.accumulation.last24Hours.toFixed(1)} mm</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last 7d</span>
                    <p className="text-white">{rainfall.accumulation.last7Days.toFixed(0)} mm</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-400 text-xs">Forecast (next 24h)</p>
                  <p className="text-white">{rainfall.forecastNext24h.toFixed(1)} mm</p>
                </div>
              </div>
            </div>
          )}

          {/* Terrain Card */}
          {terrain && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Mountain className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <h2 className="text-white font-semibold">⛰️ Terrain</h2>
                  <p className="text-gray-400 text-xs">{terrain.source}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Elevation</p>
                  <p className="text-white text-2xl font-bold">{terrain.elevation}m</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Slope</span>
                    <p className="text-white">{terrain.slope.toFixed(1)}°</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Aspect</span>
                    <p className="text-white">{terrain.aspect}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Type</span>
                    <p className="text-white">{terrain.terrainType}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Score Card */}
          {risk && (
            <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: riskColor }} />
                <div>
                  <h2 className="text-white font-semibold">🎯 RAKSHAK Risk Score</h2>
                  <p className="text-gray-400 text-xs">Environmental estimate • Not an official warning</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="text-6xl font-bold" style={{ color: riskColor }}>
                      {risk.score}
                    </p>
                    <p className="text-2xl text-gray-400">/100</p>
                  </div>
                  <div
                    className="inline-block px-4 py-2 rounded-lg font-bold text-white"
                    style={{ backgroundColor: riskColor }}
                  >
                    {risk.level}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Contributing Factors</h3>
                  <div className="space-y-2">
                    {Object.entries(risk.factors).map(([key, factor]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 capitalize">{key}</span>
                            <span className="text-white">{factor.score}/100</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${factor.score}%`,
                                backgroundColor: getRiskColor(
                                  factor.score > 70 ? 'CRITICAL' :
                                  factor.score > 50 ? 'HIGH' :
                                  factor.score > 30 ? 'ELEVATED' :
                                  factor.score > 15 ? 'MODERATE' : 'LOW'
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {risk.explanation.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-white font-semibold mb-2">Analysis</h3>
                  <ul className="space-y-1">
                    {risk.explanation.map((item, i) => (
                      <li key={i} className="text-gray-300 text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs italic">{risk.disclaimer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>Data sources: Open-Meteo (weather, rainfall, elevation) • Browser Geolocation API</p>
          <p className="mt-1">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}</p>
        </div>
      </div>
    </div>
  );
}
