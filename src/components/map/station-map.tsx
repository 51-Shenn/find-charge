import { Map, Camera, UserLocation, Marker } from '@maplibre/maplibre-react-native';
import { StyleSheet, View } from 'react-native';
import type { Station } from '@/types/database';
import type { RouteData } from '@/types/directions';

const MAPLIBRE_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

interface StationMapProps {
  stations: Station[];
  onMarkerPress?: (station: Station) => void;
  onMapPress?: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedStation?: Station | null;
  route?: RouteData | null;
  onNavigate?: (station: Station) => void;
  onViewDetails?: (station: Station) => void;
}

export function StationMap({
  stations,
  onMarkerPress,
  onMapPress,
  userLocation,
  selectedStation,
  route,
  onNavigate,
  onViewDetails,
}: StationMapProps) {
  type LngLat = [number, number];

  const center: LngLat = userLocation
    ? [userLocation.longitude, userLocation.latitude]
    : [101.6869, 3.139];

  return (
    <Map mapStyle={MAPLIBRE_STYLE} logo={false} style={styles.map}>
      <Camera
        initialViewState={{ center, zoom: 12 }}
      />

      {userLocation && <UserLocation />}

      {stations.map((station) => (
        <Marker
          key={station.id}
          id={station.id.toString()}
          lngLat={[station.longitude, station.latitude] as LngLat}
          onPress={() => onMarkerPress?.(station)}
        >
          <View style={styles.marker} />
        </Marker>
      ))}
    </Map>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
