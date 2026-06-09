import { useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { StationMap } from '@/components/map/station-map';
import { RoutePanel } from '@/components/map/route-panel';
import { useStations } from '@/hooks/use-stations';
import { useLocation } from '@/hooks/use-location';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { fetchRoute } from '@/lib/graphhopper';
import { useRouter } from 'expo-router';
import type { Station } from '@/types/database';
import type { RouteData } from '@/types/directions';

export default function MapScreen() {
  const router = useRouter();
  const { location, loading: locLoading, error: locError } = useLocation();
  const { stations, loading: stationsLoading } = useStations(
    location ? { latitude: location.latitude, longitude: location.longitude } : null
  );

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  function handleStationPress(station: Station) {
    if (Platform.OS === 'web') {
      setRouteData(null);
      setRouteError(null);
      setSelectedStation(station);
    } else {
      router.push(`/station/${station.id}` as any);
    }
  }

  async function handleNavigate(station: Station) {
    if (!location) return;

    setRouteLoading(true);
    setRouteError(null);

    try {
      const route = await fetchRoute(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: station.latitude, longitude: station.longitude }
      );
      setRouteData(route);
    } catch (err: any) {
      setRouteError(err.message ?? 'Failed to get route');
    } finally {
      setRouteLoading(false);
    }
  }

  function handleViewDetails(station: Station) {
    router.push(`/station/${station.id}` as any);
  }

  function handleClearRoute() {
    setSelectedStation(null);
    setRouteData(null);
    setRouteError(null);
  }

  function handleMapPress() {
    if (Platform.OS === 'web') {
      handleClearRoute();
    }
  }

  return (
    <ThemedView style={styles.container}>
      <StationMap
        stations={stations}
        onMarkerPress={handleStationPress}
        onMapPress={handleMapPress}
        userLocation={location}
        selectedStation={selectedStation}
        route={routeData}
        onNavigate={handleNavigate}
        onViewDetails={handleViewDetails}
      />

      {routeLoading && (
        <SafeAreaView style={styles.routeLoadingOverlay}>
          <ActivityIndicator size="small" />
          <Text style={styles.routeLoadingText}>Getting directions...</Text>
        </SafeAreaView>
      )}

      {routeError && (
        <SafeAreaView style={styles.routeErrorOverlay}>
          <Text style={styles.routeErrorText}>{routeError}</Text>
        </SafeAreaView>
      )}

      {routeData && selectedStation && Platform.OS === 'web' && (
        <RoutePanel
          station={selectedStation}
          route={routeData}
          onExit={handleClearRoute}
        />
      )}

      {(locLoading || stationsLoading) && (
        <SafeAreaView style={styles.loadingOverlay}>
          <ActivityIndicator size="small" />
        </SafeAreaView>
      )}

      {locError && (
        <SafeAreaView style={styles.errorOverlay}>
          <Text style={styles.errorText}>{locError}</Text>
        </SafeAreaView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: Spacing.three,
  },
  routeLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
    gap: 8,
  },
  routeLoadingText: {
    color: '#22c55e',
    fontSize: 13,
    fontWeight: '500',
  },
  routeErrorOverlay: {
    position: 'absolute',
    bottom: BottomTabInset + Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: 'rgba(239,68,68,0.9)',
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  routeErrorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
  errorOverlay: {
    position: 'absolute',
    bottom: BottomTabInset + Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: 'rgba(239,68,68,0.9)',
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
});
