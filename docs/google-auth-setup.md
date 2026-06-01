# Google Sign-In + Supabase Auth Setup

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

| File | Change |
|---|---|
| `package.json` | Removed `@expo/ui`, `expo-glass-effect` |
| `.env.example` | Updated with Supabase + Google env vars |
| `src/lib/supabase.ts` | **New** — Supabase client |
| `src/hooks/use-google-auth.ts` | Platform-aware auth (native GoogleSignin + Supabase, web Supabase OAuth) |
| `src/components/icon.tsx` | **New** — web text icon fallback |
| `src/components/icon.native.tsx` | **New** — native SymbolView wrapper |
| `src/components/app-tabs.web.tsx` | Replaced `SymbolView` → `Icon` |
| `src/app/explore.tsx` | Replaced `SymbolView` → `Icon` |
| `src/components/ui/collapsible.tsx` | Replaced `SymbolView` → `Icon` |
| `src/app/(auth)/login.tsx` | Added sign-out button |
