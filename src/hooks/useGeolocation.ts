import { useState, useCallback } from "react";

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback((): Promise<GeoPosition> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = "Geolocation is not supported by this browser";
        setError(err);
        setLoading(false);
        reject(new Error(err));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const geoPos: GeoPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
          setPosition(geoPos);
          setLoading(false);
          resolve(geoPos);
        },
        (err) => {
          let message = "Unable to get location";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              message = "Location permission denied. Please enable location access.";
              break;
            case err.POSITION_UNAVAILABLE:
              message = "Location information unavailable";
              break;
            case err.TIMEOUT:
              message = "Location request timed out";
              break;
          }
          setError(message);
          setLoading(false);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { position, error, loading, getCurrentPosition };
}
