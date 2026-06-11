import { Tabs } from 'expo-router';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export default function TabLayout() {
  const theme = useChargeTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        sceneStyle: { backgroundColor: theme.background },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 14,
          height: 74,
          borderRadius: 28,
          borderCurve: 'continuous',
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: theme.overlay,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: theme.border,
          boxShadow: `0 16px 42px ${theme.shadow}`,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarItemStyle: { borderRadius: 20 },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="map" color={color} size={focused ? 25 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="route-planner"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="route" color={color} size={focused ? 25 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="history" color={color} size={focused ? 25 : 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="person" color={color} size={focused ? 25 : 22} />
          ),
        }}
      />
    </Tabs>
  );
}
