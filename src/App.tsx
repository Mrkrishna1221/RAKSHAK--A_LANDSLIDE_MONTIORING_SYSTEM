import React, { useState, useCallback, lazy, Suspense, useRef, useEffect } from "react";
import { RiskData, locations, mockRiskData } from "./data/mockRiskData";
import { fetchRiskData } from "./services/riskApi";
import { useInView, useToast, useReducedMotion } from "./hooks/useAnimations";

// Lazy load heavy components
const RainScene = lazy(() => import("./components/visualization/RainScene"));
const TerrainScene = lazy(() => import("./components/visualization/TerrainScene"));
const RiskMap = lazy(() => import("./components/map/RiskMap"));

// Eager load lighter components
import RiskScore from "./components/risk/RiskScore";
import RiskFactors from "./components/risk/RiskFactors";
import RainfallAnalysis from "./components/rainfall/RainfallAnalysis";
import GroundDeformation from "./components/deformation/GroundDeformation";
import TerrainInfo from "./components/dashboard/TerrainInfo";
import DataPipeline from "./components/dashboard/DataPipeline";
import LoadingAnalysis from "./components/dashboard/LoadingAnalysis";
import EarlyWarning from "./components/alerts/EarlyWarning";
import MLSection from "./components/dashboard/MLSection";
import HistoricalLandslides from "./components/dashboard/HistoricalLandslides";
import Toast from "./components/ui/Toast";

