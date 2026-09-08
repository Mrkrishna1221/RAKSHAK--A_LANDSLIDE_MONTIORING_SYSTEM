import { RiskData, mockRiskData } from "../data/mockRiskData";

export async function fetchRiskData(location: string): Promise<RiskData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const data = mockRiskData[location];
  if (!data) {
    throw new Error(`No data available for location: ${location}`);
  }

  return { ...data };
}

export function getAvailableLocations(): string[] {
  return Object.keys(mockRiskData);
}

export function getRiskColor(level: RiskData["riskLevel"]): string {
  switch (level) {
    case "LOW":
      return "#22c55e";
    case "MODERATE":
      return "#eab308";
    case "HIGH":
      return "#f97316";
    case "VERY_HIGH":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export function getRiskLabel(level: RiskData["riskLevel"]): string {
  switch (level) {
    case "LOW":
      return "Low Risk";
    case "MODERATE":
      return "Moderate Risk";
    case "HIGH":
      return "High Risk";
    case "VERY_HIGH":
      return "Very High Risk";
    default:
      return "Unknown";
  }
}
