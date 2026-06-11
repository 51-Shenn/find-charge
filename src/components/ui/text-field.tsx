import { Text, TextInput, TextInputProps, View } from 'react-native';

import { AppIcon, AppIconName } from '@/components/ui/app-icon';
import { Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

type Props = TextInputProps & {
  label: string;
  icon: AppIconName;
  error?: string;
};

export function TextField({ label, icon, error, ...props }: Props) {
  const theme = useChargeTheme();

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>{label}</Text>
      <View
        style={{
          minHeight: 54,
          borderRadius: Radius.control,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: error ? '#FF5A5F' : theme.border,
          backgroundColor: theme.surfaceElevated,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        <AppIcon name={icon} color={theme.textSecondary} size={19} />
        <TextInput
          {...props}
          placeholderTextColor={theme.textSecondary}
          style={{ flex: 1, color: theme.text, fontSize: 15, paddingVertical: 14 }}
        />
      </View>
      {error ? (
        <Text selectable accessibilityRole="alert" style={{ color: '#FF7A7E', fontSize: 12 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
