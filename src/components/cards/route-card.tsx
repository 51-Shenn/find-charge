import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { PremiumCard } from '@/components/ui/premium-card';
import { Brand, Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import type { RouteOption } from '@/types/charge';

function Metric({ icon, value }: { icon: 'clock' | 'payments' | 'bolt'; value: string }) {
  const theme = useChargeTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <AppIcon name={icon} color={theme.textSecondary} size={16} />
      <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

export function RouteCard({
  route,
  selected,
  onPress,
}: {
  route: RouteOption;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useChargeTheme();
  const totalMinutes = route.driveMinutes + route.chargeMinutes;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
      <PremiumCard
        glow={route.recommended}
        style={{
          gap: 15,
          borderColor: selected || route.recommended ? Brand.primary : theme.border,
          borderWidth: selected || route.recommended ? 1.5 : 1,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text selectable style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
                {route.name}
              </Text>
              {route.recommended ? (
                <View
                  style={{
                    backgroundColor: Brand.primary,
                    borderRadius: Radius.pill,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}>
                  <Text style={{ color: '#14120C', fontSize: 9, fontWeight: '900' }}>RECOMMENDED</Text>
                </View>
              ) : null}
            </View>
            <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
              {route.subtitle}
            </Text>
          </View>
          <Text
            selectable
            style={{ color: theme.text, fontSize: 25, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
            RM{route.costRm.toFixed(0)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Metric icon="clock" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} />
          <Metric icon="bolt" value={`${route.chargeMinutes} min charge`} />
          <Metric icon="payments" value={`${route.stops} stop${route.stops > 1 ? 's' : ''}`} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 13,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{route.distanceKm} km</Text>
          <Text style={{ color: Brand.success, fontSize: 12, fontWeight: '800' }}>
            Arrive with {route.arrivalBattery}%
          </Text>
        </View>
      </PremiumCard>
    </Pressable>
  );
}
