import { useState, useEffect } from 'react';
import type { Station } from '@/types/database';
import { fetchStations, type FetchStationsParams } from '@/lib/openchargemap';

export function useStations(params: FetchStationsParams | null) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStations(params as FetchStationsParams);
        if (!cancelled) {
          setStations(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load stations');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.latitude, params?.longitude, params?.distance, params?.maxresults]);

  return { stations, loading, error };
}
