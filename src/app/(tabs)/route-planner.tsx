import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { RouteCard } from '@/components/cards/route-card';
import { ChargerMap } from '@/components/map/charger-map';
import { AppIcon } from '@/components/ui/app-icon';
import { PrimaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { chargers, routeOptions, vehicles } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import { useAppStore } from '@/store/app-store';

const routeLine = [
  { latitude: 3.1579, longitude: 101.7123 },
  { latitude: 3.1488, longitude: 101.7137 },
  { latitude: 3.12, longitude: 101.68 },
  { latitude: 3.0733, longitude: 101.607 },
];

function LocationInput({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  const theme = useChargeTheme();
  return (
    <Pressable
      style={({ pressed }) => ({
        minHeight: 62,
        borderRadius: Radius.control,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: pressed ? theme.backgroundSelected : theme.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.border,
      })}>
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: accent }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>
          {label.toUpperCase()}
        </Text>
        <Text selectable style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
          {value}
        </Text>
      </View>
      <AppIcon name="chevron" color={theme.textSecondary} size={18} />
    </Pressable>
  );
}

export default function RoutePlannerScreen() {
  const theme = useChargeTheme();
  const selectedVehicleId = useAppStore((state) => state.selectedVehicleId);
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId) ?? vehicles[0];
  const [selectedRoute, setSelectedRoute] = useState(routeOptions[0].id);

  return (
    <Screen tabbed eyebrow="Range-aware routing" title="Plan your trip">
      <PremiumCard hero style={{ gap: 10 }}>
        <LocationInput label="From" value="Current location - Kuala Lumpur" accent={Brand.primary} />
        <View style={{ alignItems: 'center', height: 10 }}>
          <View style={{ width: 2, height: 20, backgroundColor: theme.border, position: 'absolute', top: -5 }} />
        </View>
        <LocationInput label="To" value="George Town, Penang" accent={Brand.route} />
      </PremiumCard>

      <PremiumCard glow style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 17,
              backgroundColor: 'rgba(254,201,45,0.13)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon name="car" color={Brand.primary} size={27} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
              {vehicle.batteryKwh} kWh - {vehicle.connector}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text
              selectable
              style={{ color: theme.text, fontSize: 24, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
              68%
            </Text>
            <Text style={{ color: Brand.success, fontSize: 11, fontWeight: '700' }}>309 km</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {['Arrive with 15%+', 'Prefer DC fast', 'Avoid queues'].map((item) => (
            <View
              key={item}
              style={{
                borderRadius: Radius.pill,
                paddingHorizontal: 10,
                paddingVertical: 7,
                backgroundColor: theme.surfaceElevated,
              }}>
              <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700' }}>{item}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <ChargerMap chargers={chargers.slice(0, 5)} selectedId="chargeev-sunway" route={routeLine} height={250} />

      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: theme.text, fontSize: 20, fontWeight: '900' }}>
          Route options
        </Text>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 19 }}>
          Compared by travel time, charging cost, queue risk, and arrival battery.
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {routeOptions.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            selected={selectedRoute === route.id}
            onPress={() => setSelectedRoute(route.id)}
          />
        ))}
      </View>

      <PrimaryButton icon="route" onPress={() => router.push('/route/comparison')}>
        Compare routes
      </PrimaryButton>
    </Screen>
  );
}
