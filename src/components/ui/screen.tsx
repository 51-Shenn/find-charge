import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChargeTheme } from '@/hooks/use-charge-theme';

type Props = PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  right?: ReactNode;
  scroll?: boolean;
  tabbed?: boolean;
}>;

export function Screen({
  children,
  title,
  eyebrow,
  right,
  scroll = true,
  tabbed = false,
}: Props) {
  const theme = useChargeTheme();
  const insets = useSafeAreaInsets();
  const content = (
    <>
      {(title || eyebrow || right) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
          <View style={{ flex: 1, gap: 4 }}>
            {eyebrow ? (
              <Text
                selectable
                style={{
                  color: theme.textSecondary,
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                }}>
                {eyebrow}
              </Text>
            ) : null}
            {title ? (
              <Text
                selectable
                style={{ color: theme.text, fontSize: 30, fontWeight: '800', letterSpacing: -1.1 }}>
                {title}
              </Text>
            ) : null}
          </View>
          {right}
        </View>
      )}
      {children}
    </>
  );

  return (
    <LinearGradient
      colors={
        theme.isDark
          ? ['#07080B', '#0B0D12', '#07080B']
          : ['#F7F6F1', '#F2F0E9', '#F7F6F1']
      }
      style={{ flex: 1 }}>
      {scroll ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top + 18,
            paddingHorizontal: 20 + Math.max(insets.left, insets.right),
            paddingBottom: tabbed ? insets.bottom + 112 : insets.bottom + 36,
            gap: 20,
          }}>
          {content}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 18,
            paddingHorizontal: 20 + Math.max(insets.left, insets.right),
            paddingBottom: tabbed ? insets.bottom + 98 : insets.bottom + 20,
            gap: 20,
          }}>
          {content}
        </View>
      )}
    </LinearGradient>
  );
}
