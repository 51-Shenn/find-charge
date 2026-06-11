import { Text, View } from 'react-native';

import { AppIcon, AppIconName } from '@/components/ui/app-icon';
import { PremiumCard } from '@/components/ui/premium-card';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: AppIconName;
}) {
  const theme = useChargeTheme();
  return (
    <PremiumCard style={{ flex: 1, minWidth: 145, gap: 13 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: 'rgba(254, 201, 45, 0.13)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppIcon name={icon} color={Brand.primary} size={20} />
      </View>
      <View style={{ gap: 3 }}>
        <Text
          selectable
          style={{
            color: theme.text,
            fontSize: 24,
            fontWeight: '900',
            letterSpacing: -0.8,
            fontVariant: ['tabular-nums'],
          }}>
          {value}
        </Text>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>
          {label}
        </Text>
        {detail ? (
          <Text selectable style={{ color: Brand.success, fontSize: 11, fontWeight: '700' }}>
            {detail}
          </Text>
        ) : null}
      </View>
    </PremiumCard>
  );
}
