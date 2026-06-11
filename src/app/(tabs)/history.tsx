import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { MetricCard } from '@/components/cards/metric-card';
import { AppIcon } from '@/components/ui/app-icon';
import { FilterChip } from '@/components/ui/filter-chip';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand } from '@/constants/theme';
import { sessions } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';

const chartValues = [30, 44, 38, 62, 56, 78, 71, 92, 74, 88, 68, 96];

export default function HistoryScreen() {
  const theme = useChargeTheme();

  return (
    <Screen tabbed eyebrow="Your charging year" title="Energy & spend">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        <MetricCard label="Energy charged" value="284 kWh" detail="+12% this month" icon="bolt" />
        <MetricCard label="Total spend" value="RM392" detail="RM1.38 / kWh avg" icon="payments" />
        <MetricCard label="Sessions" value="14" detail="29 min average" icon="history" />
        <MetricCard label="CO2 avoided" value="217 kg" detail="vs. petrol driving" icon="leaf" />
      </View>

      <PremiumCard hero style={{ gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ gap: 3 }}>
            <Text selectable style={{ color: theme.text, fontSize: 18, fontWeight: '900' }}>
              Monthly energy
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>kWh delivered in 2026</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <FilterChip label="Monthly" selected />
          </View>
        </View>
        <View style={{ height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 7 }}>
          {chartValues.map((value, index) => (
            <View key={index} style={{ flex: 1, gap: 6, alignItems: 'center' }}>
              <View
                style={{
                  width: '100%',
                  height: value,
                  minWidth: 8,
                  borderRadius: 6,
                  backgroundColor: index === 11 ? Brand.primary : theme.surfaceElevated,
                }}
              />
              <Text style={{ color: theme.textSecondary, fontSize: 8 }}>{index + 1}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: theme.text, fontSize: 20, fontWeight: '900' }}>
          Recent sessions
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Receipts grouped by billing date</Text>
      </View>

      <View style={{ gap: 10 }}>
        {sessions.map((session) => (
          <PremiumCard key={session.id} style={{ gap: 13 }}>
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
                <AppIcon name="receipt" color={Brand.primary} size={23} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text selectable style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>
                  {session.station}
                </Text>
                <Text selectable style={{ color: theme.textSecondary, fontSize: 11 }}>
                  {session.date} - {session.energyKwh} kWh
                </Text>
              </View>
              <Text
                selectable
                style={{ color: theme.text, fontSize: 17, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
                RM{session.amountRm.toFixed(2)}
              </Text>
            </View>
            <Text
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/charging/receipt', params: { id: session.id } })}
              style={{ color: Brand.primary, fontSize: 12, fontWeight: '800', alignSelf: 'flex-end' }}>
              View receipt
            </Text>
          </PremiumCard>
        ))}
      </View>
    </Screen>
  );
}
