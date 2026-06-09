# FindCharge - AGENTS.md

## Environment & Tooling
- **Framework**: Expo v56 (SDK 56)
- **Routing**: `expo-router` (file-based routing in `src/app`)
- **Backend**: Supabase
- **Platforms**: Android and Web

## Developer Commands
- `npm run start`: Start the development server
- `npm run android`: Build and run on Android emulator/device
- `npm run web`: Start the web version
- `npm run lint`: Run ESLint via `expo lint`

## Key Conventions
- **Platform-Specific Files**: Use `.native.tsx` for native-only logic/packages (e.g., `expo-symbols`) and `.tsx` for web/shared code to avoid bundling sponsor-only packages for web.
- **Environment Variables**: Must be prefixed with `EXPO_PUBLIC_` to be available in the client bundle. 
- **Builds**: Environment variable changes require a rebuild (e.g., `npm run android`) because they are inlined at build time.

## Authentication Flow
Implemented in `src/hooks/use-google-auth.ts`:
- **Android**: `@react-native-google-signin/google-signin` $\rightarrow$ `idToken` $\rightarrow$ `supabase.auth.signInWithIdToken()`
- **Web**: `supabase.auth.signInWithOAuth({ provider: 'google' })` (Redirect flow)

## Important Files
- `src/app/_layout.tsx`: Root layout and provider setup.
- `src/lib/supabase.ts`: Supabase client initialization.
- `src/hooks/use-google-auth.ts`: Cross-platform Google authentication logic.
- `app.json`: Expo configuration, including scheme and plugins.
