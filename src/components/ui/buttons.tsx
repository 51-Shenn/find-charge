import * as Haptics from 'expo-haptics';
import { PropsWithChildren } from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

import { Brand, Radius } from '@/constants/theme';
import { AppIcon, AppIconName } from '@/components/ui/app-icon';
import { useChargeTheme } from '@/hooks/use-charge-theme';

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
  icon?: AppIconName;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}>;

function pressWithHaptics(onPress?: () => void) {
  return () => {
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };
}

export function PrimaryButton({
  children,
  onPress,
  icon,
  disabled,
  style,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={pressWithHaptics(onPress)}
      style={({ pressed }) => [
        {
          minHeight: 54,
          borderRadius: Radius.control,
          borderCurve: 'continuous',
          backgroundColor: disabled ? '#6F6542' : pressed ? Brand.primaryPressed : Brand.primary,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          boxShadow: disabled ? undefined : '0 12px 30px rgba(254, 201, 45, 0.22)',
        },
        style,
      ]}>
      {icon ? <AppIcon name={icon} color="#14120C" size={21} /> : null}
      <Text style={{ color: '#14120C', fontSize: 16, fontWeight: '800' }}>{children}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  children,
  onPress,
  icon,
  disabled,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useChargeTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={pressWithHaptics(onPress)}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: Radius.control,
          borderCurve: 'continuous',
          backgroundColor: pressed ? theme.backgroundSelected : theme.surfaceElevated,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        },
        style,
      ]}>
      {icon ? <AppIcon name={icon} color={theme.text} size={20} /> : null}
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{children}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: AppIconName;
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  const theme = useChargeTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={pressWithHaptics(onPress)}
      style={({ pressed }) => ({
        width: 46,
        height: 46,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? theme.backgroundSelected : theme.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.border,
      })}>
      <AppIcon name={icon} color={theme.text} size={21} />
    </Pressable>
  );
}
