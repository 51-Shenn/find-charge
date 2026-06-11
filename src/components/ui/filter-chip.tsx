import { Pressable, Text } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useChargeTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 42,
        borderRadius: Radius.pill,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: selected ? Brand.primary : pressed ? theme.backgroundSelected : theme.surface,
        borderWidth: 1,
        borderColor: selected ? Brand.primary : theme.border,
      })}>
      {selected ? <AppIcon name="check" color="#14120C" size={15} /> : null}
      <Text style={{ color: selected ? '#14120C' : theme.text, fontSize: 13, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}
