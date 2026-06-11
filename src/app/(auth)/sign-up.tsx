import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { IconButton, PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

type SignUpFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  const theme = useChargeTheme();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFields>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const password = watch('password');
  const submit = handleSubmit(() => router.replace('/(onboarding)/ev-setup'));

  return (
    <Screen
      eyebrow="Your unified charging account"
      title="Create account"
      right={<IconButton icon="close" accessibilityLabel="Close sign up" onPress={() => router.back()} />}>
      <PremiumCard hero style={{ gap: 16 }}>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Enter your full name.' }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Full name"
              icon="user"
              value={value}
              onChangeText={onChange}
              placeholder="Yit Shen"
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Enter your email.',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Email"
              icon="mail"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Create a password.',
            minLength: { value: 8, message: 'Use at least 8 characters.' },
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Password"
              icon="lock"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              placeholder="At least 8 characters"
              error={errors.password?.message}
            />
          )}
        />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {[1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: password.length >= level * 2 ? Brand.primary : theme.border,
              }}
            />
          ))}
        </View>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirm your password.',
            validate: (value) => value === password || 'Passwords do not match.',
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Confirm password"
              icon="shield"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
            />
          )}
        />
        <PrimaryButton onPress={submit}>Create account</PrimaryButton>
        <SecondaryButton icon="sparkle" onPress={() => router.replace('/(onboarding)/ev-setup')}>
          Continue with Google
        </SecondaryButton>
      </PremiumCard>
      <Text selectable style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 12, lineHeight: 18 }}>
        By continuing, you agree to ChargeOne's terms and privacy policy.
      </Text>
    </Screen>
  );
}
