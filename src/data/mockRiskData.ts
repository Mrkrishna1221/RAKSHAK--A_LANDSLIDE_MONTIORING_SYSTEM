export interface RiskData {
  location: string;
  latitude: number;
  longitude: number;
  probability: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  rainfall: {
    oneHour: number;
    sixHour: number;
    twentyFourHour: number;
    threeDay: number;
    sevenDay: number;
    thirtyDay: number;
  };
  terrain: {
    elevation: number;
    slope: number;
    aspect: string;
    curvature: number;
    roughness: number;
  };
  deformation: {
    current: number;
    velocity: number;
    acceleration: number;
    trend: "STABLE" | "INCREASING" | "ACCELERATING";
  };
  historicalRisk: number;
  factors: {
    name: string;
    value: number;
    severity: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  }[];
  riskChange24h: number;
  primaryDriver: string;
}

export interface LocationOption {
  name: string;
  region: string;
  lat: number;
  lng: number;
}

export const locations: LocationOption[] = [
  { name: "Mussoorie", region: "Uttarakhand", lat: 30.4598, lng: 78.0644 },
  { name: "Shimla", region: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  { name: "Darjeeling", region: "West Bengal", lat: 27.0360, lng: 88.2627 },
  { name: "Dehradun", region: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Kullu", region: "Himachal Pradesh", lat: 31.9606, lng: 77.1070 },
  { name: "Gangtok", region: "Sikkim", lat: 27.3314, lng: 88.6138 },
];

export const mockRiskData: Record<string, RiskData> = {
  Mussoorie: {
    location: "Mussoorie",
    latitude: 30.4598,
    longitude: 78.0644,
    probability: 82,
    riskLevel: "VERY_HIGH",
    rainfall: {
      oneHour: 12,
      sixHour: 48,
      twentyFourHour: 142,
      threeDay: 287,
      sevenDay: 412,
      thirtyDay: 680,
    },
    terrain: {
      elevation: 2184,
      slope: 37,
      aspect: "NE",
      curvature: -0.42,
      roughness: 0.68,
    },
    deformation: {
      current: 8.4,
      velocity: 2.1,
      acceleration: 0.34,
      trend: "ACCELERATING",
    },
    historicalRisk: 78,
    factors: [
      { name: "Ground deformation", value: 92, severity: "VERY_HIGH" },
      { name: "7-day rainfall accumulation", value: 85, severity: "HIGH" },
      { name: "Slope angle", value: 95, severity: "VERY_HIGH" },
      { name: "Historical susceptibility", value: 78, severity: "HIGH" },
      { name: "Geological conditions", value: 62, severity: "MODERATE" },
    ],
    riskChange24h: 21,
    primaryDriver: "Increasing ground deformation combined with high accumulated rainfall",
  },
  Shimla: {
    location: "Shimla",
    latitude: 31.1048,
    longitude: 77.1734,
    probability: 45,
    riskLevel: "MODERATE",
    rainfall: {
      oneHour: 4,
      sixHour: 18,
      twentyFourHour: 52,
      threeDay: 98,
      sevenDay: 145,
      thirtyDay: 320,
    },
    terrain: {
      elevation: 2276,
      slope: 28,
      aspect: "SW",
      curvature: -0.21,
      roughness: 0.54,
    },
    deformation: {
      current: 2.1,
      velocity: 0.4,
      acceleration: 0.02,
      trend: "STABLE",
    },
    historicalRisk: 52,
    factors: [
      { name: "Ground deformation", value: 35, severity: "LOW" },
      { name: "7-day rainfall accumulation", value: 48, severity: "MODERATE" },
      { name: "Slope angle", value: 58, severity: "MODERATE" },
      { name: "Historical susceptibility", value: 52, severity: "MODERATE" },
      { name: "Geological conditions", value: 42, severity: "MODERATE" },
    ],
    riskChange24h: -3,
    primaryDriver: "Moderate slope angle with stable ground conditions",
  },
  Darjeeling: {
    location: "Darjeeling",
    latitude: 27.0360,
    longitude: 88.2627,
    probability: 67,
    riskLevel: "HIGH",
    rainfall: {
      oneHour: 8,
      sixHour: 34,
      twentyFourHour: 98,
      threeDay: 195,
      sevenDay: 310,
      thirtyDay: 520,
    },
    terrain: {
      elevation: 2045,
      slope: 42,
      aspect: "SE",
      curvature: -0.55,
      roughness: 0.78,
    },
    deformation: {
      current: 5.2,
      velocity: 1.2,
      acceleration: 0.18,
      trend: "INCREASING",
    },
    historicalRisk: 85,
    factors: [
      { name: "Ground deformation", value: 68, severity: "HIGH" },
      { name: "7-day rainfall accumulation", value: 72, severity: "HIGH" },
      { name: "Slope angle", value: 88, severity: "VERY_HIGH" },
      { name: "Historical susceptibility", value: 85, severity: "VERY_HIGH" },
      { name: "Geological conditions", value: 55, severity: "MODERATE" },
    ],
    riskChange24h: 12,
    primaryDriver: "Steep slope angle with high historical susceptibility and increasing rainfall",
  },
  Dehradun: {
    location: "Dehradun",
    latitude: 30.3165,
    longitude: 78.0322,
    probability: 22,
    riskLevel: "LOW",
    rainfall: {
      oneHour: 2,
      sixHour: 8,
      twentyFourHour: 24,
      threeDay: 45,
      sevenDay: 78,
      thirtyDay: 180,
    },
    terrain: {
      elevation: 680,
      slope: 12,
      aspect: "N",
      curvature: 0.08,
      roughness: 0.32,
    },
    deformation: {
      current: 0.8,
      velocity: 0.1,
      acceleration: 0.0,
      trend: "STABLE",
    },
    historicalRisk: 28,
    factors: [
      { name: "Ground deformation", value: 15, severity: "LOW" },
      { name: "7-day rainfall accumulation", value: 22, severity: "LOW" },
      { name: "Slope angle", value: 18, severity: "LOW" },
      { name: "Historical susceptibility", value: 28, severity: "LOW" },
      { name: "Geological conditions", value: 35, severity: "LOW" },
    ],
    riskChange24h: -5,
    primaryDriver: "Low slope angle and stable ground conditions",
  },
  Kullu: {
    location: "Kullu",
    latitude: 31.9606,
    longitude: 77.1070,
    probability: 58,
    riskLevel: "HIGH",
    rainfall: {
      oneHour: 6,
      sixHour: 28,
      twentyFourHour: 82,
      threeDay: 165,
      sevenDay: 268,
      thirtyDay: 445,
    },
    terrain: {
      elevation: 1850,
      slope: 35,
      aspect: "E",
      curvature: -0.38,
      roughness: 0.62,
    },
    deformation: {
      current: 4.1,
      velocity: 0.9,
      acceleration: 0.12,
      trend: "INCREASING",
    },
    historicalRisk: 65,
    factors: [
      { name: "Ground deformation", value: 58, severity: "MODERATE" },
      { name: "7-day rainfall accumulation", value: 65, severity: "HIGH" },
      { name: "Slope angle", value: 72, severity: "HIGH" },
      { name: "Historical susceptibility", value: 65, severity: "HIGH" },
      { name: "Geological conditions", value: 48, severity: "MODERATE" },
    ],
    riskChange24h: 8,
    primaryDriver: "Increasing rainfall accumulation on steep terrain with moderate deformation",
  },
  Gangtok: {
    location: "Gangtok",
    latitude: 27.3314,
    longitude: 88.6138,
    probability: 74,
    riskLevel: "HIGH",
    rainfall: {
      oneHour: 10,
      sixHour: 42,
      twentyFourHour: 125,
      threeDay: 248,
      sevenDay: 385,
      thirtyDay: 610,
    },
    terrain: {
      elevation: 1650,
      slope: 40,
      aspect: "S",
      curvature: -0.48,
      roughness: 0.72,
    },
    deformation: {
      current: 6.8,
      velocity: 1.6,
      acceleration: 0.25,
      trend: "INCREASING",
    },
    historicalRisk: 72,
    factors: [
      { name: "Ground deformation", value: 78, severity: "HIGH" },
      { name: "7-day rainfall accumulation", value: 82, severity: "HIGH" },
      { name: "Slope angle", value: 82, severity: "VERY_HIGH" },
      { name: "Historical susceptibility", value: 72, severity: "HIGH" },
      { name: "Geological conditions", value: 58, severity: "MODERATE" },
    ],
    riskChange24h: 15,
    primaryDriver: "High rainfall accumulation with increasing ground deformation on steep slopes",
  },
};

export const deformationTimeline = [
  { day: "Day 1", value: 1.2 },
  { day: "Day 2", value: 1.4 },
  { day: "Day 3", value: 1.8 },
  { day: "Day 4", value: 2.1 },
  { day: "Day 5", value: 2.8 },
  { day: "Day 6", value: 3.5 },
  { day: "Day 7", value: 4.2 },
  { day: "Day 8", value: 5.1 },
  { day: "Day 9", value: 6.3 },
  { day: "Day 10", value: 7.8 },
  { day: "Day 11", value: 8.4 },
  { day: "Day 12", value: 9.2 },
  { day: "Day 13", value: 10.5 },
  { day: "Day 14", value: 11.8 },
];
