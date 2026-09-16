import {
  RiskData,
  mockRiskData,
} from "../data/mockRiskData";

/* =====================================================
   FETCH RISK DATA
===================================================== */

export async function fetchRiskData(
  location: string
): Promise<RiskData> {
  // Simulate API request delay
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1800);
  });

  const data = mockRiskData[location];

  if (!data) {
    throw new Error(
      `No data available for location: ${location}`
    );
  }

  // Return a new object to avoid mutating mock data
  return {
    ...data,

    rainfall: data.rainfall
      ? { ...data.rainfall }
      : undefined,

    terrain: data.terrain
      ? { ...data.terrain }
      : undefined,

    deformation: data.deformation
      ? { ...data.deformation }
      : undefined,

    weather: data.weather
      ? { ...data.weather }
      : undefined,
  };
}

/* =====================================================
   GET AVAILABLE LOCATIONS
===================================================== */

export function getAvailableLocations(): string[] {
  return Object.keys(mockRiskData);
}

/* =====================================================
   GET RISK COLOR
===================================================== */

export function getRiskColor(
  level: RiskData["riskLevel"]
): string {
  switch (level) {
    case "LOW":
      return "#22c55e";

    case "MODERATE":
      return "#eab308";

    case "HIGH":
      return "#f97316";

    case "VERY HIGH":
      return "#ef4444";

    case "CRITICAL":
      return "#991b1b";

    default:
      return "#6b7280";
  }
}

/* =====================================================
   GET RISK LABEL
===================================================== */

export function getRiskLabel(
  level: RiskData["riskLevel"]
): string {
  switch (level) {
    case "LOW":
      return "Low Risk";

    case "MODERATE":
      return "Moderate Risk";

    case "HIGH":
      return "High Risk";

    case "VERY HIGH":
      return "Very High Risk";

    case "CRITICAL":
      return "Critical Risk";

    default:
      return "Unknown Risk";
  }
}

/* =====================================================
   GET RISK DESCRIPTION
===================================================== */

export function getRiskDescription(
  level: RiskData["riskLevel"]
): string {
  switch (level) {
    case "LOW":
      return "Low probability of landslide occurrence.";

    case "MODERATE":
      return "Moderate risk. Continuous monitoring recommended.";

    case "HIGH":
      return "High risk. Local authorities should remain alert.";

    case "VERY HIGH":
      return "Very high risk. Immediate precautionary measures recommended.";

    case "CRITICAL":
      return "Critical risk. Emergency response and evacuation readiness required.";

    default:
      return "Risk level unavailable.";
  }
}

/* =====================================================
   GET RISK NUMERIC SCORE
===================================================== */

export function getRiskScore(
  level: RiskData["riskLevel"]
): number {
  switch (level) {
    case "LOW":
      return 20;

    case "MODERATE":
      return 40;

    case "HIGH":
      return 60;

    case "VERY HIGH":
      return 80;

    case "CRITICAL":
      return 100;

    default:
      return 0;
  }
}