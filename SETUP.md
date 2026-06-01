# React Native Project Setup

1. Clone GitHub repository
2. Run `npx create-expo-app@latest` to create new **Expo** project
3. Create a new Supabase project
4. In Supabase, go to Authentication > Sign In / Providers > Google
5. Go to Google Cloud Console > Create new project > Select the project
6. Go to Google Auth Platform > Clients > Get Started > Fill in the necessary details > Create OAuth client
7. Run the following to get SHA-1 certificate fingerprint
```bash
cd android
./gradlew signingReport
# choose SHA-1 for the first one (app:signingReport)
# variant: debug
# config: debug
```
8. Copy and paste the client id as GOOGLE_ANDROID_CLIENT_ID in `.env`
9. Create another one for GOOGLE_WEB_CLIENT_ID and GOOGLE_WEB_CLIENT_SECRET in `.env`, use Supabase's Callback URL and insert as one of Authorized redirect URIs in Google Cloud Console
10. Install dependencies 
```bash
npx expo install @react-native-google-signin/google-signin
```
11. Configure `app.json`
```json
{
  "expo": {
	"name": "FindCharge",
	"slug": "find-charge",
	"version": "1.0.0",
	"orientation": "portrait",
	"icon": "./assets/images/icon.png",
	"scheme": "chargediscovery",
	"userInterfaceStyle": "automatic",
	"ios": {
	  "icon": "./assets/expo.icon"
	},
	"android": {
	  "adaptiveIcon": {
		"backgroundColor": "#E6F4FE",
		"foregroundImage": "./assets/images/android-icon-foreground.png",
		"backgroundImage": "./assets/images/android-icon-background.png",
		"monochromeImage": "./assets/images/android-icon-monochrome.png"
	  },
	  "predictiveBackGestureEnabled": false,
	  "package": "com.anonymous.chargediscovery",
	  "name": "FindCharge"
	},
	"web": {
	  "output": "static",
	  "favicon": "./assets/images/favicon.png"
	},
	"plugins": [
	  "expo-router",
	  [
		"expo-splash-screen",
		{
		  "backgroundColor": "#208AEF",
		  "android": {
			"image": "./assets/images/splash-icon.png",
			"imageWidth": 76
		  }
		}
	  ],
	  "@react-native-google-signin/google-signin"
	],
	"experiments": {
	  "typedRoutes": true,
	  "reactCompiler": true
	}
  }
}
```
12. `src/hooks/useGoogleAuth.ts`
```typescript
// hooks/useGoogleAuth.ts
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';

if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
  throw new Error('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env');
}

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

export function useGoogleAuth() {
  const signIn = async (): Promise<void> => {
    try {
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
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services unavailable');
      } else {
        console.error('Sign-in error:', error);
      }
    }
  };

  const signOut = async (): Promise<void> => {
    await GoogleSignin.signOut();
    await supabase.auth.signOut();
  };

  return { signIn, signOut };
}
```
13. `src/app/(auth)/login.tsx`
```tsx
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
```
14. `src/app/(auth)/_layout.tsx`
```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```
15. `src/app/_layout.tsx`
```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Stack } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* <AppTabs /> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </ThemeProvider>
  );
}
```
16. `src/app/(tabs)/_layout.tsx`
```tsx
import AppTabs from '@/components/app-tabs';

export default function TabLayout() {
  return <AppTabs />;
}
```
17. Run `npm install @supabase/supabase-js` and create `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL in .env');
}
if (!supabaseAnonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```
18. `.env`
```
EXPO_PUBLIC_API_URL=http://localhost:8081
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
GOOGLE_WEB_CLIENT_SECRET=
GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

# Common Issues: Google Sign-In + Supabase Auth Setup

## Issues Solved

### 1. No `idToken` returned on Android

**Root cause**: `process.env.GOOGLE_WEB_CLIENT_ID` in `use-google-auth.ts` — Expo only inlines `EXPO_PUBLIC_*` env vars into the client bundle. Without the prefix, the variable was `undefined` at runtime, so `GoogleSignin.configure()` had no `webClientId`.

**Fix**: Renamed env var to `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` and updated the code.

### 2. Google Cloud Console — which client ID goes where?

| Credential | Where to put it |
|---|---|
| **Web Client ID** | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in `.env` + Supabase Dashboard (Authentication → Providers → Google) |
| **Web Client Secret** | Supabase Dashboard only (never in app code) |
| **Android Client ID** | Created in GCP Console with your SHA-1 fingerprint + package name `com.anonymous.chargediscovery`. Never appears in code — Google Play Services uses it automatically. |

**Authorized redirect URI** in the Web client: `https://[project].supabase.co/auth/v1/callback` — keep it, Supabase needs it.

