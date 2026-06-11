import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { PrimaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { vehicles } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import { useAppStore } from '@/store/app-store';

export default function EvSetupScreen() {
  const theme = useChargeTheme();
  const selectedId = useAppStore((state) => state.selectedVehicleId);
  const setSelectedId = useAppStore((state) => state.setSelectedVehicleId);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const selected = vehicles.find((vehicle) => vehicle.id === selectedId) ?? vehicles[0];
  const filtered = vehicles.filter((vehicle) =>
    `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(deferredSearch.toLowerCase()),
  );

  return (
    <Screen eyebrow="Step 1 of 2" title="Set up your EV">
      <PremiumCard hero glow style={{ alignItems: 'center', gap: 18, paddingVertical: 28 }}>
        <View
          style={{
            width: 128,
            height: 82,
            borderRadius: 30,
            backgroundColor: 'rgba(254,201,45,0.13)',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 18px 45px rgba(254,201,45,0.14)',
          }}>
          <AppIcon name="car" color={Brand.primary} size={66} />
        </View>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text selectable style={{ color: theme.text, fontSize: 24, fontWeight: '900' }}>
            {selected.brand} {selected.model}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{selected.connector} compatible</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
          <View
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 16,
              backgroundColor: theme.surfaceElevated,
              alignItems: 'center',
              gap: 3,
            }}>
            <Text style={{ color: theme.text, fontSize: 25, fontWeight: '900' }}>{selected.batteryKwh}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 11 }}>kWh battery</Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 16,
              backgroundColor: theme.surfaceElevated,
              alignItems: 'center',
              gap: 3,
            }}>
            <Text style={{ color: theme.text, fontSize: 25, fontWeight: '900' }}>{selected.rangeKm}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 11 }}>km WLTP range</Text>
          </View>
        </View>
      </PremiumCard>

      <View
        style={{
          minHeight: 52,
          borderRadius: Radius.control,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <AppIcon name="search" color={theme.textSecondary} size={20} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search brand or model"
          placeholderTextColor={theme.textSecondary}
          style={{ flex: 1, color: theme.text, fontSize: 15 }}
        />
      </View>

      <View style={{ gap: 9 }}>
        {filtered.map((vehicle) => {
          const isSelected = vehicle.id === selectedId;
          return (
            <Pressable
              key={vehicle.id}
              onPress={() => setSelectedId(vehicle.id)}
              style={{
                minHeight: 64,
                borderRadius: 19,
                borderWidth: 1,
                borderColor: isSelected ? Brand.primary : theme.border,
                backgroundColor: isSelected ? theme.backgroundSelected : theme.surface,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
              <AppIcon name="car" color={isSelected ? Brand.primaryPressed : theme.textSecondary} size={24} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                  {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  {vehicle.batteryKwh} kWh - {vehicle.rangeKm} km
                </Text>
              </View>
              {isSelected ? <AppIcon name="check" color={Brand.primaryPressed} size={22} /> : null}
            </Pressable>
          );
        })}
      </View>

      <PremiumCard style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <AppIcon name="shield" color={Brand.success} size={24} />
        <Text selectable style={{ flex: 1, color: theme.textSecondary, fontSize: 13, lineHeight: 19 }}>
          ChargeOne only recommends connectors and charging speeds compatible with your EV.
        </Text>
      </PremiumCard>

      <PrimaryButton onPress={() => router.push('/(onboarding)/payment-setup')}>Continue</PrimaryButton>
    </Screen>
  );
}
