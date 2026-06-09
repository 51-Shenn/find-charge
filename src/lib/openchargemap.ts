import type { OCMLocation, Station } from '@/types/database';

const OCM_BASE_URL = 'https://api.openchargemap.io/v3';

const OCM_API_KEY = process.env.EXPO_PUBLIC_OCM_API_KEY;

function getApiKey(): string {
  if (!OCM_API_KEY) {
    console.warn(
      'EXPO_PUBLIC_OCM_API_KEY is not set. OpenChargeMap API will use anonymous access (rate limited).'
    );
    return '';
  }
  return OCM_API_KEY;
}

function transformLocation(loc: OCMLocation): Station {
  return {
    id: loc.ID,
    uuid: loc.UUID,
    name: loc.AddressInfo.Title,
    address: [
      loc.AddressInfo.AddressLine1,
      loc.AddressInfo.AddressLine2,
    ]
      .filter(Boolean)
      .join(', '),
    town: loc.AddressInfo.Town,
    state: loc.AddressInfo.StateOrProvince,
    postcode: loc.AddressInfo.Postcode,
    country: loc.AddressInfo.Country?.Title,
    latitude: loc.AddressInfo.Latitude,
    longitude: loc.AddressInfo.Longitude,
    distance: loc.AddressInfo.Distance,
    operator: loc.OperatorInfo?.Title,
    usageType: loc.UsageType?.Title,
    isPayAtLocation: loc.UsageType?.IsPayAtLocation,
    isOperational: loc.StatusType?.IsOperational ?? true,
    numberOfPoints: loc.NumberOfPoints,
    connections: (loc.Connections ?? []).map((c) => ({
      type: c.ConnectionType?.Title ?? 'Unknown',
      powerKW: c.PowerKW,
      quantity: c.Quantity,
      isFastCharge: c.Level?.IsFastChargeCapable ?? false,
      isOperational: c.StatusType?.IsOperational ?? true,
    })),
    images: (loc.MediaItems ?? []).map((m) => m.ItemURL),
    comments: loc.GeneralComments,
  };
}

export interface FetchStationsParams {
  latitude: number;
  longitude: number;
  distance?: number;
  maxresults?: number;
}

export async function fetchStations(
  params: FetchStationsParams
): Promise<Station[]> {
  const { latitude, longitude, distance = 50, maxresults = 100 } = params;

  const searchParams = new URLSearchParams({
    output: 'json',
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    distance: distance.toString(),
    maxresults: maxresults.toString(),
    compact: 'true',
    verbose: 'false',
  });

  const key = getApiKey();
  if (key) {
    searchParams.set('key', key);
  }

  const url = `${OCM_BASE_URL}/poi?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(
      `OpenChargeMap API error: ${response.status} ${response.statusText}`
    );
  }

  const data: OCMLocation[] = await response.json();
  return data.map(transformLocation);
}

export async function fetchStationById(id: number): Promise<Station | null> {
  const searchParams = new URLSearchParams({
    output: 'json',
    chargepointid: id.toString(),
    compact: 'true',
    verbose: 'false',
  });

  const key = getApiKey();
  if (key) {
    searchParams.set('key', key);
  }

  const url = `${OCM_BASE_URL}/poi?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(
      `OpenChargeMap API error: ${response.status} ${response.statusText}`
    );
  }

  const data: OCMLocation[] = await response.json();
  return data.length > 0 ? transformLocation(data[0]) : null;
}
