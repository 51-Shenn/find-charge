import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  return {
    ...config,
    name: config.name ?? 'ChargeOne',
    slug: config.slug ?? 'find-charge',
    android: {
      ...config.android,
      ...(googleMapsApiKey
        ? {
            config: {
              ...config.android?.config,
              googleMaps: { apiKey: googleMapsApiKey },
            },
          }
        : {}),
    },
    extra: {
      ...config.extra,
      googleMapsApiKeyConfigured: Boolean(googleMapsApiKey),
    },
  };
};
