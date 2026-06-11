import { SymbolView } from 'expo-symbols';
import { ColorValue, StyleProp, ViewStyle } from 'react-native';

const icons = {
  map: { ios: 'map.fill', android: 'map', web: 'map' },
  route: { ios: 'point.topleft.down.to.point.bottomright.curvepath', android: 'route', web: 'route' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  person: { ios: 'person.fill', android: 'person', web: 'person' },
  bolt: { ios: 'bolt.fill', android: 'bolt', web: 'bolt' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  battery: { ios: 'battery.75percent', android: 'battery_charging_80', web: 'battery_charging_80' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  location: { ios: 'location.fill', android: 'near_me', web: 'near_me' },
  clock: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  payments: { ios: 'banknote.fill', android: 'payments', web: 'payments' },
  speed: { ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' },
  check: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  filter: { ios: 'line.3.horizontal.decrease', android: 'tune', web: 'tune' },
  car: { ios: 'car.side.fill', android: 'directions_car', web: 'directions_car' },
  card: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  shield: { ios: 'checkmark.shield.fill', android: 'verified_user', web: 'verified_user' },
  settings: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  moon: { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' },
  bell: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  help: { ios: 'questionmark.circle.fill', android: 'help', web: 'help' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  favorite: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  navigation: { ios: 'location.north.fill', android: 'navigation', web: 'navigation' },
  receipt: { ios: 'doc.text.fill', android: 'receipt_long', web: 'receipt_long' },
  chart: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  connector: { ios: 'cable.connector', android: 'power', web: 'power' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  mail: { ios: 'envelope.fill', android: 'mail', web: 'mail' },
  user: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  eye: { ios: 'eye.fill', android: 'visibility', web: 'visibility' },
  leaf: { ios: 'leaf.fill', android: 'eco', web: 'eco' },
  sparkle: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
} as const;

export type AppIconName = keyof typeof icons;

type Props = {
  name: AppIconName;
  color: ColorValue;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function AppIcon({ name, color, size = 22, style }: Props) {
  return (
    <SymbolView
      name={icons[name] as never}
      tintColor={color}
      size={size}
      style={[{ width: size, height: size }, style]}
    />
  );
}