import {
  Search,
  ChevronDown,
  Mountain,
  Shield,
  Database,
  MapPin,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

function App() {
  const [selectedLocation, setSelectedLocation] = useState("Mussoorie");
  const [riskData, setRiskData] = useState<RiskData | null>(mockRiskData["Mussoorie"]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const reducedMotion = useReducedMotion();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = useCallback(async () => {
    setShowDropdown(false);
    setIsAnalyzing(true);

    try {
      const data = await fetchRiskData(selectedLocation);
      const prevRisk = riskData?.probability || 0;

      setRiskData(data);
      setIsAnalyzing(false);

      // Show toast if risk changed significantly
      if (Math.abs(data.probability - prevRisk) > 10) {
        showToast(
          "Risk Updated",
          `${data.location} risk: ${prevRisk}% → ${data.probability}%`,
          `Primary driver: ${data.primaryDriver}`
        );
      }

      // Scroll to dashboard
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch {
      setIsAnalyzing(false);
    }
  }, [selectedLocation, riskData, showToast]);

  const handleLocationSelect = (name: string) => {
    setSelectedLocation(name);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const getRainIntensity = (): "low" | "moderate" | "high" | "extreme" => {
    if (!riskData) return "low";
    const mm24 = riskData.rainfall.twentyFourHour;
    if (mm24 > 120) return "extreme";
    if (mm24 > 80) return "high";
    if (mm24 > 40) return "moderate";
    return "low";
  };

  const navSections = [
    { id: "dashboard", label: "Dashboard" },
    { id: "terrain", label: "Terrain" },
    { id: "rainfall", label: "Rainfall" },
    { id: "deformation", label: "Deformation" },
    { id: "map", label: "Map" },
    { id: "pipeline", label: "How it Works" },
  ];

  return (
    <div className="min-h-screen bg-earth-900 text-gray-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm tracking-wider">RAKSHAK</span>
            <span className="hidden sm:inline text-[10px] text-gray-500 ml-1 px-1.5 py-0.5 rounded bg-white/5">
              Landslide Early Warning
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 p-4 space-y-2">
            {navSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-sm text-gray-400 hover:text-gray-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-earth-900" />}>
          {!reducedMotion && <RainScene rainIntensity={getRainIntensity()} />}
        </Suspense>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-earth-900/60 via-transparent to-earth-900 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900/40 via-transparent to-earth-900/40 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">System Active — Monitoring 6 Locations</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Predict instability
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              before the slope fails.
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            RAKSHAK combines terrain susceptibility, rainfall accumulation, ground deformation,
            geological conditions and historical landslide evidence to estimate dynamic landslide risk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#dashboard"
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              Analyze Location
            </a>
            <a
              href="#pipeline"
              className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-colors"
            >
              Explore System
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
        </div>
      </section>

      {/* Location Search & Dashboard */}
      <section id="dashboard" ref={dashboardRef} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Location Selector */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                Location Search
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  aria-label="Search location"
                />

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass-strong rounded-lg border border-white/10 overflow-hidden z-30">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => handleLocationSelect(loc.name)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${
                          selectedLocation === loc.name ? "bg-blue-500/10 text-blue-300" : "text-gray-300"
                        }`}
                      >
                        <span>{loc.name}, {loc.region}</span>
                        {selectedLocation === loc.name && (
                          <span className="text-xs text-blue-400">Selected</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "ANALYZE"
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {locations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleLocationSelect(loc.name)}
                  className={`px-3 py-1 rounded-md text-xs transition-colors ${
                    selectedLocation === loc.name
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="mb-8">
              <LoadingAnalysis onComplete={() => {}} />
            </div>
          )}

          {/* Dashboard Content */}
          {riskData && !isAnalyzing && (
            <div className="space-y-6">
              {/* Early Warning */}
              <EarlyWarning data={riskData} />

              {/* Main grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <RiskScore data={riskData} />
                <RiskFactors data={riskData} />
              </div>

              {/* 3D Terrain */}
              <div id="terrain" className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mountain className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
                    3D Risk Terrain
                  </h3>
                </div>
                <div className="h-64 md:h-80 rounded-lg overflow-hidden bg-earth-800">
                  <Suspense fallback={<div className="w-full h-full bg-earth-800 animate-pulse" />}>
                    <TerrainScene
                      riskLevel={riskData.riskLevel}
                      rainfallIntensity={riskData.rainfall.twentyFourHour}
                      deformationLevel={riskData.deformation.current}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Terrain Info */}
              <TerrainInfo data={riskData} />

              {/* Rainfall & Deformation */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div id="rainfall">
                  <RainfallAnalysis data={riskData} />
                </div>
                <div id="deformation">
                  <GroundDeformation data={riskData} />
                </div>
              </div>

              {/* Map */}
              <div id="map" className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
                    Risk Map — {riskData.location}
                  </h3>
                </div>
                <div className="h-72 md:h-96 rounded-lg overflow-hidden">
                  <Suspense fallback={<div className="w-full h-full bg-earth-800 animate-pulse rounded-lg" />}>
                    <RiskMap
                      latitude={riskData.latitude}
                      longitude={riskData.longitude}
                      riskLevel={riskData.riskLevel}
                      location={riskData.location}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Data Pipeline */}
      <section id="pipeline" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <DataPipeline />
        </div>
      </section>

      {/* ML Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <MLSection />
        </div>
      </section>

      {/* Historical Landslides */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <HistoricalLandslides />
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Database className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
                Data Sources
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "IMD Rainfall", desc: "India Meteorological Department precipitation data", status: "demo" },
                { name: "SRTM Terrain", desc: "Shuttle Radar Topography Mission elevation data", status: "demo" },
                { name: "InSAR Deformation", desc: "Satellite radar interferometry surface displacement", status: "demo" },
                { name: "GSI Geology", desc: "Geological Survey of India geological maps", status: "demo" },
                { name: "NHPC Landslide Inventory", desc: "National historical landslide database", status: "demo" },
                { name: "Sentinel-2 Imagery", desc: "ESA optical satellite imagery for land cover", status: "demo" },
              ].map((source, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-200">{source.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      DEMO
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{source.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              All data sources shown are for demonstration purposes. In production, these would be connected to live data feeds and APIs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-gray-300">RAKSHAK</span>
            <span className="text-xs text-gray-500">Landslide Early Warning & Risk Assessment System</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Dynamic Risk Assessment — Not a guaranteed prediction</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Demo Mode Active</span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        detail={toast.detail}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;
