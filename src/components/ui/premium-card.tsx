import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  hero?: boolean;
  glow?: boolean;
}>;

export function PremiumCard({ children, style, hero = false, glow = false }: Props) {
  const theme = useChargeTheme();

  return (
    <LinearGradient
      colors={
        theme.isDark
          ? [glow ? '#272718' : '#20232B', '#111318']
          : [glow ? '#FFF9DE' : '#FFFFFF', '#F7F6F1']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: hero ? Radius.hero : Radius.card,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: theme.border,
          padding: hero ? 24 : 18,
          boxShadow: glow
            ? `0 18px 50px ${theme.isDark ? 'rgba(254, 201, 45, 0.13)' : 'rgba(85, 65, 0, 0.13)'}`
            : `0 14px 38px ${theme.shadow}`,
        },
        style,
      ]}>
      {children}
    </LinearGradient>
  );
}
