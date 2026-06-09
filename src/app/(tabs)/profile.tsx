import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StationCard } from '@/components/station-card';
import { Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useFavorites } from '@/hooks/use-favorites';
import type { Station } from '@/types/database';

export default function ProfileScreen() {
  const router = useRouter();
  const { favorites, loading, refresh } = useFavorites();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  function handleStationPress(station: Station) {
    router.push(`/station/${station.id}` as any);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <ThemedText type="subtitle">Profile</ThemedText>
      </SafeAreaView>

      <ThemedView type="backgroundElement" style={styles.userCard}>
        <ThemedText type="default" style={styles.email}>
          {email ?? 'Loading...'}
        </ThemedText>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedText type="default" style={styles.sectionTitle}>
        Favorites
      </ThemedText>

      {loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="small" />
        </ThemedView>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StationCard station={item} onPress={handleStationPress} />
          )}
          contentContainerStyle={styles.list}
          onRefresh={refresh}
          refreshing={loading}
          ListEmptyComponent={
            <ThemedView style={styles.centered}>
              <ThemedText themeColor="textSecondary">
                No favorites yet
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.hint}>
                Tap the heart on a station to save it here
              </ThemedText>
            </ThemedView>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  userCard: {
    marginHorizontal: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.four,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  email: {
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: '600',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  list: {
    paddingBottom: 120,
  },
  hint: {
    fontSize: 13,
    marginTop: Spacing.one,
  },
});
