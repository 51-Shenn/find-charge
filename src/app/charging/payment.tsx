import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import { getCharger } from '@/services/chargers';

const methods = [
  { id: 'visa', name: 'Visa ending 4242', detail: 'Default card', icon: 'card' as const },
  { id: 'google', name: 'Google Pay', detail: 'Fast checkout', icon: 'sparkle' as const },
  { id: 'apple', name: 'Apple Pay', detail: 'Available on iOS', icon: 'card' as const },
];

export default function PaymentScreen() {
  const theme = useChargeTheme();
  const { chargerId } = useLocalSearchParams<{ chargerId?: string }>();
  const charger = getCharger(chargerId ?? 'gentari-klcc');
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [processing, setProcessing] = useState(false);
  const energy = 32;
  const subtotal = energy * charger.pricePerKwh;
  const serviceFee = 1.2;
  const total = subtotal + serviceFee;

  function startCharging() {
    setProcessing(true);
    setTimeout(() => router.replace('/charging/live-session'), 700);
  }

  return (
    <Screen
      eyebrow="Secure ChargeOne checkout"
      title="Review & pay"
      right={<IconButton icon="close" accessibilityLabel="Close payment" onPress={() => router.back()} />}>
      <PremiumCard hero glow style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              backgroundColor: Brand.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon name="bolt" color="#14120C" size={27} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text selectable style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>
              {charger.stationName}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
              CCS2 - {charger.powerKw} kW - Stall 04
            </Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: theme.border }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[
            ['Energy', `${energy} kWh`],
            ['To 80%', '24 min'],
            ['Rate', `RM${charger.pricePerKwh.toFixed(2)}`],
          ].map(([label, value]) => (
            <View key={label} style={{ alignItems: 'center', gap: 3 }}>
              <Text selectable style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
                {value}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 10 }}>{label}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, fontWeight: '900' }}>
          Payment method
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Choose how you want to pay</Text>
      </View>

      <View style={{ gap: 9 }}>
        {methods.map((method) => {
          const selected = selectedMethod === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={{
                minHeight: 70,
                borderRadius: 21,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: selected ? theme.backgroundSelected : theme.surface,
                borderWidth: selected ? 1.5 : 1,
                borderColor: selected ? Brand.primary : theme.border,
              }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 15,
                  backgroundColor: selected ? Brand.primary : theme.surfaceElevated,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppIcon name={method.icon} color={selected ? '#14120C' : theme.text} size={22} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>{method.name}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 11 }}>{method.detail}</Text>
              </View>
              {selected ? <AppIcon name="check" color={Brand.primaryPressed} size={22} /> : null}
            </Pressable>
          );
        })}
        <SecondaryButton icon="plus">Add new card</SecondaryButton>
      </View>

      <PremiumCard style={{ gap: 13 }}>
        <Text selectable style={{ color: theme.text, fontSize: 17, fontWeight: '900' }}>
          Cost estimate
        </Text>
        {[
          [`Energy (${energy} kWh)`, `RM ${subtotal.toFixed(2)}`],
          ['ChargeOne service fee', `RM ${serviceFee.toFixed(2)}`],
          ['Pre-authorization', 'RM 80.00'],
        ].map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{label}</Text>
            <Text selectable style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>
              {value}
            </Text>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: theme.border }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '900' }}>Estimated total</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 10 }}>Final charge uses actual energy</Text>
          </View>
          <Text
            selectable
            style={{ color: Brand.primary, fontSize: 28, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
            RM {total.toFixed(2)}
          </Text>
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
        <AppIcon name="shield" color={Brand.success} size={20} />
        <Text selectable style={{ flex: 1, color: Brand.success, fontSize: 11, lineHeight: 16, fontWeight: '700' }}>
          Payment is encrypted. Charging only starts after the connector is verified.
        </Text>
      </View>

      <PrimaryButton icon="bolt" disabled={processing} onPress={startCharging}>
        {processing ? 'Starting session...' : 'Pay & start charging'}
      </PrimaryButton>
    </Screen>
  );
}
