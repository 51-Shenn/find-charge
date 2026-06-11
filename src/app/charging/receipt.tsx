import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { sessions } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export default function ReceiptScreen() {
  const theme = useChargeTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const session = sessions.find((item) => item.id === id) ?? sessions[0];
  const subtotal = session.amountRm / 1.08;
  const tax = session.amountRm - subtotal;

  return (
    <Screen
      eyebrow="Payment complete"
      title="Charging receipt"
      right={<IconButton icon="close" accessibilityLabel="Close receipt" onPress={() => router.replace('/(tabs)/history')} />}>
      <View style={{ alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 82,
            height: 82,
            borderRadius: 29,
            backgroundColor: Brand.primary,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 18px 45px rgba(254,201,45,0.3)',
          }}>
          <AppIcon name="check" color="#14120C" size={45} />
        </View>
        <Text selectable style={{ color: theme.text, fontSize: 24, fontWeight: '900' }}>
          Session complete
        </Text>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
          Your payment was successful
        </Text>
      </View>

      <PremiumCard hero style={{ gap: 18, paddingTop: 28, paddingBottom: 28 }}>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }}>
            TOTAL PAID
          </Text>
          <Text
            selectable
            style={{
              color: theme.text,
              fontSize: 42,
              fontWeight: '900',
              letterSpacing: -1.5,
              fontVariant: ['tabular-nums'],
            }}>
            RM {session.amountRm.toFixed(2)}
          </Text>
          <Text style={{ color: Brand.success, fontSize: 12, fontWeight: '800' }}>
            {session.energyKwh} kWh delivered
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 5, overflow: 'hidden', marginHorizontal: -18 }}>
          {Array.from({ length: 22 }).map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.background,
              }}
            />
          ))}
        </View>

        <View style={{ gap: 13 }}>
          {[
            ['Receipt number', session.id],
            ['Station', session.station],
            ['Operator', session.operator],
            ['Date', session.date],
            ['Duration', `${session.durationMinutes} minutes`],
            ['Connector', 'CCS2 - Stall 04'],
            ['Payment', session.paymentMethod],
          ].map(([label, value]) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{label}</Text>
              <Text
                selectable
                style={{ flex: 1, color: theme.text, fontSize: 12, fontWeight: '700', textAlign: 'right' }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: theme.border }} />

        <View style={{ gap: 12 }}>
          {[
            ['Charging subtotal', `RM ${subtotal.toFixed(2)}`],
            ['Service fee', 'RM 1.20'],
            ['Tax', `RM ${tax.toFixed(2)}`],
          ].map(([label, value]) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{label}</Text>
              <Text selectable style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <View
        style={{
          borderRadius: Radius.control,
          padding: 13,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(53,208,127,0.1)',
        }}>
        <AppIcon name="leaf" color={Brand.success} size={21} />
        <Text selectable style={{ flex: 1, color: Brand.success, fontSize: 11, fontWeight: '700' }}>
          This session avoided an estimated 24.8 kg of CO2.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SecondaryButton icon="share" style={{ flex: 1 }}>
          Share
        </SecondaryButton>
        <SecondaryButton icon="receipt" style={{ flex: 1 }}>
          Download PDF
        </SecondaryButton>
      </View>
      <PrimaryButton onPress={() => router.replace('/(tabs)/home')}>Back to map</PrimaryButton>
    </Screen>
  );
}
