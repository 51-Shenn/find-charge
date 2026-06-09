import type { RouteData, RouteStep } from '@/types/directions';

const API_BASE = 'https://graphhopper.com/api/1';
const API_KEY = process.env.EXPO_PUBLIC_GRAPHHOPPER_API_KEY;

interface GHInstruction {
  distance: number;
  sign: number;
  interval: [number, number];
  text: string;
  time: number;
  street_name: string;
}

interface GHResponse {
  paths: {
    points: {
      type: 'LineString';
      coordinates: [number, number][];
    };
    instructions: GHInstruction[];
    distance: number;
    time: number;
    bbox: [number, number, number, number];
  }[];
}

export async function fetchRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<RouteData> {
  if (!API_KEY) {
    throw new Error('EXPO_PUBLIC_GRAPHHOPPER_API_KEY is not set. Sign up at https://graphhopper.com to get a free API key.');
  }

  const params = new URLSearchParams();
  params.append('point', `${origin.latitude},${origin.longitude}`);
  params.append('point', `${destination.latitude},${destination.longitude}`);
  params.append('vehicle', 'car');
  params.append('locale', 'en');
  params.append('key', API_KEY);
  params.append('instructions', 'true');
  params.append('points_encoded', 'false');
  params.append('type', 'json');

  const url = `${API_BASE}/route?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `GraphHopper API error: ${response.status}${text ? ` - ${text}` : ''}`
    );
  }

  const data: GHResponse = await response.json();
  const path = data.paths[0];

  if (!path) {
    throw new Error('No route found between these locations');
  }

  const polyline: [number, number][] = path.points.coordinates.map(
    ([lng, lat]) => [lng, lat]
  );

  const steps: RouteStep[] = path.instructions.map((inst) => ({
    instruction: inst.text,
    distance: inst.distance,
    time: inst.time,
    sign: inst.sign,
    streetName: inst.street_name,
  }));

  return {
    polyline,
    distance: path.distance,
    time: path.time,
    steps,
  };
}
