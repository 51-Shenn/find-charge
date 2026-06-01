import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGoogleAuth } from '@/hooks/use-google-auth';

export default function LoginScreen() {
  const { signIn, signOut } = useGoogleAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">FindCharge</ThemedText>
        <ThemedText type="small">Sign in to continue</ThemedText>

        <TouchableOpacity style={styles.button} onPress={signIn}>
          <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  button: { backgroundColor: '#4285F4', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  signOutButton: { backgroundColor: '#ccc', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  signOutButtonText: { color: '#000', fontWeight: '600' },
});