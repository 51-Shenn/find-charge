import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export interface LocationState {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let watchId: number | undefined;
    let nativeWatcher: { remove: () => void } | null = null;

    async function startWatching() {
      try {
        setLoading(true);
        setError(null);

        if (Platform.OS === 'web') {
          if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser');
          }

          watchId = navigator.geolocation.watchPosition(
            (pos) => {
              if (!cancelled) {
                setLocation({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                });
                setLoading(false);
              }
            },
            (err) => {
              if (!cancelled) {
                setError(err.message);
                setLoading(false);
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000,
            }
          );
        } else {
          const { watchPositionAsync, requestForegroundPermissionsAsync } =
            await import('expo-location');

          const { status } = await requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            throw new Error('Location permission was denied');
          }

          if (cancelled) return;

          const watcher = await watchPositionAsync(
            { accuracy: 5, timeInterval: 5000, distanceInterval: 10 },
            (pos) => {
              if (!cancelled) {
                setLocation({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                });
                setLoading(false);
              }
            }
          );

          nativeWatcher = watcher;
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to get location');
          setLoading(false);
        }
      }
    }

    startWatching();

    return () => {
      cancelled = true;
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      nativeWatcher?.remove();
    };
  }, []);

  return { location, error, loading };
}
