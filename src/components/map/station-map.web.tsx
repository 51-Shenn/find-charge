import { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const routeStartMarkerRef = useRef<maplibregl.Marker | null>(null);
  const routeEndMarkerRef = useRef<maplibregl.Marker | null>(null);
  const mapInitRef = useRef(false);
  const onMapPressRef = useRef(onMapPress);

  useEffect(() => {
    onMapPressRef.current = onMapPress;
  });

  useEffect(() => {
    if (!containerRef.current || mapInitRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAPLIBRE_STYLE,
      center: [101.6869, 3.139],
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('click', () => {
      onMapPressRef.current?.();
    });

    map.on('load', () => {
      map.resize();
    });

    map.on('styleimagemissing', (e) => {
      const canvas = document.createElement('canvas');
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(10, 10, 8, 0, 2 * Math.PI);
        ctx.fill();
        map.addImage(e.id, canvas, { pixelRatio: 1 });
      }
    });

    mapRef.current = map;
    mapInitRef.current = true;

    return () => {
      map.remove();
      mapRef.current = null;
      mapInitRef.current = false;
      userMarkerRef.current = null;
      routeStartMarkerRef.current = null;
      routeEndMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (!userMarkerRef.current) {
      const el = document.createElement('div');
      el.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #4285F4;
        border: 3px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        cursor: default;
      `;

      const ring = document.createElement('div');
      ring.style.cssText = `
        position: absolute;
        top: -4px;
        left: -4px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: transparent;
        border: 2px solid #4285F4;
        animation: fc-user-location-pulse 2s infinite;
      `;
      el.appendChild(ring);

      if (!document.getElementById('fc-user-location-styles')) {
        const style = document.createElement('style');
        style.id = 'fc-user-location-styles';
        style.textContent = `
          @keyframes fc-user-location-pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      userMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 1500,
      });
    } else {
      userMarkerRef.current.setLngLat([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stations.forEach((station) => {
      const el = document.createElement('div');
      const isSelected = selectedStation?.id === station.id;
      el.style.cssText = `
        width: ${isSelected ? 32 : 24}px;
        height: ${isSelected ? 32 : 24}px;
        border-radius: 50%;
        background: ${station.isOperational ? '#22c55e' : '#ef4444'};
        border: ${isSelected ? '4' : '3'}px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      `;
      el.title = station.name;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onMarkerPress?.(station);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [stations, onMarkerPress, selectedStation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    routeStartMarkerRef.current?.remove();
    routeStartMarkerRef.current = null;
    routeEndMarkerRef.current?.remove();
    routeEndMarkerRef.current = null;

    if (map.getLayer('route-line')) {
      map.removeLayer('route-line');
    }
    if (map.getLayer('route-glow')) {
      map.removeLayer('route-glow');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    if (!route) return;

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.polyline,
        },
      },
    });

    map.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#4285F4',
        'line-width': 8,
        'line-opacity': 0.2,
      },
    });

    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#4285F4',
        'line-width': 4,
        'line-opacity': 0.9,
      },
    });

    const startCoords = route.polyline[0];
    const endCoords = route.polyline[route.polyline.length - 1];

    const startEl = document.createElement('div');
    startEl.style.cssText = `
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4285F4;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    `;

    const endEl = document.createElement('div');
    endEl.style.cssText = `
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #d32f2f;
      border: 3px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    `;

    routeStartMarkerRef.current = new maplibregl.Marker({ element: startEl })
      .setLngLat(startCoords)
      .addTo(map);

    routeEndMarkerRef.current = new maplibregl.Marker({ element: endEl })
      .setLngLat(endCoords)
      .addTo(map);
  }, [route]);

  const handleLocateMe = useCallback(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 14,
      duration: 1000,
    });
  }, [userLocation]);

  const handleFitRoute = useCallback(() => {
    if (!mapRef.current || !route) return;
    const bounds = route.polyline.reduce(
      (b, coord) => b.extend(coord as [number, number]),
      new maplibregl.LngLatBounds(route.polyline[0], route.polyline[0])
    );
    mapRef.current.fitBounds(bounds, { padding: 80, duration: 1000 });
  }, [route]);

  const mapStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    height: '100%',
  };

  return (
    <View style={styles.container}>
      <div ref={containerRef} style={mapStyle} />
      {userLocation && !route && (
        <Pressable style={styles.locateButton} onPress={handleLocateMe}>
          <Text style={styles.locateIcon}>⌖</Text>
        </Pressable>
      )}
      {route && (
        <Pressable style={styles.fitRouteButton} onPress={handleFitRoute}>
          <Text style={styles.locateIcon}>⟷</Text>
        </Pressable>
      )}
      {selectedStation && !route && (
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={styles.infoCardTitle} numberOfLines={1}>
              {selectedStation.name}
            </Text>
            <Pressable
              style={styles.infoCardClose}
              onPress={() => onMapPress?.()}
            >
              <Text style={styles.infoCardCloseText}>✕</Text>
            </Pressable>
          </View>
          <Text style={styles.infoCardAddress} numberOfLines={1}>
            {selectedStation.address}
            {selectedStation.town ? `, ${selectedStation.town}` : ''}
          </Text>
          <Text style={styles.infoCardMeta}>
            {selectedStation.distance
              ? `${selectedStation.distance.toFixed(1)} km away`
              : ''}
            {selectedStation.connections
              ? ` · ${selectedStation.connections.length} connector${selectedStation.connections.length !== 1 ? 's' : ''}`
              : ''}
          </Text>
          <View style={styles.infoCardButtons}>
            <Pressable
              style={styles.navButton}
              onPress={() => onNavigate?.(selectedStation)}
            >
              <Text style={styles.navButtonText}>Navigate</Text>
            </Pressable>
            <Pressable
              style={styles.detailsButton}
              onPress={() => onViewDetails?.(selectedStation)}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
  },
  fitRouteButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
  },
  locateIcon: {
    fontSize: 20,
    color: '#4285F4',
  },
  infoCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
  },
  infoCardClose: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardCloseText: {
    fontSize: 14,
    color: '#64748b',
  },
  infoCardAddress: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  infoCardMeta: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  infoCardButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: '600',
  },
});
