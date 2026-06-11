import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export default function SignInScreen() {
  const theme = useChargeTheme();
  const [email, setEmail] = useState('yitshen@example.com');
  const [password, setPassword] = useState('chargeone');

  return (
    <Screen
      eyebrow="Welcome back"
      title="Sign in"
      right={<IconButton icon="close" accessibilityLabel="Close sign in" onPress={() => router.back()} />}>
      <View style={{ paddingVertical: 4 }}>
        <BrandMark compact />
      </View>

      <PremiumCard hero style={{ gap: 18 }}>
        <TextField
          label="Email"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Your password"
        />
        <Text style={{ color: Brand.primary, fontSize: 13, fontWeight: '700', alignSelf: 'flex-end' }}>
          Forgot password?
        </Text>
        <PrimaryButton onPress={() => router.replace('/(tabs)/home')}>Sign in</PrimaryButton>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </View>
        <SecondaryButton icon="sparkle" onPress={() => router.replace('/(tabs)/home')}>
          Continue with Google
        </SecondaryButton>
      </PremiumCard>

      <Text selectable style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 13 }}>
        New to ChargeOne?{' '}
        <Text style={{ color: Brand.primary, fontWeight: '800' }} onPress={() => router.push('/(auth)/sign-up')}>
          Create an account
        </Text>
      </Text>
    </Screen>
  );
}
