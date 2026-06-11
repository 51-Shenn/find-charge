import Constants from 'expo-constants';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Pressable, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/theme';
import type { Charger } from '@/types/charge';

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#17191F' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#A6AAB4' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#17191F' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2A2E37' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3B3E43' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1E2128' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0E1821' }] },
];

function SchematicMap({
  chargers,
  selectedId,
  onSelect,
  route,
  height,
}: {
  chargers: Charger[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  route?: { latitude: number; longitude: number }[];
  height: number;
}) {
  const visibleChargers = chargers.slice(0, 6);

  return (
    <View
      accessibilityLabel="Charger map preview"
      style={{
        height,
        borderRadius: Radius.hero,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
        backgroundColor: '#151820',
        boxShadow: '0 18px 45px rgba(0,0,0,0.45)',
      }}>
      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#151820' }} />
      {[
        { left: -30, top: 48, width: 520, rotate: '-12deg' },
        { left: -18, top: height * 0.54, width: 500, rotate: '9deg' },
        { left: 92, top: -35, width: height * 1.35, rotate: '72deg' },
        { left: 245, top: -10, width: height * 1.2, rotate: '88deg' },
      ].map((road, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: road.left,
            top: road.top,
            width: road.width,
            height: index === 0 && route ? 7 : 4,
            borderRadius: 4,
            backgroundColor: index === 0 && route ? Brand.route : '#343944',
            transform: [{ rotate: road.rotate }],
          }}
        />
      ))}
      {[
        [18, 18, 72, 46],
        [224, 20, 92, 60],
        [34, height - 94, 88, 54],
        [248, height - 108, 104, 68],
        [145, height * 0.42, 68, 46],
      ].map(([left, top, width, blockHeight], index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left,
            top,
            width,
            height: blockHeight,
            borderRadius: 13,
            backgroundColor: index % 2 ? '#1D222B' : '#20252D',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.035)',
          }}
        />
      ))}

      {visibleChargers.map((charger, index) => {
        const selected = charger.id === selectedId;
        const left = 22 + ((index * 83) % 290);
        const top = 38 + ((index * 61) % Math.max(height - 110, 90));
        return (
          <Pressable
            key={charger.id}
            accessibilityRole="button"
            accessibilityLabel={`${charger.stationName}, ${charger.availableStalls} stalls available`}
            onPress={() => onSelect?.(charger.id)}
            style={({ pressed }) => ({
              position: 'absolute',
              left,
              top,
              alignItems: 'center',
              gap: 4,
              transform: [{ scale: pressed ? 0.92 : selected ? 1.12 : 1 }],
            })}>
            <View
              style={{
                minWidth: selected ? 46 : 38,
                height: selected ? 46 : 38,
                borderRadius: selected ? 17 : 14,
                paddingHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? Brand.primary : '#20232B',
                borderWidth: 2,
                borderColor:
                  selected
                    ? '#FFF1A9'
                    : charger.status === 'available'
                      ? Brand.success
                      : Brand.warning,
                boxShadow: selected
                  ? '0 8px 22px rgba(254,201,45,0.42)'
                  : '0 6px 14px rgba(0,0,0,0.35)',
              }}>
              <Text
                style={{
                  color: selected ? '#14120C' : '#FFFFFF',
                  fontSize: selected ? 13 : 11,
                  fontWeight: '900',
                }}>
                {charger.availableStalls}
              </Text>
            </View>
            {selected ? (
              <View
                style={{
                  backgroundColor: '#090A0D',
                  borderRadius: 8,
                  paddingHorizontal: 7,
                  paddingVertical: 4,
                }}>
                <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>
                  {charger.powerKw} kW
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}

      <View
        style={{
          position: 'absolute',
          left: 14,
          bottom: 14,
          borderRadius: Radius.pill,
          paddingHorizontal: 11,
          paddingVertical: 7,
          backgroundColor: 'rgba(7,8,11,0.84)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
        }}>
        <Text style={{ color: '#A6AAB4', fontSize: 9, fontWeight: '700' }}>CHARGEONE LIVE NETWORK</Text>
      </View>
    </View>
  );
}

export function ChargerMap({
  chargers,
  selectedId,
  onSelect,
  route,
  height = 300,
}: {
  chargers: Charger[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  route?: { latitude: number; longitude: number }[];
  height?: number;
}) {
  const hasGoogleMapsApiKey =
    Constants.expoConfig?.extra?.googleMapsApiKeyConfigured === true;

  if (!hasGoogleMapsApiKey) {
    return (
      <SchematicMap
        chargers={chargers}
        selectedId={selectedId}
        onSelect={onSelect}
        route={route}
        height={height}
      />
    );
  }

  return (
    <View
      style={{
        height,
        borderRadius: Radius.hero,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.45)',
      }}>
      <MapView
        style={{ flex: 1 }}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: 3.142,
          longitude: 101.695,
          latitudeDelta: 0.13,
          longitudeDelta: 0.13,
        }}>
        {route ? (
          <Polyline coordinates={route} strokeColor={Brand.route} strokeWidth={5} />
        ) : null}
        {chargers.map((charger) => {
          const selected = charger.id === selectedId;
          const available = charger.status === 'available';
          return (
            <Marker
              key={charger.id}
              coordinate={{ latitude: charger.latitude, longitude: charger.longitude }}
              onPress={() => onSelect?.(charger.id)}
              accessibilityLabel={`${charger.stationName}, ${charger.status}`}>
              <View style={{ alignItems: 'center', gap: 3 }}>
                <View
                  style={{
                    minWidth: selected ? 46 : 38,
                    height: selected ? 46 : 38,
                    borderRadius: selected ? 17 : 14,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selected ? Brand.primary : available ? '#20232B' : '#463B1E',
                    borderWidth: 2,
                    borderColor: selected ? '#FFF1A9' : available ? Brand.success : Brand.warning,
                    boxShadow: selected ? '0 8px 22px rgba(254,201,45,0.42)' : '0 6px 14px rgba(0,0,0,0.35)',
                  }}>
                  <Text
                    style={{
                      color: selected ? '#14120C' : '#FFFFFF',
                      fontSize: selected ? 13 : 11,
                      fontWeight: '900',
                    }}>
                    {charger.availableStalls}
                  </Text>
                </View>
                {selected ? (
                  <View
                    style={{
                      backgroundColor: '#111318',
                      borderRadius: 8,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                    }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>
                      {charger.powerKw} kW
                    </Text>
                  </View>
                ) : null}
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
