import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

import { BrandMark } from '@/components/brand-mark';
import { AppIcon } from '@/components/ui/app-icon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

const networks = [
  { name: 'G', x: 12, y: 26 },
  { name: 'J', x: 76, y: 12 },
  { name: 'CS', x: 72, y: 72 },
  { name: 'DC', x: 8, y: 76 },
];

export default function WelcomeScreen() {
  const theme = useChargeTheme();

  return (
    <Screen>
      <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: 'center', paddingTop: 10 }}>
        <BrandMark />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).springify()}>
        <LinearGradient
          colors={['#20231C', '#111318', '#090A0D']}
          style={{
            minHeight: 320,
            borderRadius: 34,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.09)',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 28px 70px rgba(0,0,0,0.52)',
          }}>
          <View
            style={{
              position: 'absolute',
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: 'rgba(254,201,45,0.09)',
              boxShadow: '0 0 70px rgba(254,201,45,0.23)',
            }}
          />
          {networks.map((network) => (
            <View
              key={network.name}
              style={{
                position: 'absolute',
                left: `${network.x}%`,
                top: `${network.y}%`,
                width: 44,
                height: 44,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#20232B',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
              }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 12 }}>{network.name}</Text>
            </View>
          ))}
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 52,
              backgroundColor: '#171A20',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(254,201,45,0.22)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 18px 50px rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 32,
                backgroundColor: Brand.primary,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 40px rgba(254,201,45,0.35)',
              }}>
              <AppIcon name="bolt" color="#14120C" size={45} />
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 18,
              borderRadius: Radius.pill,
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: 'rgba(7,8,11,0.76)',
              flexDirection: 'row',
              gap: 7,
              alignItems: 'center',
            }}>
            <AppIcon name="sparkle" color={Brand.primary} size={15} />
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
              Every network. One account.
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(220).springify()} style={{ gap: 10 }}>
        <Text
          selectable
          style={{
            color: theme.text,
            fontSize: 39,
            lineHeight: 42,
            fontWeight: '900',
            letterSpacing: -1.8,
          }}>
          One app.{'\n'}Every charger.
        </Text>
        <Text
          selectable
          style={{ color: theme.textSecondary, fontSize: 16, lineHeight: 24, maxWidth: 350 }}>
          Find, compare, plan, and pay for EV charging across Malaysia with confidence.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(320).springify()} style={{ gap: 11 }}>
        <PrimaryButton onPress={() => router.push('/(auth)/sign-in')}>Sign in</PrimaryButton>
        <SecondaryButton icon="sparkle" onPress={() => router.push('/(onboarding)/ev-setup')}>
          Continue with Google
        </SecondaryButton>
        <SecondaryButton onPress={() => router.push('/(auth)/sign-up')}>Create account</SecondaryButton>
      </Animated.View>
    </Screen>
  );
}
