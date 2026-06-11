import { create } from 'zustand';

import { vehicles } from '@/data/demo';

type ThemeMode = 'system' | 'light' | 'dark';

type AppState = {
  selectedVehicleId: string;
  selectedChargerId: string;
  chargeLimit: number;
  themeMode: ThemeMode;
  setSelectedVehicleId: (id: string) => void;
  setSelectedChargerId: (id: string) => void;
  setChargeLimit: (limit: number) => void;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedVehicleId: vehicles[0].id,
  selectedChargerId: 'gentari-klcc',
  chargeLimit: 90,
  themeMode: 'system',
  setSelectedVehicleId: (selectedVehicleId) => set({ selectedVehicleId }),
  setSelectedChargerId: (selectedChargerId) => set({ selectedChargerId }),
  setChargeLimit: (chargeLimit) => set({ chargeLimit }),
  setThemeMode: (themeMode) => set({ themeMode }),
}));
