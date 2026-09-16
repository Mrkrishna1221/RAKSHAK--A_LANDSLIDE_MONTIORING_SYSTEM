import React, {
  useState,
  useCallback,
  lazy,
  Suspense,
  useRef,
} from "react";

import { motion } from "framer-motion";

import {
  RiskData,
  locations,
  mockRiskData,
} from "./data/mockRiskData";

import { fetchRiskData } from "./services/riskApi";

import {
  useToast,
  useReducedMotion,
} from "./hooks/useAnimations";

// Lazy loaded components
const RainScene = lazy(
  () => import("./components/visualization/RainScene")
);

const TerrainScene = lazy(
  () => import("./components/visualization/TerrainScene")
);

const RiskMap = lazy(
  () => import("./components/map/RiskMap")
);

const IndiaOverviewMap = lazy(
  () => import("./components/map/IndiaOverviewMap")
);

// Components
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
import RealTimeDashboard from "./components/RealTimeDashboard";

import {
  AnimeCounter,
} from "./components/ui/AnimeEffects";

import MagneticButton from "./components/ui/MagneticButton";

import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "./components/ui/ScrollEffects";

import {
  Search,
  ChevronDown,
  Mountain,
  Shield,
  Database,
  MapPin,
  Menu,
  X,
  Navigation,
  MessageCircle,
  Send,
  Bot,
  UserRound,
  Minimize2,
} from "lucide-react";

/* =========================================================
   RAKSHAK AI CHATBOT
========================================================= */

interface RakshakChatbotProps {
  riskData: RiskData | null;
  selectedLocation: string;
}

