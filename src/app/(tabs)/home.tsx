import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ChargerCard } from '@/components/cards/charger-card';
import { ChargerMap } from '@/components/map/charger-map';
import { AppIcon } from '@/components/ui/app-icon';
import { FilterChip } from '@/components/ui/filter-chip';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/states';
import { Brand, Radius } from '@/constants/theme';
import { vehicles } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import { useChargers } from '@/services/chargers';
import { useAppStore } from '@/store/app-store';

const filters = ['CCS2', 'Available now', '100kW+', 'Cheapest', 'Open 24/7'];

export default function MapHomeScreen() {
  const theme = useChargeTheme();
  const query = useChargers();
  const selectedVehicleId = useAppStore((state) => state.selectedVehicleId);
  const selectedId = useAppStore((state) => state.selectedChargerId);
  const setSelectedId = useAppStore((state) => state.setSelectedChargerId);
  const [activeFilters, setActiveFilters] = useState<string[]>(['CCS2', 'Available now']);
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId) ?? vehicles[0];

  const visibleChargers = (query.data ?? []).filter((charger) => {
    if (activeFilters.includes('CCS2') && !charger.connectorTypes.includes('CCS2')) return false;
    if (activeFilters.includes('Available now') && charger.status !== 'available') return false;
    if (activeFilters.includes('100kW+') && charger.powerKw < 100) return false;
    if (activeFilters.includes('Open 24/7') && charger.openingHours !== '24 hours') return false;
    return true;
  });

  function toggleFilter(filter: string) {
    setActiveFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    );
  }

  return (
    <Screen tabbed eyebrow="Good evening, Yit Shen" title="Ready to charge?">
      <PremiumCard hero glow style={{ gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ gap: 4 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text
              selectable
              style={{
                color: theme.text,
                fontSize: 38,
                fontWeight: '900',
                letterSpacing: -1.4,
                fontVariant: ['tabular-nums'],
              }}>
              68%
            </Text>
            <Text style={{ color: Brand.success, fontSize: 13, fontWeight: '800' }}>
              309 km estimated range
            </Text>
          </View>
          <View
            style={{
              width: 82,
              height: 82,
              borderRadius: 28,
              backgroundColor: 'rgba(254,201,45,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon name="battery" color={Brand.primary} size={45} />
          </View>
        </View>
        <View style={{ height: 8, backgroundColor: theme.surfaceElevated, borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: '68%', height: '100%', borderRadius: 4, backgroundColor: Brand.primary }} />
        </View>
      </PremiumCard>

      <Pressable
        accessibilityRole="search"
        onPress={() => router.push('/(tabs)/route-planner')}
        style={({ pressed }) => ({
          minHeight: 58,
          borderRadius: Radius.control,
          backgroundColor: pressed ? theme.backgroundSelected : theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: 17,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          boxShadow: `0 12px 30px ${theme.shadow}`,
        })}>
        <AppIcon name="search" color={Brand.primary} size={22} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Where are you going?</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Search destination or charger</Text>
        </View>
        <AppIcon name="filter" color={theme.textSecondary} size={21} />
      </Pressable>

      {query.isLoading ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState retry={() => void query.refetch()} />
      ) : (
        <ChargerMap chargers={query.data ?? []} selectedId={selectedId} onSelect={setSelectedId} height={315} />
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            selected={activeFilters.includes(filter)}
            onPress={() => toggleFilter(filter)}
          />
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ gap: 3 }}>
          <Text selectable style={{ color: theme.text, fontSize: 20, fontWeight: '900' }}>
            Nearby chargers
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Ranked for your {vehicle.model}</Text>
        </View>
        <Text style={{ color: Brand.primary, fontSize: 13, fontWeight: '800' }}>View all</Text>
      </View>

      {visibleChargers.length ? (
        <View style={{ gap: 12 }}>
          {visibleChargers.slice(0, 4).map((charger, index) => (
            <ChargerCard
              key={charger.id}
              charger={charger}
              index={index}
              recommended={index === 0}
              onPress={() => {
                setSelectedId(charger.id);
                router.push({ pathname: '/charger/[id]', params: { id: charger.id } });
              }}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="No chargers match"
          message="Remove one or more filters to see compatible chargers nearby."
        />
      )}
    </Screen>
  );
}
