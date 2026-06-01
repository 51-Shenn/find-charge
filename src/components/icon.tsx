import { Text, type TextStyle } from 'react-native';

type SymbolName = {
  ios?: string;
  android?: string;
  web?: string;
  default?: string;
};

type IconProps = {
  name: SymbolName;
  size?: number;
  color?: string;
  style?: TextStyle;
};

const SYMBOL_MAP: Record<string, string> = {
  'arrow.up.right.square': '↗',
  'chevron.right': '▸',
  'chevron_right': '▸',
  link: '🔗',
};

export function Icon({ name, size = 14, color, style }: IconProps) {
  const symbol = name.web || name.default || Object.values(name).find(Boolean) || '';
  return (
    <Text style={[{ fontSize: size, color, lineHeight: size * 1.2 }, style]}>
      {SYMBOL_MAP[symbol] || symbol}
    </Text>
  );
}