### 3. SHA-1 fingerprint

Run this on your dev machine (not the phone) to find your debug keystore SHA-1:

```powershell
keytool -list -v -alias androiddebugkey -keystore "$env:USERPROFILE\.android\debug.keystore" -storepass android -keypass android
```

Paste this SHA-1 into your **Android** OAuth client ID in Google Cloud Console. If you built with a release keystore (EAS Build, etc.), use that keystore's SHA-1 instead.

### 4. "Backend verification failed" → Switched to Supabase

The old code did a raw `fetch` to a custom backend. Replaced with `supabase.auth.signInWithIdToken()`:

```
Google Sign-In  →  idToken  →  supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })
```

This requires Supabase to be set up:
1. Enable Google provider in **Supabase Dashboard → Authentication → Providers → Google**
2. Paste the same **Web Client ID** and **Web Client Secret** from GCP
3. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to `.env`

### 5. Web browser shows sponsor message

**Root cause**: `@expo/ui` and `expo-glass-effect` are sponsor-only Expo packages. They were in `package.json` as unused dependencies from the template but still triggered the sponsor gate on web.

**Fix**: Removed both from `package.json`.

### 6. "Play Services unavailable" on web

**Root cause**: `GoogleSignin.hasPlayServices()` is Android-only, crashes on web.

**Fix**: `use-google-auth.ts` now checks `Platform.OS`:

- **Native (Android)**: Uses `GoogleSignin.signIn()` → `supabase.auth.signInWithIdToken()`
- **Web**: Uses `supabase.auth.signInWithOAuth({ provider: 'google' })` (redirect flow)

### 7. `expo-symbols` `SymbolView` sponsor gate on web

**Root cause**: `expo-symbols` requires Expo sponsorship on non-native platforms.

**Fix**: Created a cross-platform `Icon` component:
- `icon.tsx` (web) — renders Unicode text fallbacks (↗, ▸)
- `icon.native.tsx` (native) — wraps `SymbolView` from `expo-symbols`

Platform-specific file resolution (`.native.tsx` vs `.tsx`) ensures `expo-symbols` is never bundled for web.

## Env File

```env
# Google (from GCP Console > APIs & Services > Credentials > Web OAuth client)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com

# Supabase (from Project Settings > API)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## Rebuild Required

Env vars are inlined at build time by Metro. After changing `.env`, rebuild:

```bash
npx expo run:android   # or EAS Build
```

## Files Changed

| File                                | Change                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `package.json`                      | Removed `@expo/ui`, `expo-glass-effect`                                  |
| `.env.example`                      | Updated with Supabase + Google env vars                                  |
| `src/lib/supabase.ts`               | **New** — Supabase client                                                |
| `src/hooks/use-google-auth.ts`      | Platform-aware auth (native GoogleSignin + Supabase, web Supabase OAuth) |
| `src/components/icon.tsx`           | **New** — web text icon fallback                                         |
| `src/components/icon.native.tsx`    | **New** — native SymbolView wrapper                                      |
| `src/components/app-tabs.web.tsx`   | Replaced `SymbolView` → `Icon`                                           |
| `src/app/explore.tsx`               | Replaced `SymbolView` → `Icon`                                           |
| `src/components/ui/collapsible.tsx` | Replaced `SymbolView` → `Icon`                                           |
| `src/app/(auth)/login.tsx`          | Added sign-out button                                                    |
