export type ChargerStatus = 'available' | 'busy' | 'offline';

export type Charger = {
  id: string;
  stationName: string;
  operator: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  status: ChargerStatus;
  availableStalls: number;
  occupiedStalls: number;
  offlineStalls: number;
  connectorTypes: string[];
  powerKw: number;
  pricePerKwh: number;
  idleFee: string;
  parkingFee: string;
  openingHours: string;
  reliabilityScore: number;
  compatibleVehicles: string[];
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  batteryKwh: number;
  rangeKm: number;
  connector: string;
};

export type RouteOption = {
  id: string;
  name: string;
  subtitle: string;
  distanceKm: number;
  driveMinutes: number;
  chargeMinutes: number;
  costRm: number;
  stops: number;
  arrivalBattery: number;
  carbonKg: number;
  recommended?: boolean;
};

export type ChargingSession = {
  id: string;
  date: string;
  station: string;
  operator: string;
  amountRm: number;
  energyKwh: number;
  durationMinutes: number;
  paymentMethod: string;
};
