import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { ChargerMap } from '@/components/map/charger-map';
import { AppIcon } from '@/components/ui/app-icon';
import { IconButton, PrimaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand } from '@/constants/theme';
import { chargers } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';

const routeLine = [
  { latitude: 3.1579, longitude: 101.7123 },
  { latitude: 3.1488, longitude: 101.7137 },
  { latitude: 3.12, longitude: 101.68 },
  { latitude: 3.0733, longitude: 101.607 },
];

export default function ActiveNavigationScreen() {
  const theme = useChargeTheme();

  return (
    <Screen
      eyebrow="Navigation active"
      title="12 min to charger"
      right={<IconButton icon="close" accessibilityLabel="End navigation" onPress={() => router.back()} />}>
      <PremiumCard hero glow style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 66,
            height: 66,
            borderRadius: 23,
            backgroundColor: Brand.route,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppIcon name="navigation" color="#FFFFFF" size={35} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text selectable style={{ color: theme.text, fontSize: 25, fontWeight: '900' }}>
            Turn right
          </Text>
          <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
            In 450 m onto Jalan Ampang
          </Text>
        </View>
      </PremiumCard>

      <ChargerMap chargers={chargers.slice(0, 5)} selectedId="gentari-klcc" route={routeLine} height={390} />

      <PremiumCard style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              backgroundColor: 'rgba(254,201,45,0.13)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon name="bolt" color={Brand.primary} size={24} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '900' }}>Gentari @ Suria KLCC</Text>
            <Text style={{ color: Brand.success, fontSize: 12, fontWeight: '800' }}>4 stalls still available</Text>
          </View>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>4.2 km</Text>
        </View>
        <View style={{ height: 1, backgroundColor: theme.border }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            ['ETA', '7:14 PM'],
            ['Arrival', '55%'],
            ['Traffic', 'Light'],
          ].map(([label, value]) => (
            <View key={label} style={{ alignItems: 'center', gap: 3 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>{value}</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 10 }}>{label}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <PrimaryButton icon="bolt" onPress={() => router.push('/charging/payment')}>
        Reserve and pay
      </PrimaryButton>
    </Screen>
  );
}
