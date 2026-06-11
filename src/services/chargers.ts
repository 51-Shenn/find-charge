import { useQuery } from '@tanstack/react-query';

import { chargers } from '@/data/demo';

async function fetchChargers() {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return chargers;
}

export function useChargers() {
  return useQuery({
    queryKey: ['chargers'],
    queryFn: fetchChargers,
    staleTime: 60_000,
  });
}

export function getCharger(id: string) {
  return chargers.find((charger) => charger.id === id) ?? chargers[0];
}
