import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ChargeOneProvider } from '@/components/charge-one-provider';
import { useChargeTheme } from '@/hooks/use-charge-theme';

function RootNavigator() {
  const theme = useChargeTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="charger/[id]" />
        <Stack.Screen name="route/comparison" />
        <Stack.Screen name="route/active-navigation" />
        <Stack.Screen name="charging/payment" />
        <Stack.Screen name="charging/live-session" />
        <Stack.Screen name="charging/receipt" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ChargeOneProvider>
      <RootNavigator />
    </ChargeOneProvider>
  );
}
