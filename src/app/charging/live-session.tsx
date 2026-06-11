import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MetricCard } from '@/components/cards/metric-card';
import { AppIcon } from '@/components/ui/app-icon';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

const curve = [18, 32, 52, 72, 92, 100, 94, 84, 70, 56, 42, 30];

export default function LiveSessionScreen() {
  const theme = useChargeTheme();
  const fill = useSharedValue(68);
  const pulse = useSharedValue(0.35);

  useEffect(() => {
    fill.value = withTiming(86, { duration: 12_000, easing: Easing.out(Easing.quad) });
    pulse.value = withRepeat(withTiming(1, { duration: 1_100 }), -1, true);
  }, [fill, pulse]);

  const fillStyle = useAnimatedStyle(() => ({ height: fill.value * 2.35 }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value, transform: [{ scale: 0.96 + pulse.value * 0.08 }] }));

  return (
    <Screen
      eyebrow="Charging now"
      title="Energy flowing"
      right={<IconButton icon="close" accessibilityLabel="Minimize session" onPress={() => router.replace('/(tabs)/home')} />}>
      <PremiumCard hero glow style={{ alignItems: 'center', gap: 20, paddingVertical: 30 }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 55,
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: 'rgba(254,201,45,0.08)',
              boxShadow: '0 0 80px rgba(254,201,45,0.22)',
            },
            pulseStyle,
          ]}
        />
        <View
          style={{
            width: 154,
            height: 254,
            borderRadius: 48,
            borderWidth: 7,
            borderColor: '#363A43',
            padding: 10,
            justifyContent: 'flex-end',
            overflow: 'hidden',
            backgroundColor: '#0A0B0E',
            boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.7), 0 20px 55px rgba(0,0,0,0.55)',
          }}>
          <Animated.View
            style={[
              {
                width: '100%',
                borderRadius: 31,
                backgroundColor: Brand.primary,
                boxShadow: '0 0 28px rgba(254,201,45,0.52)',
              },
              fillStyle,
            ]}
          />
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Text
              selectable
              style={{
                color: '#FFFFFF',
                fontSize: 48,
                fontWeight: '900',
                letterSpacing: -2,
                fontVariant: ['tabular-nums'],
                textShadowColor: 'rgba(0,0,0,0.7)',
                textShadowRadius: 12,
              }}>
              68%
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>
              CHARGING
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Text selectable style={{ color: theme.text, fontSize: 22, fontWeight: '900' }}>
            18 min remaining
          </Text>
          <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
            Estimated completion at 7:42 PM
          </Text>
        </View>
      </PremiumCard>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        <MetricCard label="Charging speed" value="142 kW" detail="Peak 180 kW" icon="speed" />
        <MetricCard label="Energy delivered" value="18.6 kWh" detail="+1.3 kWh/min" icon="bolt" />
        <MetricCard label="Current cost" value="RM27.90" detail="RM1.50 / kWh" icon="payments" />
        <MetricCard label="Range added" value="116 km" detail="+8 km/min" icon="route" />
      </View>

      <PremiumCard style={{ gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: 3 }}>
            <Text selectable style={{ color: theme.text, fontSize: 17, fontWeight: '900' }}>
              Charging curve
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Power delivery over this session</Text>
          </View>
          <AppIcon name="chart" color={Brand.primary} size={23} />
        </View>
        <View style={{ height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          {curve.map((value, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: value,
                minWidth: 8,
                borderRadius: 6,
                backgroundColor: index < 7 ? Brand.primary : theme.surfaceElevated,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 10 }}>Session start</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 10 }}>Now - 68%</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 10 }}>80% target</Text>
        </View>
      </PremiumCard>

      <PremiumCard style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppIcon name="location" color={Brand.route} size={24} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Gentari @ Suria KLCC</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 11 }}>CCS2 - Stall 04 - Session secured</Text>
        </View>
      </PremiumCard>

      <SecondaryButton icon="close" onPress={() => router.push('/charging/receipt')}>
        Stop charging
      </SecondaryButton>
      <PrimaryButton icon="receipt" onPress={() => router.push('/charging/receipt')}>
        View live receipt
      </PrimaryButton>
    </Screen>
  );
}
