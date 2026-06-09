import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Station } from '@/types/database';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFavorites([]);
        return;
      }

      const { data, error: dbError } = await supabase
        .from('favorites')
        .select('station_data')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      setFavorites((data ?? []).map((row: any) => row.station_data as Station));
    } catch (err: any) {
      setError(err.message ?? 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (station: Station) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error: dbError } = await supabase.from('favorites').insert({
      user_id: user.id,
      station_id: station.id.toString(),
      station_data: station as any,
    });

    if (dbError) throw dbError;
    setFavorites((prev) => [station, ...prev]);
  }, []);

  const removeFavorite = useCallback(async (stationId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error: dbError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('station_id', stationId.toString());

    if (dbError) throw dbError;
    setFavorites((prev) => prev.filter((s) => s.id !== stationId));
  }, []);

  const isFavorite = useCallback(
    (stationId: number) => favorites.some((s) => s.id === stationId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (station: Station) => {
      if (isFavorite(station.id)) {
        await removeFavorite(station.id);
      } else {
        await addFavorite(station);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refresh: loadFavorites,
  };
}
