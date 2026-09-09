/**
 * Terrain Service - Real elevation data from Open-Meteo Elevation API
 * https://open-meteo.com/en/docs/elevation-api
 */

export interface TerrainData {
  elevation: number;
  slope: number; // estimated from surrounding points
  aspect: string;
  terrainType: string;
  timestamp: number;
  source: string;
  quality: 'OBSERVED' | 'MODEL_ESTIMATE';
}

class TerrainService {
  private readonly elevationApiUrl = 'https://api.open-meteo.com/v1/elevation';

  /**
   * Get elevation data for a location
   */
  async getTerrain(lat: number, lon: number): Promise<TerrainData> {
    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
      });

      const response = await fetch(`${this.elevationApiUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`Elevation API error: ${response.status}`);
      }

      const data = await response.json();
      const elevation = data.elevation?.[0] ?? 0;

      // Get surrounding points for slope estimation
      const surrounding = await this.getSurroundingElevations(lat, lon);
      const slope = this.calculateSlope(surrounding);
      const aspect = this.calculateAspect(surrounding);
      const terrainType = this.classifyTerrain(elevation, slope);

      return {
        elevation: Math.round(elevation),
        slope,
        aspect,
        terrainType,
        timestamp: Date.now(),
        source: 'Open-Meteo Elevation API',
        quality: 'OBSERVED',
      };
    } catch (error) {
      console.warn('Terrain service failed:', error);
      // Return minimal data on failure
      return {
        elevation: 0,
        slope: 0,
        aspect: 'N/A',
        terrainType: 'Unknown',
        timestamp: Date.now(),
        source: 'Unavailable',
        quality: 'MODEL_ESTIMATE',
      };
    }
  }

  /**
   * Get elevation data for surrounding points (for slope calculation)
   */
  private async getSurroundingElevations(
    lat: number,
    lon: number
  ): Promise<{ north: number; south: number; east: number; west: number; center: number }> {
    const offset = 0.01; // ~1km

    const lats = [lat + offset, lat - offset, lat, lat];
    const lons = [lon, lon, lon + offset, lon - offset];

    const params = new URLSearchParams({
      latitude: lats.join(','),
      longitude: lons.join(','),
    });

    try {
      const response = await fetch(`${this.elevationApiUrl}?${params}`);
      const data = await response.json();

      // Also get center point
      const centerParams = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
      });
      const centerResponse = await fetch(`${this.elevationApiUrl}?${centerParams}`);
      const centerData = await centerResponse.json();

      return {
        north: data.elevation?.[0] ?? 0,
        south: data.elevation?.[1] ?? 0,
        east: data.elevation?.[2] ?? 0,
        west: data.elevation?.[3] ?? 0,
        center: centerData.elevation?.[0] ?? 0,
      };
    } catch {
      return { north: 0, south: 0, east: 0, west: 0, center: 0 };
    }
  }

  /**
   * Calculate slope angle from surrounding elevations
   */
  private calculateSlope(surrounding: {
    north: number;
    south: number;
    east: number;
    west: number;
    center: number;
  }): number {
    const distance = 1110; // ~1km in meters at equator

    // Calculate gradients in N-S and E-W directions
    const nsGradient = (surrounding.north - surrounding.south) / (2 * distance);
    const ewGradient = (surrounding.east - surrounding.west) / (2 * distance);

    // Calculate slope angle
    const slopeRadians = Math.atan(Math.sqrt(nsGradient * nsGradient + ewGradient * ewGradient));
    const slopeDegrees = (slopeRadians * 180) / Math.PI;

    return Math.round(slopeDegrees * 10) / 10;
  }

  /**
   * Calculate aspect (direction of slope)
   */
  private calculateAspect(surrounding: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): string {
    const nsGradient = surrounding.north - surrounding.south;
    const ewGradient = surrounding.east - surrounding.west;

    // Calculate aspect angle (0-360 degrees)
    const aspectRadians = Math.atan2(-ewGradient, -nsGradient);
    let aspectDegrees = (aspectRadians * 180) / Math.PI;
    if (aspectDegrees < 0) aspectDegrees += 360;

    // Convert to compass direction
    if (aspectDegrees >= 337.5 || aspectDegrees < 22.5) return 'N';
    if (aspectDegrees >= 22.5 && aspectDegrees < 67.5) return 'NE';
    if (aspectDegrees >= 67.5 && aspectDegrees < 112.5) return 'E';
    if (aspectDegrees >= 112.5 && aspectDegrees < 157.5) return 'SE';
    if (aspectDegrees >= 157.5 && aspectDegrees < 202.5) return 'S';
    if (aspectDegrees >= 202.5 && aspectDegrees < 247.5) return 'SW';
    if (aspectDegrees >= 247.5 && aspectDegrees < 292.5) return 'W';
    return 'NW';
  }

  /**
   * Classify terrain type based on elevation and slope
   */
  private classifyTerrain(elevation: number, slope: number): string {
    if (elevation > 3000) {
      return slope > 30 ? 'Alpine Steep' : 'Alpine';
    }
    if (elevation > 1500) {
      return slope > 25 ? 'Mountain Steep' : 'Mountain';
    }
    if (elevation > 500) {
      return slope > 20 ? 'Hilly Steep' : 'Hilly';
    }
    if (elevation > 100) {
      return slope > 15 ? 'Undulating' : 'Plains';
    }
    return 'Lowland';
  }
}

export const terrainService = new TerrainService();