function RakshakChatbot({
  riskData,
  selectedLocation,
}: RakshakChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<
    {
      id: number;
      sender: "bot" | "user";
      text: string;
    }[]
  >([
    {
      id: 1,
      sender: "bot",
      text: `Hello! I am RAKSHAK AI Assistant. I am monitoring ${selectedLocation}. Ask me about current risk, rainfall, terrain, deformation, safety or SOS.`,
    },
  ]);

  const safeNumber = (
    value: unknown,
    fallback = 0
  ): number => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  };

  const riskLevel = String(
    riskData?.riskLevel ?? "LOW"
  );

  const probability = safeNumber(
    riskData?.probability
  );

  const rainfall = safeNumber(
    riskData?.rainfall?.twentyFourHour
  );

  const slope = safeNumber(
    (riskData as any)?.terrain?.slope ??
      (riskData as any)?.slope
  );

  const deformation = safeNumber(
    (riskData as any)?.deformation?.current ??
      (riskData as any)?.deformation?.value
  );

  const generateResponse = (
    question: string
  ): string => {
    const q = question.toLowerCase();

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return `Hello! I am actively monitoring ${selectedLocation}. How can I help you?`;
    }

    if (
      q.includes("risk") ||
      q.includes("danger") ||
      q.includes("landslide")
    ) {
      return `Current landslide risk at ${selectedLocation} is ${riskLevel} with an estimated probability of ${probability.toFixed(
        0
      )}%. Primary driver: ${
        riskData?.primaryDriver ??
        "rainfall and terrain conditions"
      }.`;
    }

    if (
      q.includes("rain") ||
      q.includes("rainfall") ||
      q.includes("water")
    ) {
      return `The recorded 24-hour rainfall at ${selectedLocation} is approximately ${rainfall.toFixed(
        1
      )} mm. Continuous heavy rainfall can increase slope instability.`;
    }

    if (
      q.includes("terrain") ||
      q.includes("slope") ||
      q.includes("mountain")
    ) {
      return `The current terrain slope value is approximately ${slope.toFixed(
        1
      )}°. Steeper slopes may become more unstable during prolonged rainfall.`;
    }

    if (
      q.includes("deformation") ||
      q.includes("movement") ||
      q.includes("ground")
    ) {
      return `The current ground deformation reading is approximately ${deformation.toFixed(
        2
      )}. Increasing ground movement should be monitored carefully.`;
    }

    if (
      q.includes("safe") ||
      q.includes("safety") ||
      q.includes("precaution")
    ) {
      const upperRisk = riskLevel.toUpperCase();

      if (
        upperRisk.includes("HIGH") ||
        upperRisk.includes("CRITICAL")
      ) {
        return "Safety recommendation: avoid steep slopes, cracked ground, river channels and unstable roads. Move toward a safer open area and follow official local warnings.";
      }

      return "Safety recommendation: stay alert during heavy rain, avoid unstable slopes, keep emergency contacts ready and monitor official alerts.";
    }

    if (
      q.includes("sos") ||
      q.includes("emergency") ||
      q.includes("help")
    ) {
      return "If you are in immediate danger, use the SOS/emergency facility on the dashboard or call India's emergency number 112.";
    }

    if (
      q.includes("prediction") ||
      q.includes("ai") ||
      q.includes("confidence")
    ) {
      const confidence = Math.min(
        99,
        Math.max(
          50,
          Math.round(probability + 15)
        )
      );

      return `The AI engine estimates a ${probability.toFixed(
        0
      )}% landslide risk probability with an approximate confidence of ${confidence}%. This is an estimated assessment and not a guaranteed prediction.`;
    }

    if (
      q.includes("weather") ||
      q.includes("condition") ||
      q.includes("status")
    ) {
      return `Environmental status for ${selectedLocation}:
Risk: ${riskLevel}
Probability: ${probability.toFixed(0)}%
24-hour Rainfall: ${rainfall.toFixed(1)} mm
Terrain Slope: ${slope.toFixed(1)}°
Ground Deformation: ${deformation.toFixed(2)}`;
    }

    if (
      q.includes("location") ||
      q.includes("where")
    ) {
      return `Currently selected monitoring location is ${selectedLocation}.`;
    }

    return `I can help you with:

• Current landslide risk
• Rainfall status
• Terrain and slope
• Ground deformation
• AI prediction
• Safety recommendations
• Emergency SOS information`;
  };

  const sendMessage = () => {
    const trimmed = input.trim();

    if (!trimmed || isTyping) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "user",
        text: trimmed,
      },
    ]);

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(trimmed);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: response,
        },
      ]);

      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: `Chat restarted. I am ready to help you understand ${selectedLocation}.`,
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open RAKSHAK AI Assistant"
          className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-900/40 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={28} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-900" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] flex h-[590px] w-[390px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/95 shadow-2xl shadow-black/70 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-950/90 to-blue-950/90 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15">
                <Bot
                  size={23}
                  className="text-cyan-300"
                />

                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  RAKSHAK AI
                </h3>

                <p className="text-[10px] text-emerald-400">
                  ● Live Risk Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="rounded-lg px-2 py-1 text-[10px] text-slate-400 hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chatbot"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Minimize2 size={17} />
              </button>
            </div>
          </div>

          {/* Monitoring Status */}
          <div className="border-b border-white/5 bg-cyan-500/5 px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Monitoring:{" "}
                <span className="font-semibold text-cyan-300">
                  {selectedLocation}
                </span>
              </span>

              <span className="text-[10px] text-emerald-400">
                Live Data Connected
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">
                    <Bot
                      size={15}
                      className="text-cyan-300"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-slate-300"
                  }`}
                >
                  {message.text}
                </div>

                {message.sender === "user" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                    <UserRound
                      size={15}
                      className="text-blue-300"
                    />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10">
                  <Bot
                    size={15}
                    className="text-cyan-300"
                  />
                </div>

                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="border-t border-white/5 px-3 py-2">
            <div className="flex gap-2 overflow-x-auto">
              {[
                "Current risk?",
                "Rainfall status?",
                "Is it safe?",
                "Activate SOS",
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="whitespace-nowrap rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5 text-[10px] text-cyan-300 hover:bg-cyan-400/15"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-black/20 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 focus-within:border-cyan-400/40">
              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about landslide risk..."
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>

            <p className="mt-2 text-center text-[9px] text-slate-600">
              AI estimates are informational and not a replacement
              for official emergency instructions.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [selectedLocation, setSelectedLocation] =
    useState("Mussoorie");

  const [riskData, setRiskData] =
    useState<RiskData | null>(
      mockRiskData["Mussoorie"]
    );

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const {
    toast,
    showToast,
    hideToast,
  } = useToast();

  const reducedMotion = useReducedMotion();

  const dashboardRef =
    useRef<HTMLDivElement>(null);

  const filteredLocations = locations.filter(
    (location) =>
      location.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      location.region
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = useCallback(
    async () => {
      setShowDropdown(false);
      setIsAnalyzing(true);

      try {
        const data = await fetchRiskData(
          selectedLocation
        );

        const previousRisk =
          riskData?.probability ?? 0;

        setRiskData(data);
        setIsAnalyzing(false);

        if (
          Math.abs(
            (data.probability ?? 0) -
              previousRisk
          ) > 10
        ) {
          showToast(
            "Risk Updated",
            `${data.location} risk: ${previousRisk}% → ${data.probability}%`,
            `Primary driver: ${data.primaryDriver}`
          );
        }

        setTimeout(() => {
          dashboardRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } catch {
        setIsAnalyzing(false);
      }
    },
    [
      selectedLocation,
      riskData,
      showToast,
    ]
  );

  const handleLocationSelect = (
    name: string
  ) => {
    setSelectedLocation(name);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const getRainIntensity = ():
    | "low"
    | "moderate"
    | "high"
    | "extreme" => {
    if (!riskData) {
      return "low";
    }

    const rainfall = Number(
      riskData.rainfall?.twentyFourHour ?? 0
    );

    if (rainfall > 120) {
      return "extreme";
    }

    if (rainfall > 80) {
      return "high";
    }

    if (rainfall > 40) {
      return "moderate";
    }

    return "low";
  };

  const navSections = [
    {
      id: "realtime",
      label: "🛰️ Live",
    },
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "live",
      label: "Live AI",
    },
    {
      id: "terrain",
      label: "Terrain",
    },
    {
      id: "rainfall",
      label: "Rainfall",
    },
    {
      id: "deformation",
      label: "Deformation",
    },
    {
      id: "map",
      label: "India Network",
    },
    {
      id: "pipeline",
      label: "How it Works",
    },
  ];

  return (
    <div className="min-h-screen bg-earth-900 text-gray-200">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Background */}
      <ParallaxBackground />

      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 glass-strong">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />

            <span className="text-sm font-bold tracking-wider">
              RAKSHAK
            </span>

            <span className="ml-1 hidden rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-500 sm:inline">
              Landslide Early Warning
            </span>

            <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              ML ACTIVE
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-xs text-gray-400 transition-colors hover:text-gray-200"
              >
                {section.label}
              </a>
            ))}

            <a
              href="#dashboard"
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
            >
              <Navigation className="h-3 w-3" />
              GPS
            </a>
          </div>

          {/* Mobile Button */}
          <button
            className="rounded-lg p-2 hover:bg-white/5 md:hidden"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-white/5 p-4 md:hidden">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="block py-2 text-sm text-gray-400 hover:text-gray-200"
              >
                {section.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-earth-900" />
          }
        >
          {!reducedMotion && (
            <RainScene
              rainIntensity={getRainIntensity()}
            />
          )}
        </Suspense>

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-earth-900/60 via-transparent to-earth-900" />

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-earth-900/40 via-transparent to-earth-900/40" />

        <ScrollHeroFade>
          <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
            <ScrollReveal
              direction="fade"
              delay={0.2}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                <span className="text-xs text-gray-400">
                  System Active — Monitoring 6 Locations
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal
              direction="up"
              delay={0.4}
              distance={80}
            >
              <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
                <span className="mb-2 block">
                  Predict Instability
                </span>

                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Before the Slope Fails
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal
              direction="up"
              delay={0.6}
            >
              <p className="mx-auto max-w-[850px] text-sm leading-relaxed text-gray-400 md:text-base">
                RAKSHAK monitors India's landslide-prone
                Himalayan and Western Ghats regions by
                combining terrain susceptibility, rainfall
                accumulation, ground deformation, geological
                conditions and historical landslide evidence
                to estimate dynamic landslide risk.
              </p>
            </ScrollReveal>

            <ScrollReveal
              direction="up"
              delay={0.8}
            >
              <div className="flex items-center gap-6 py-4 md:gap-10">
                <div className="text-center">
                  <div className="text-xl font-bold text-white md:text-2xl">
                    <AnimeCounter value={6} />
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    Locations
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div className="text-center">
                  <div className="text-xl font-bold text-white md:text-2xl">
                    <AnimeCounter
                      value={24}
                      suffix="/7"
                    />
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    Monitoring
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div className="text-center">
                  <div className="flex items-center gap-1 text-xl font-bold text-emerald-400 md:text-2xl">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Active
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    System
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal
              direction="up"
              delay={1}
            >
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <MagneticButton
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                  onClick={() =>
                    document
                      .getElementById("dashboard")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  strength={0.2}
                >
                  Analyze Location
                </MagneticButton>

                <MagneticButton
                  className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
                  onClick={() =>
                    document
                      .getElementById("pipeline")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  strength={0.2}
                >
                  Explore System
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </ScrollHeroFade>

        <motion.div
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Scroll
          </span>

          <ChevronDown className="h-5 w-5 animate-bounce text-gray-500" />
        </motion.div>
      </section>

      {/* Real Time Dashboard */}
      <section
        id="realtime"
        className="px-4 py-16"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            direction="up"
            delay={0.1}
          >
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">
                🛰️ Live Location Monitoring
              </h2>

              <p className="text-gray-400">
                Real-time weather, rainfall, and risk
                assessment at your exact GPS coordinates
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Data sources: Open-Meteo API • Browser
                Geolocation • Open Elevation API
              </p>
            </div>

            <RealTimeDashboard />
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Main Dashboard */}
      <section
        id="dashboard"
        ref={dashboardRef}
        className="px-4 py-16"
      >
        <div className="mx-auto max-w-7xl">
          {/* Location Search */}
          <ScrollReveal
            direction="up"
            delay={0.1}
          >
            <div className="glass relative mb-8 rounded-xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />

                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Location Search
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(
                        event.target.value
                      );
                      setShowDropdown(true);
                    }}
                    onFocus={() =>
                      setShowDropdown(true)
                    }
                    onBlur={() =>
                      setTimeout(
                        () =>
                          setShowDropdown(false),
                        200
                      )
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 transition-colors focus:border-blue-500/50 focus:outline-none"
                  />

                  {showDropdown && (
                    <div className="glass-strong absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                      {filteredLocations.map(
                        (location) => (
                          <button
                            key={location.name}
                            onClick={() =>
                              handleLocationSelect(
                                location.name
                              )
                            }
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${
                              selectedLocation ===
                              location.name
                                ? "bg-blue-500/10 text-blue-300"
                                : "text-gray-300"
                            }`}
                          >
                            <span>
                              {location.name},{" "}
                              {location.region}
                            </span>

                            {selectedLocation ===
                              location.name && (
                              <span className="text-xs text-blue-400">
                                Selected
                              </span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analyzing...
                    </>
                  ) : (
                    "ANALYZE"
                  )}
                </button>

                <GpsTracker
                  onSelectLocation={
                    handleLocationSelect
                  }
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() =>
                      handleLocationSelect(
                        location.name
                      )
                    }
                    className={`rounded-md px-3 py-1 text-xs transition-colors ${
                      selectedLocation ===
                      location.name
                        ? "border border-blue-500/30 bg-blue-500/20 text-blue-300"
                        : "border border-white/5 bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Loading */}
          {isAnalyzing && (
            <div className="mb-8">
              <LoadingAnalysis onComplete={() => {}} />
            </div>
          )}

          {/* Dashboard Data */}
          {riskData && !isAnalyzing && (
            <div className="space-y-6">
              <ScrollReveal
                direction="up"
                delay={0.1}
              >
                <EarlyWarning data={riskData} />
              </ScrollReveal>

              <StaggerContainer staggerDelay={0.15}>
                <div className="grid gap-6 lg:grid-cols-2">
                  <StaggerItem>
                    <RiskScore data={riskData} />
                  </StaggerItem>

                  <StaggerItem>
                    <RiskFactors data={riskData} />
                  </StaggerItem>
                </div>
              </StaggerContainer>

              {/* Terrain */}
              <ScrollReveal
                direction="scale"
                delay={0.1}
              >
                <div
                  id="terrain"
                  className="glass rounded-xl p-6"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Mountain className="h-4 w-4 text-blue-400" />

                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                      3D Risk Terrain
                    </h3>
                  </div>

                  <div className="h-64 overflow-hidden rounded-lg bg-earth-800 md:h-80">
                    <Suspense
                      fallback={
                        <div className="h-full w-full animate-pulse bg-earth-800" />
                      }
                    >
                      <TerrainScene
                        riskLevel={
                          riskData.riskLevel
                        }
                        rainfallIntensity={Number(
                          riskData.rainfall
                            ?.twentyFourHour ?? 0
                        )}
                        deformationLevel={Number(
                          (riskData as any)
                            ?.deformation
                            ?.current ?? 0
                        )}
                      />
                    </Suspense>
                  </div>
                </div>
              </ScrollReveal>

              {/* Terrain Info */}
              <ScrollReveal
                direction="up"
                delay={0.1}
              >
                <TerrainInfo data={riskData} />
              </ScrollReveal>

              {/* Rainfall + Deformation */}
              <StaggerContainer staggerDelay={0.2}>
                <div className="grid gap-6 lg:grid-cols-2">
                  <StaggerItem>
                    <div id="rainfall">
                      <RainfallAnalysis
                        data={riskData}
                      />
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div id="deformation">
                      {/* FIXED: no data prop */}
                      <GroundDeformation />
                    </div>
                  </StaggerItem>
                </div>
              </StaggerContainer>

              {/* India Map */}
              <ScrollReveal
                direction="up"
                delay={0.1}
              >
                <div
                  id="map"
                  className="glass rounded-xl p-6"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />

                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                      National Monitoring Network — India
                    </h3>
                  </div>

                  <div className="mb-4 h-72 overflow-hidden rounded-lg md:h-96">
                    <Suspense
                      fallback={
                        <div className="h-full w-full animate-pulse rounded-lg bg-earth-800" />
                      }
                    >
                      <IndiaOverviewMap />
                    </Suspense>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-blue-400" />

                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Local Risk Map —{" "}
                      {riskData.location}
                    </h4>
                  </div>

                  <div className="h-64 overflow-hidden rounded-lg md:h-80">
                    <Suspense
                      fallback={
                        <div className="h-full w-full animate-pulse rounded-lg bg-earth-800" />
                      }
                    >
                      <RiskMap
                        latitude={
                          riskData.latitude
                        }
                        longitude={
                          riskData.longitude
                        }
                        riskLevel={
                          riskData.riskLevel
                        }
                        location={
                          riskData.location
                        }
                      />
                    </Suspense>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Live ML Dashboard */}
      <section
        id="live"
        className="px-4 py-16"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            direction="up"
            delay={0.1}
          >
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">
                Real-Time ML Prediction Engine
              </h2>

              <p className="text-gray-400">
                Live sensor data feeding ensemble ML
                models for dynamic risk assessment
              </p>
            </div>

            {riskData && <LiveDashboard />}
          </ScrollReveal>
        </div>
      </section>

      {/* Pipeline */}
      <SectionDivider variant="gradient" />

      <section
        id="pipeline"
        className="px-4 py-16"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            direction="up"
            delay={0.1}
          >
            <DataPipeline />
          </ScrollReveal>
        </div>
      </section>

      {/* ML Section */}
      <SectionDivider variant="dots" />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            direction="left"
            delay={0.1}
          >
            <MLSection />
          </ScrollReveal>
        </div>
      </section>

      {/* Historical Landslides */}
      <SectionDivider variant="wave" />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            direction="right"
            delay={0.1}
          >
            <HistoricalLandslides />
          </ScrollReveal>
        </div>
      </section>

      {/* Data Sources */}
      <SectionDivider variant="line" />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal
            direction="up"
            delay={0.1}
          >
            <div className="glass rounded-xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />

                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                  Data Sources
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "IMD Rainfall",
                    desc: "India Meteorological Department precipitation data",
                  },
                  {
                    name: "SRTM Terrain",
                    desc: "Shuttle Radar Topography Mission elevation data",
                  },
                  {
                    name: "InSAR Deformation",
                    desc: "Satellite radar interferometry surface displacement",
                  },
                  {
                    name: "GSI Geology",
                    desc: "Geological Survey of India geological maps",
                  },
                  {
                    name: "NHPC Landslide Inventory",
                    desc: "National historical landslide database",
                  },
                  {
                    name: "Sentinel-2 Imagery",
                    desc: "ESA optical satellite imagery for land cover",
                  },
                ].map((source) => (
                  <div
                    key={source.name}
                    className="rounded-lg border border-white/5 bg-white/[0.03] p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-200">
                        {source.name}
                      </span>

                      <span className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">
                        DEMO
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      {source.desc}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Data sources shown are for demonstration
                purposes. Production deployment can connect
                official live data feeds.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* System Status */}
      <div className="border-t border-white/5 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-[10px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

              <span className="font-semibold text-green-400">
                SYSTEM OPERATIONAL
              </span>
            </div>

            <span className="text-gray-500">|</span>

            <span className="text-gray-400">
              ML Engine:{" "}
              <span className="font-medium text-blue-400">
                Active
              </span>
            </span>

            <span className="text-gray-500">|</span>

            <span className="text-gray-400">
              Sensors:{" "}
              <span className="font-medium text-green-400">
                8/8 Online
              </span>
            </span>

            <span className="hidden text-gray-500 sm:inline">
              |
            </span>

            <span className="hidden text-gray-400 sm:inline">
              Latency:{" "}
              <span className="font-medium text-green-400">
                42ms
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span>RAKSHAK v2.1.0</span>
            <span>•</span>
            <span>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
            <span>•</span>
            <span className="text-gray-400">
              {new Date().toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              )}{" "}
              IST
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />

                <span className="font-bold text-white">
                  RAKSHAK
                </span>
              </div>

              <p className="text-xs leading-relaxed text-gray-500">
                Advanced landslide early warning and risk
                assessment system for India's vulnerable
                Himalayan and Western Ghats regions.
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
                Technology
              </h4>

              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>Ensemble ML Models</li>
                <li>Real-time Sensor Networks</li>
                <li>InSAR Deformation Monitoring</li>
                <li>Rainfall Integration</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
                Data Partners
              </h4>

              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>India Meteorological Department</li>
                <li>Geological Survey of India</li>
                <li>ISRO Remote Sensing</li>
                <li>NDMA Alert Systems</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-4 sm:flex-row">
            <div className="text-[10px] text-gray-600">
              Dynamic Risk Assessment — Estimated
              susceptibility, not guaranteed prediction.
            </div>

            <div className="text-[10px] text-gray-600">
              © 2024 RAKSHAK • Built for Disaster Risk
              Reduction
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <RakshakChatbot
        riskData={riskData}
        selectedLocation={selectedLocation}
      />

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