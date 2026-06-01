import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
  throw new Error('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env');
}

export function useGoogleAuth() {
  const signIn = async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        return;
      }

      const { GoogleSignin, statusCodes } = await import(
        '@react-native-google-signin/google-signin'
      );

      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) throw new Error('No ID token returned');

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      console.log('Signed in:', data.user?.email);
    } catch (error: any) {
      if (Platform.OS !== 'web' && error.code) {
        const { statusCodes } = await import('@react-native-google-signin/google-signin');
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('Cancelled');
          return;
        }
        if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Already in progress');
          return;
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play Services unavailable');
          return;
        }
      }
      console.error('Sign-in error:', error);
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  return { signIn, signOut };
}