import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: Props) {
  const size = compact ? 42 : 68;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: compact ? 10 : 14 }}>
      <LinearGradient
        colors={['#FFE88E', Brand.primary, '#DCA900']}
        style={{
          width: size,
          height: size,
          borderRadius: compact ? 16 : 24,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 12px 36px rgba(254, 201, 45, ${compact ? 0.22 : 0.34})`,
          borderCurve: 'continuous',
        }}>
        <AppIcon name="bolt" color="#15130C" size={compact ? 24 : 38} />
      </LinearGradient>
      <Text
        selectable
        style={{
          color: '#FFFFFF',
          fontSize: compact ? 21 : 30,
          fontWeight: '800',
          letterSpacing: -1,
        }}>
        ChargeOne
      </Text>
    </View>
  );
}
