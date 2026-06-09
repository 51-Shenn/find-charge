import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

function noop() { return () => {}; }

export function useColorScheme() {
  const isHydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false
  );

  const colorScheme = useRNColorScheme();

  if (isHydrated) {
    return colorScheme;
  }

  return 'light';
}
