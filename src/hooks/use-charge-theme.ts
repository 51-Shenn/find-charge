import { useColorScheme } from 'react-native';

import { ChargeThemes } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';

export function useChargeTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);
  const resolvedMode =
    themeMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : themeMode;

  return ChargeThemes[resolvedMode];
}
