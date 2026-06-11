import { Text, View } from 'react-native';

import { AppIcon, AppIconName } from '@/components/ui/app-icon';
import { Brand, Radius } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import type { ChargerStatus } from '@/types/charge';

export function StatusBadge({ status }: { status: ChargerStatus }) {
  const config = {
    available: { label: 'Available', color: Brand.success, icon: 'check' as AppIconName },
    busy: { label: 'Limited', color: Brand.warning, icon: 'clock' as AppIconName },
    offline: { label: 'Offline', color: Brand.danger, icon: 'warning' as AppIconName },
  }[status];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: Radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: `${config.color}1F`,
      }}>
      <AppIcon name={config.icon} color={config.color} size={14} />
      <Text style={{ color: config.color, fontSize: 11, fontWeight: '800' }}>{config.label}</Text>
    </View>
  );
}

export function ConnectorBadge({ label }: { label: string }) {
  const theme = useChargeTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderRadius: Radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: theme.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.border,
      }}>
      <AppIcon name="connector" color={theme.textSecondary} size={13} />
      <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}
