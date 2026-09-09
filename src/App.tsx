import React, { useState, useCallback, lazy, Suspense, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RiskData, locations, mockRiskData } from "./data/mockRiskData";
import { fetchRiskData } from "./services/riskApi";
import { useInView, useToast, useReducedMotion } from "./hooks/useAnimations";

// Lazy load heavy components
const RainScene = lazy(() => import("./components/visualization/RainScene"));
const TerrainScene = lazy(() => import("./components/visualization/TerrainScene"));
const RiskMap = lazy(() => import("./components/map/RiskMap"));
const IndiaOverviewMap = lazy(() => import("./components/map/IndiaOverviewMap"));

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
import ScrollProgress from "./components/ui/ScrollProgress";
import ParallaxBackground from "./components/ui/ParallaxBackground";
import SectionDivider from "./components/ui/SectionDivider";
import ScrollHeroFade from "./components/ui/ScrollHeroFade";
import GpsTracker from "./components/map/GpsTracker";
import LiveDashboard from "./components/live/LiveDashboard";
import { AnimeReveal, AnimeStagger, AnimeCounter, AnimeProgressBar, AnimeTextSplit } from "./components/ui/AnimeEffects";
import MagneticButton from "./components/ui/MagneticButton";
import SectionTitle from "./components/ui/SectionTitle";
import { ScrollReveal, StaggerContainer, StaggerItem, ParallaxSection, TextReveal } from "./components/ui/ScrollEffects";

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
  Navigation,
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
    { id: "live", label: "Live AI" },
    { id: "terrain", label: "Terrain" },
    { id: "rainfall", label: "Rainfall" },
    { id: "deformation", label: "Deformation" },
    { id: "map", label: "India Network" },
    { id: "pipeline", label: "How it Works" },
  ];

  return (
    <div className="min-h-screen bg-earth-900 text-gray-200">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm tracking-wider">RAKSHAK</span>
            <span className="hidden sm:inline text-[10px] text-gray-500 ml-1 px-1.5 py-0.5 rounded bg-white/5">
              Landslide Early Warning
            </span>
            <span className="hidden md:flex items-center gap-1.5 ml-2 text-[10px] text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ML ACTIVE
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
            <a
              href="#dashboard"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              title="GPS Track My Location"
            >
              <Navigation className="w-3 h-3" />
              GPS
            </a>
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
        <ScrollHeroFade>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <ScrollReveal direction="fade" delay={0.2}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">System Active — Monitoring 6 Locations</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4} distance={80}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              <TextReveal text="Predict instability" className="block" delay={0.3} />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                <TextReveal text="before the slope fails." className="block" delay={0.6} />
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6}>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              RAKSHAK monitors India's landslide-prone Himalayan and Western Ghats regions by combining terrain susceptibility, 
              rainfall accumulation, ground deformation, geological conditions and historical landslide evidence to estimate dynamic landslide risk.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <MagneticButton
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
                strength={0.2}
              >
                Analyze Location
              </MagneticButton>
              <MagneticButton
                className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-colors"
                onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })}
                strength={0.2}
              >
                Explore System
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats bar */}
        <ScrollReveal direction="up" delay={1.2}>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 md:gap-10">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white">
                <AnimeCounter value={6} />
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Locations</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-white">
                <AnimeCounter value={24} suffix="/7" />
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Monitoring</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-emerald-400 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">System</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
        >
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
        </motion.div>
        </ScrollHeroFade>
      </section>

      {/* Location Search & Dashboard */}
      <section id="dashboard" ref={dashboardRef} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Location Selector */}
          <ScrollReveal direction="up" delay={0.1}>
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
              <GpsTracker onSelectLocation={handleLocationSelect} />
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
          </ScrollReveal>

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
              <ScrollReveal direction="up" delay={0.1}>
                <EarlyWarning data={riskData} />
              </ScrollReveal>

              {/* Main grid */}
              <StaggerContainer staggerDelay={0.15}>
                <div className="grid lg:grid-cols-2 gap-6">
                  <StaggerItem>
                    <RiskScore data={riskData} />
                  </StaggerItem>
                  <StaggerItem>
                    <RiskFactors data={riskData} />
                  </StaggerItem>
                </div>
              </StaggerContainer>

              {/* 3D Terrain */}
              <ScrollReveal direction="scale" delay={0.1}>
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
              </ScrollReveal>

              {/* Terrain Info */}
              <ScrollReveal direction="up" delay={0.1}>
                <TerrainInfo data={riskData} />
              </ScrollReveal>

              {/* Rainfall & Deformation */}
              <StaggerContainer staggerDelay={0.2}>
                <div className="grid lg:grid-cols-2 gap-6">
                  <StaggerItem>
                    <div id="rainfall">
                      <RainfallAnalysis data={riskData} />
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div id="deformation">
                      <GroundDeformation data={riskData} />
                    </div>
                  </StaggerItem>
                </div>
              </StaggerContainer>

              {/* India Overview Map */}
              <ScrollReveal direction="up" delay={0.1}>
                <div id="map" className="glass rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">
                      National Monitoring Network — India
                    </h3>
                  </div>
                  <div className="h-72 md:h-96 rounded-lg overflow-hidden mb-4">
                    <Suspense fallback={<div className="w-full h-full bg-earth-800 animate-pulse rounded-lg" />}>
                      <IndiaOverviewMap />
                    </Suspense>
                  </div>

                {/* Detailed Local Map */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <h4 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Local Risk Map — {riskData.location}
                  </h4>
                </div>
                <div className="h-64 md:h-80 rounded-lg overflow-hidden">
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
              </ScrollReveal>
            </div>
          )}
        </div>
      </section>

      {/* Live Real-Time Dashboard */}
      <SectionDivider variant="wave" />
      <section id="live" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Real-Time ML Prediction Engine</h2>
              <p className="text-gray-400">Live sensor data feeding ensemble ML models for dynamic risk assessment</p>
            </div>
            {riskData && <LiveDashboard baseData={riskData} />}
          </ScrollReveal>
        </div>
      </section>

      {/* Data Pipeline */}
      <SectionDivider variant="gradient" />
      <section id="pipeline" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.1}>
            <DataPipeline />
          </ScrollReveal>
        </div>
      </section>

      {/* ML Section */}
      <SectionDivider variant="dots" />
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="left" delay={0.1}>
            <MLSection />
          </ScrollReveal>
        </div>
      </section>

      {/* Historical Landslides */}
      <SectionDivider variant="wave" />
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="right" delay={0.1}>
            <HistoricalLandslides />
          </ScrollReveal>
        </div>
      </section>

      {/* Data Sources */}
      <SectionDivider variant="line" />
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.1}>
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
          </ScrollReveal>
        </div>
      </section>

      {/* System Status Bar */}
      <div className="border-t border-white/5 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-semibold">SYSTEM OPERATIONAL</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">ML Engine: <span className="text-blue-400 font-medium">Active</span></span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">Sensors: <span className="text-green-400 font-medium">8/8 Online</span></span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="text-gray-400 hidden sm:inline">Latency: <span className="text-green-400 font-medium">42ms</span></span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <span>RAKSHAK v2.1.0</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span>•</span>
            <span className="text-gray-400">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white">RAKSHAK</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Advanced landslide early warning and risk assessment system for India's vulnerable Himalayan and Western Ghats regions.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Technology</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>Ensemble ML (RF + XGBoost + NN)</li>
                <li>Real-time Sensor Networks</li>
                <li>InSAR Deformation Monitoring</li>
                <li>IMD Rainfall Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Data Partners</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>India Meteorological Dept. (IMD)</li>
                <li>Geological Survey of India (GSI)</li>
                <li>ISRO Remote Sensing</li>
                <li>NDMA Alert Systems</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-[10px] text-gray-600">
              Dynamic Risk Assessment — Estimated susceptibility, not guaranteed prediction.
            </div>
            <div className="text-[10px] text-gray-600">
              © 2024 RAKSHAK • Built for Disaster Risk Reduction
            </div>
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
