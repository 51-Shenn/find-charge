import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { RouteCard } from '@/components/cards/route-card';
import { AppIcon } from '@/components/ui/app-icon';
import { IconButton, PrimaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand } from '@/constants/theme';
import { routeOptions } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export default function RouteComparisonScreen() {
  const theme = useChargeTheme();
  const [selectedId, setSelectedId] = useState(routeOptions[0].id);
  const selected = routeOptions.find((route) => route.id === selectedId) ?? routeOptions[0];

  return (
    <Screen
      eyebrow="Kuala Lumpur to George Town"
      title="Compare routes"
      right={<IconButton icon="close" accessibilityLabel="Close comparison" onPress={() => router.back()} />}>
      <PremiumCard hero glow style={{ gap: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 17,
              backgroundColor: Brand.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon name="sparkle" color="#14120C" size={25} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>ChargeOne Pick</Text>
            <Text selectable style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 17 }}>
              Saves 15 minutes versus the cheapest route and RM8.60 versus the fastest.
            </Text>
          </View>
        </View>
      </PremiumCard>

      <View style={{ gap: 12 }}>
        {routeOptions.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            selected={selectedId === route.id}
            onPress={() => setSelectedId(route.id)}
          />
        ))}
      </View>

      <PremiumCard style={{ gap: 18 }}>
        <Text selectable style={{ color: theme.text, fontSize: 17, fontWeight: '900' }}>
          At a glance
        </Text>
        {[
          { label: 'Journey time', values: [82, 74, 94], unit: 'min' },
          { label: 'Charging cost', values: [78, 96, 62], unit: 'RM' },
          { label: 'Arrival battery', values: [84, 70, 100], unit: '%' },
        ].map((metric) => (
          <View key={metric.label} style={{ gap: 8 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700' }}>{metric.label}</Text>
            <View style={{ flexDirection: 'row', gap: 6, height: 11 }}>
              {metric.values.map((value, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    borderRadius: 6,
                    backgroundColor: theme.surfaceElevated,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      width: `${value}%`,
                      height: '100%',
                      borderRadius: 6,
                      backgroundColor: index === 0 ? Brand.primary : index === 1 ? Brand.route : Brand.success,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          {[
            ['ChargeOne Pick', Brand.primary],
            ['Fastest', Brand.route],
            ['Lowest cost', Brand.success],
          ].map(([label, color]) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
              <Text style={{ color: theme.textSecondary, fontSize: 10 }}>{label}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <PremiumCard style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppIcon name="leaf" color={Brand.success} size={27} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
            {selected.carbonKg} kg CO2 avoided
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Compared with an equivalent petrol trip</Text>
        </View>
      </PremiumCard>

      <PrimaryButton icon="navigation" onPress={() => router.replace('/route/active-navigation')}>
        Start navigation
      </PrimaryButton>
    </Screen>
  );
}
