import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { fetchStationById } from '@/lib/openchargemap';
import { useFavorites } from '@/hooks/use-favorites';
import type { Station } from '@/types/database';

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchStationById(parseInt(id, 10));
        if (!cancelled) {
          setStation(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load station');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleToggleFavorite() {
    if (!station || favLoading) return;
    setFavLoading(true);
    try {
      await toggleFavorite(station);
    } finally {
      setFavLoading(false);
    }
  }

  function handleNavigate() {
    if (!station) return;
    const { latitude, longitude } = station;

    if (Platform.OS === 'web') {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        '_blank'
      );
    } else {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      );
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !station) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Could not load station details</ThemedText>
        {error && (
          <ThemedText themeColor="textSecondary" style={styles.errorText}>
            {error}
          </ThemedText>
        )}
      </ThemedView>
    );
  }

  const isFav = isFavorite(station.id);
  const maxPower = Math.max(...station.connections.map((c) => c.powerKW ?? 0), 0);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: station.name,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <SafeAreaView edges={['bottom']} style={styles.content}>
          <ThemedText type="title" style={styles.name}>
            {station.name}
          </ThemedText>

          <ThemedText themeColor="textSecondary" style={styles.address}>
            {station.address}
            {station.town ? `, ${station.town}` : ''}
            {station.state ? `, ${station.state}` : ''}
            {station.postcode ? ` ${station.postcode}` : ''}
          </ThemedText>

          {station.operator && (
            <ThemedText themeColor="textSecondary" style={styles.operator}>
              Operated by {station.operator}
            </ThemedText>
          )}

          {station.comments && (
            <ThemedText style={styles.comments}>{station.comments}</ThemedText>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <ThemedText type="default" style={styles.statValue}>
                {station.connections.length}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                Connectors
              </ThemedText>
            </View>
            {maxPower > 0 && (
              <View style={styles.statBox}>
                <ThemedText type="default" style={styles.statValue}>
                  {maxPower} kW
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                  Max Power
                </ThemedText>
              </View>
            )}
            {station.distance != null && (
              <View style={styles.statBox}>
                <ThemedText type="default" style={styles.statValue}>
                  {station.distance.toFixed(1)}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                  Miles
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="default" style={styles.sectionTitle}>
            Connectors
          </ThemedText>
          {station.connections.map((conn, idx) => (
            <ThemedView
              key={idx}
              type="backgroundElement"
              style={styles.connectorCard}
            >
              <View style={styles.connectorRow}>
                <ThemedText style={styles.connectorType}>
                  {conn.type}
                </ThemedText>
                {conn.isFastCharge && (
                  <View style={styles.fastBadge}>
                    <ThemedText style={styles.fastBadgeText}>Fast</ThemedText>
                  </View>
                )}
              </View>
              <View style={styles.connectorDetails}>
                {conn.powerKW && (
                  <ThemedText themeColor="textSecondary">
                    {conn.powerKW} kW
                  </ThemedText>
                )}
                {conn.quantity && (
                  <ThemedText themeColor="textSecondary">
                    {conn.quantity} connector{conn.quantity !== 1 ? 's' : ''}
                  </ThemedText>
                )}
              </View>
            </ThemedView>
          ))}

          {station.numberOfPoints != null && (
            <ThemedText style={styles.points}>
              {station.numberOfPoints} charging point
              {station.numberOfPoints !== 1 ? 's' : ''} at this location
            </ThemedText>
          )}

          {station.usageType && (
            <ThemedText style={styles.usage}>
              Usage: {station.usageType}
              {station.isPayAtLocation ? ' (Pay at location)' : ''}
            </ThemedText>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isFav ? styles.favButtonActive : styles.favButtonInactive,
              ]}
              onPress={handleToggleFavorite}
              disabled={favLoading}
            >
              <ThemedText
                style={[
                  styles.actionButtonText,
                  isFav && styles.actionButtonTextActive,
                ]}
              >
                {isFav ? 'Saved' : 'Save'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={handleNavigate}>
              <ThemedText style={styles.navButtonText}>
                Navigate
              </ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
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
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  name: {
    fontSize: 28,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  operator: {
    fontSize: 13,
  },
  comments: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    fontSize: 20,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: '600',
    marginTop: Spacing.two,
  },
  connectorCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  connectorType: {
    fontWeight: '500',
  },
  fastBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  fastBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  connectorDetails: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  points: {
    fontSize: 13,
  },
  usage: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  favButtonInactive: {
    backgroundColor: '#e5e7eb',
  },
  favButtonActive: {
    backgroundColor: '#3b82f6',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.one,
  },
});
