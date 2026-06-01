import { SymbolView } from 'expo-symbols';

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
  style?: any;
};

export function Icon({ name, size = 14, color, style }: IconProps) {
  return <SymbolView name={name as any} size={size} tintColor={color} style={style} />;
}
