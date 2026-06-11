import { Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/theme';
import type { Charger } from '@/types/charge';

export function ChargerMap({
  chargers,
  selectedId,
  onSelect,
  height = 300,
}: {
  chargers: Charger[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  route?: { latitude: number; longitude: number }[];
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        borderRadius: Radius.hero,
        overflow: 'hidden',
        backgroundColor: '#17191F',
        padding: 22,
        justifyContent: 'space-around',
      }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: '48%', height: 5, backgroundColor: Brand.route }} />
      {chargers.slice(0, 5).map((charger, index) => (
        <Text
          key={charger.id}
          onPress={() => onSelect?.(charger.id)}
          style={{
            position: 'absolute',
            left: 28 + ((index * 67) % 270),
            top: 42 + ((index * 53) % Math.max(height - 90, 70)),
            minWidth: 38,
            height: 38,
            borderRadius: 14,
            padding: 10,
            color: charger.id === selectedId ? '#14120C' : '#FFFFFF',
            backgroundColor: charger.id === selectedId ? Brand.primary : '#20232B',
            textAlign: 'center',
            fontWeight: '900',
          }}>
          {charger.availableStalls}
        </Text>
      ))}
    </View>
  );
}
