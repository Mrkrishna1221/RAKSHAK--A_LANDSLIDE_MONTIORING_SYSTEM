/**
 * Location Service - Real GPS tracking
 * Uses browser Geolocation API with watchPosition for continuous updates
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
  status: 'acquiring' | 'active' | 'error' | 'denied' | 'unavailable';
  errorMessage?: string;
}

export interface LocationService {
  getCurrentLocation: () => Promise<LocationData>;
  watchLocation: (callback: (location: LocationData) => void) => () => void;
  stopWatching: () => void;
}

class LocationServiceImpl implements LocationService {
  private watchId: number | null = null;
  private lastLocation: LocationData | null = null;

  async getCurrentLocation(): Promise<LocationData> {
    if (!navigator.geolocation) {
      return {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: null,
        speed: null,
        heading: null,
        timestamp: Date.now(),
        status: 'unavailable',
        errorMessage: 'Geolocation not supported by this browser'
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: position.timestamp,
            status: 'active'
          };
          this.lastLocation = location;
          resolve(location);
        },
        (error) => {
          resolve({
            latitude: 0,
            longitude: 0,
            accuracy: 0,
            altitude: null,
            speed: null,
            heading: null,
            timestamp: Date.now(),
            status: error.code === 1 ? 'denied' : 'error',
            errorMessage: error.message
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute cache
        }
      );
    });
  }

  watchLocation(callback: (location: LocationData) => void): () => void {
    if (!navigator.geolocation) {
      callback({
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: null,
        speed: null,
        heading: null,
        timestamp: Date.now(),
        status: 'unavailable',
        errorMessage: 'Geolocation not supported'
      });
      return () => {};
    }

    // Initial status
    callback({
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      altitude: null,
      speed: null,
      heading: null,
      timestamp: Date.now(),
      status: 'acquiring'
    });

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
          status: 'active'
        };
        this.lastLocation = location;
        callback(location);
      },
      (error) => {
        callback({
          latitude: this.lastLocation?.latitude || 0,
          longitude: this.lastLocation?.longitude || 0,
          accuracy: this.lastLocation?.accuracy || 0,
          altitude: null,
          speed: null,
          heading: null,
          timestamp: Date.now(),
          status: error.code === 1 ? 'denied' : 'error',
          errorMessage: error.message
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000 // 30 seconds
      }
    );

    return () => this.stopWatching();
  }

  stopWatching(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

export const locationService = new LocationServiceImpl();
