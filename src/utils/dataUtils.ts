/**
 * Utility functions for converting real data to visualization parameters
 */

/**
 * Convert rainfall intensity (mm/h) to rain visualization level
 */
export function getRainIntensityFromMM(
  mmPerHour: number
): "low" | "moderate" | "high" | "extreme" | "none" {
  if (mmPerHour === 0) return "none";
  if (mmPerHour < 2.5) return "low";
  if (mmPerHour < 7.5) return "moderate";
  if (mmPerHour < 15) return "high";
  return "extreme";
}

/**
 * Format a number with appropriate precision
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Get compass direction from degrees
 */
export function degreesToCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Check if data quality is acceptable
 */
export function isDataAcceptable(quality: string, accuracy?: number): boolean {
  if (quality === 'OBSERVED') return true;
  if (quality === 'MODEL_ESTIMATE') return true;
  if (accuracy !== undefined && accuracy > 100) return false;
  return true;
}
