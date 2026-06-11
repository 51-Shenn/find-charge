import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { ConnectorBadge, StatusBadge } from '@/components/ui/badges';
import { AppIcon } from '@/components/ui/app-icon';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import { getCharger } from '@/services/chargers';

function StallMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const theme = useChargeTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 3 }}>
      <Text
        selectable
        style={{ color, fontSize: 26, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

export default function ChargerDetailsScreen() {
  const theme = useChargeTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const charger = getCharger(id);

  return (
    <Screen
      eyebrow={charger.operator}
      title={charger.stationName}
      right={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <IconButton icon="share" accessibilityLabel="Share station" />
          <IconButton icon="favorite" accessibilityLabel="Favorite station" />
        </View>
      }>
      <SecondaryButton icon="back" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
        Back
      </SecondaryButton>

      <PremiumCard hero glow style={{ gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text selectable style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 19 }}>
              {charger.address}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppIcon name="location" color={Brand.route} size={16} />
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
                {charger.distanceKm} km away - 8 min drive
              </Text>
            </View>
          </View>
          <StatusBadge status={charger.status} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 18,
            borderRadius: 22,
            backgroundColor: theme.surfaceElevated,
          }}>
          <StallMetric label="AVAILABLE" value={charger.availableStalls} color={Brand.success} />
          <View style={{ width: 1, backgroundColor: theme.border }} />
          <StallMetric label="OCCUPIED" value={charger.occupiedStalls} color={Brand.warning} />
          <View style={{ width: 1, backgroundColor: theme.border }} />
          <StallMetric label="OFFLINE" value={charger.offlineStalls} color={Brand.danger} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {charger.connectorTypes.map((connector) => (
            <ConnectorBadge key={connector} label={connector} />
          ))}
          <View
            style={{
              borderRadius: Radius.pill,
              paddingHorizontal: 10,
              paddingVertical: 7,
              backgroundColor: 'rgba(53,208,127,0.12)',
            }}>
            <Text style={{ color: Brand.success, fontSize: 11, fontWeight: '800' }}>
              Compatible with your EV
            </Text>
          </View>
        </View>
      </PremiumCard>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <PremiumCard style={{ flex: 1, gap: 5 }}>
          <AppIcon name="speed" color={Brand.primary} size={24} />
          <Text selectable style={{ color: theme.text, fontSize: 25, fontWeight: '900' }}>
            {charger.powerKw} kW
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Peak charging speed</Text>
        </PremiumCard>
        <PremiumCard style={{ flex: 1, gap: 5 }}>
          <AppIcon name="clock" color={Brand.info} size={24} />
          <Text selectable style={{ color: theme.text, fontSize: 25, fontWeight: '900' }}>
            24 min
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 11 }}>20% to 80% estimate</Text>
        </PremiumCard>
      </View>

      <PremiumCard style={{ gap: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: 3 }}>
            <Text selectable style={{ color: theme.text, fontSize: 18, fontWeight: '900' }}>
              Pricing
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Unified ChargeOne checkout</Text>
          </View>
          <Text
            selectable
            style={{ color: Brand.primary, fontSize: 24, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
            RM {charger.pricePerKwh.toFixed(2)}
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: theme.border }} />
        {[
          ['Estimated 32 kWh session', `RM ${(charger.pricePerKwh * 32).toFixed(2)}`],
          ['Idle fee', charger.idleFee],
          ['Parking', charger.parkingFee],
        ].map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{label}</Text>
            <Text selectable style={{ color: theme.text, fontSize: 12, fontWeight: '700', textAlign: 'right' }}>
              {value}
            </Text>
          </View>
        ))}
      </PremiumCard>

      <PremiumCard style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 18,
              backgroundColor: 'rgba(53,208,127,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon name="shield" color={Brand.success} size={26} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '900' }}>
              {charger.reliabilityScore}% reliability
            </Text>
            <Text selectable style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 17 }}>
              Live status verified 2 minutes ago. Typical wait is under 5 minutes.
            </Text>
          </View>
        </View>
      </PremiumCard>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SecondaryButton
          icon="navigation"
          style={{ flex: 1 }}
          onPress={() => router.push('/route/active-navigation')}>
          Navigate
        </SecondaryButton>
        <SecondaryButton
          icon="plus"
          style={{ flex: 1 }}
          onPress={() => router.push('/route/comparison')}>
          Add to route
        </SecondaryButton>
      </View>
      <PrimaryButton
        icon="bolt"
        onPress={() => router.push({ pathname: '/charging/payment', params: { chargerId: charger.id } })}>
        Start charging
      </PrimaryButton>
    </Screen>
  );
}
