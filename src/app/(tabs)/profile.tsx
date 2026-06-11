import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { Switch, Text, View } from 'react-native';

import { AppIcon, AppIconName } from '@/components/ui/app-icon';
import { SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius } from '@/constants/theme';
import { vehicles } from '@/data/demo';
import { useChargeTheme } from '@/hooks/use-charge-theme';
import { useAppStore } from '@/store/app-store';

function SettingRow({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon: AppIconName;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const theme = useChargeTheme();
  return (
    <View
      style={{
        minHeight: 62,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.surfaceElevated,
        }}>
        <AppIcon name={icon} color={Brand.primary} size={21} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>{title}</Text>
        {subtitle ? <Text style={{ color: theme.textSecondary, fontSize: 11 }}>{subtitle}</Text> : null}
      </View>
      {trailing ?? <AppIcon name="chevron" color={theme.textSecondary} size={18} />}
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useChargeTheme();
  const selectedVehicleId = useAppStore((state) => state.selectedVehicleId);
  const chargeLimit = useAppStore((state) => state.chargeLimit);
  const setChargeLimit = useAppStore((state) => state.setChargeLimit);
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const vehicle = vehicles.find((item) => item.id === selectedVehicleId) ?? vehicles[0];

  return (
    <Screen tabbed eyebrow="ChargeOne member" title="Yit Shen">
      <PremiumCard hero glow style={{ gap: 20 }}>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 22,
              backgroundColor: Brand.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#14120C', fontSize: 21, fontWeight: '900' }}>YS</Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text selectable style={{ color: theme.text, fontSize: 18, fontWeight: '900' }}>
              Yit Shen
            </Text>
            <Text selectable style={{ color: theme.textSecondary, fontSize: 12 }}>
              yitshen@example.com
            </Text>
          </View>
          <View
            style={{
              borderRadius: Radius.pill,
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: 'rgba(254,201,45,0.14)',
            }}>
            <Text style={{ color: Brand.primary, fontSize: 10, fontWeight: '900' }}>ONE+</Text>
          </View>
        </View>

        <View
          style={{
            minHeight: 126,
            borderRadius: 24,
            backgroundColor: theme.surfaceElevated,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>
              MY VEHICLE
            </Text>
            <Text selectable style={{ color: theme.text, fontSize: 21, fontWeight: '900' }}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text style={{ color: Brand.success, fontSize: 12, fontWeight: '800' }}>
              {vehicle.connector} - {vehicle.batteryKwh} kWh
            </Text>
          </View>
          <AppIcon name="car" color={Brand.primary} size={64} />
        </View>
      </PremiumCard>

      <PremiumCard style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: 3 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>Daily charge limit</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Recommended for battery health</Text>
          </View>
          <Text
            selectable
            style={{ color: Brand.primary, fontSize: 24, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
            {chargeLimit}%
          </Text>
        </View>
        <Slider
          accessibilityLabel="Daily charge limit"
          minimumValue={50}
          maximumValue={100}
          step={5}
          value={chargeLimit}
          onValueChange={setChargeLimit}
          minimumTrackTintColor={Brand.primary}
          maximumTrackTintColor={theme.surfaceElevated}
          thumbTintColor={Brand.primary}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 10 }}>50%</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 10 }}>100%</Text>
        </View>
      </PremiumCard>

      <PremiumCard style={{ paddingVertical: 4 }}>
        <SettingRow
          icon="moon"
          title="Dark mode"
          subtitle={themeMode === 'dark' ? 'Always on' : 'Follow system'}
          trailing={
            <Switch
              value={themeMode === 'dark'}
              onValueChange={(value) => setThemeMode(value ? 'dark' : 'system')}
              trackColor={{ false: theme.surfaceElevated, true: Brand.primary }}
              thumbColor={themeMode === 'dark' ? '#14120C' : '#FFFFFF'}
            />
          }
        />
        <SettingRow
          icon="bell"
          title="Charging reminders"
          subtitle="Notify below 25% battery"
          trailing={
            <Switch
              value
              trackColor={{ false: theme.surfaceElevated, true: Brand.primary }}
              thumbColor="#14120C"
            />
          }
        />
        <SettingRow icon="card" title="Payment methods" subtitle="Visa ending 4242" />
        <SettingRow icon="settings" title="Vehicle and route preferences" />
        <SettingRow icon="shield" title="Privacy and security" />
        <SettingRow icon="help" title="Help and support" />
      </PremiumCard>

      <SecondaryButton icon="logout" onPress={() => router.replace('/(auth)/welcome')}>
        Sign out
      </SecondaryButton>
    </Screen>
  );
}
