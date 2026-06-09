import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Station } from '@/types/database';

interface StationCardProps {
  station: Station;
  onPress?: (station: Station) => void;
}

export function StationCard({ station, onPress }: StationCardProps) {
  const fastChargers = station.connections.filter((c) => c.isFastCharge);
  const hasFastCharge = fastChargers.length > 0;
  const maxPower = Math.max(
    ...station.connections.map((c) => c.powerKW ?? 0),
    0
  );

  return (
    <TouchableOpacity onPress={() => onPress?.(station)} activeOpacity={0.7}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.header}>
          <ThemedText type="default" style={styles.name} numberOfLines={1}>
            {station.name}
          </ThemedText>
          {hasFastCharge && (
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>Fast</ThemedText>
            </View>
          )}
        </View>

        <ThemedText
          themeColor="textSecondary"
          style={styles.address}
          numberOfLines={2}
        >
          {station.address}
          {station.town ? `, ${station.town}` : ''}
        </ThemedText>

        <View style={styles.details}>
          <ThemedText themeColor="textSecondary" style={styles.detail}>
            {station.connections.length} connector
            {station.connections.length !== 1 ? 's' : ''}
          </ThemedText>
          {maxPower > 0 && (
            <ThemedText themeColor="textSecondary" style={styles.detail}>
              up to {maxPower} kW
            </ThemedText>
          )}
          {station.distance != null && (
            <ThemedText themeColor="textSecondary" style={styles.detail}>
              {station.distance.toFixed(1)} mi
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginHorizontal: Spacing.three,
    marginVertical: Spacing.half,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  name: {
    flex: 1,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  address: {
    fontSize: 13,
    marginBottom: Spacing.two,
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  detail: {
    fontSize: 12,
  },
});
