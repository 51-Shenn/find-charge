import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ConnectorBadge, StatusBadge } from '@/components/ui/badges';
import { AppIcon } from '@/components/ui/app-icon';
import { PremiumCard } from '@/components/ui/premium-card';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import type { Charger } from '@/types/charge';

export function ChargerCard({
  charger,
  recommended = false,
  onPress,
  index = 0,
}: {
  charger: Charger;
  recommended?: boolean;
  onPress?: () => void;
  index?: number;
}) {
  const theme = useChargeTheme();

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify()}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${charger.stationName}`}
        onPress={onPress}
        style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.985 : 1 }] })}>
        <PremiumCard glow={recommended} style={{ gap: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1, gap: 5 }}>
              {recommended ? (
                <Text
                  style={{
                    color: Brand.primary,
                    fontSize: 10,
                    fontWeight: '900',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  }}>
                  ChargeOne recommends
                </Text>
              ) : null}
              <Text selectable style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
                {charger.stationName}
              </Text>
              <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
                {charger.address}
              </Text>
            </View>
            <StatusBadge status={charger.status} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppIcon name="location" color={theme.textSecondary} size={16} />
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{charger.distanceKm} km</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppIcon name="speed" color={Brand.primary} size={17} />
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
                {charger.powerKw} kW
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppIcon name="payments" color={theme.textSecondary} size={16} />
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
                RM {charger.pricePerKwh.toFixed(2)}/kWh
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {charger.connectorTypes.map((connector) => (
              <ConnectorBadge key={connector} label={connector} />
            ))}
            <View style={{ flex: 1 }} />
            <Text style={{ color: Brand.success, fontSize: 12, fontWeight: '800' }}>
              {charger.availableStalls} stalls free
            </Text>
            <AppIcon name="chevron" color={theme.textSecondary} size={16} />
          </View>
        </PremiumCard>
      </Pressable>
    </Animated.View>
  );
}
