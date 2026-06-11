import { ActivityIndicator, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export function LoadingSkeleton({ label = 'Finding the best chargers...' }: { label?: string }) {
  const theme = useChargeTheme();
  return (
    <PremiumCard style={{ minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <ActivityIndicator color={Brand.primary} size="large" />
      <Text selectable style={{ color: theme.textSecondary, fontSize: 14 }}>
        {label}
      </Text>
    </PremiumCard>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const theme = useChargeTheme();
  return (
    <PremiumCard style={{ alignItems: 'center', gap: 10, paddingVertical: 30 }}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 19,
          backgroundColor: theme.backgroundSelected,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppIcon name="search" color={Brand.primaryPressed} size={26} />
      </View>
      <Text selectable style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
        {title}
      </Text>
      <Text
        selectable
        style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>
        {message}
      </Text>
    </PremiumCard>
  );
}

export function ErrorState({ retry }: { retry?: () => void }) {
  const theme = useChargeTheme();
  return (
    <PremiumCard style={{ alignItems: 'center', gap: 12, paddingVertical: 28 }}>
      <AppIcon name="warning" color={Brand.danger} size={30} />
      <Text selectable style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
        Chargers could not be loaded
      </Text>
      <Text selectable style={{ color: theme.textSecondary, textAlign: 'center', lineHeight: 20 }}>
        Check your connection and try again.
      </Text>
      {retry ? <SecondaryButton onPress={retry}>Try again</SecondaryButton> : null}
    </PremiumCard>
  );
}
