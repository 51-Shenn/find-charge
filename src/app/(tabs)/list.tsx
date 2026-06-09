import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StationCard } from '@/components/station-card';
import { useStations } from '@/hooks/use-stations';
import { useLocation } from '@/hooks/use-location';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import type { Station } from '@/types/database';

export default function ListScreen() {
  const router = useRouter();
  const { location, loading: locLoading, error: locError } = useLocation();
  const { stations, loading: stationsLoading } = useStations(
    location ? { latitude: location.latitude, longitude: location.longitude } : null
  );

  function handleStationPress(station: Station) {
    router.push(`/station/${station.id}` as any);
  }

  if (locLoading || stationsLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Finding nearby stations...</ThemedText>
      </ThemedView>
    );
  }

  if (locError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Could not get your location</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.errorDetail}>
          {locError}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <ThemedText type="subtitle">Nearby Stations</ThemedText>
      </SafeAreaView>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StationCard station={item} onPress={handleStationPress} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedView style={styles.centered}>
            <ThemedText>No stations found nearby</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  list: {
    paddingBottom: BottomTabInset + Spacing.three,
  },
  loadingText: {
    marginTop: Spacing.two,
  },
  errorDetail: {
    fontSize: 13,
    textAlign: 'center',
  },
});
