import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { PremiumCard } from '@/components/ui/premium-card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/theme';
import { useChargeTheme } from '@/hooks/use-charge-theme';

export default function PaymentSetupScreen() {
  const theme = useChargeTheme();

  return (
    <Screen eyebrow="Step 2 of 2" title="Add payment">
      <LinearGradient
        colors={['#2A281F', '#17191E', '#0D0E12']}
        style={{
          minHeight: 210,
          borderRadius: 30,
          borderCurve: 'continuous',
          padding: 24,
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: 'rgba(254,201,45,0.22)',
          boxShadow: '0 24px 55px rgba(0,0,0,0.48)',
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{ width: 45, height: 34, borderRadius: 10, backgroundColor: Brand.primary, opacity: 0.9 }}
          />
          <AppIcon name="bolt" color={Brand.primary} size={30} />
        </View>
        <Text selectable style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700', letterSpacing: 3 }}>
          4242  4242  4242  4242
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#A6AAB4', fontSize: 9, letterSpacing: 1 }}>CARDHOLDER</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>YIT SHEN</Text>
          </View>
          <View>
            <Text style={{ color: '#A6AAB4', fontSize: 9, letterSpacing: 1 }}>EXPIRES</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>08/29</Text>
          </View>
        </View>
      </LinearGradient>

      <PremiumCard hero style={{ gap: 16 }}>
        <TextField
          label="Card number"
          icon="card"
          defaultValue="4242 4242 4242 4242"
          keyboardType="number-pad"
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextField label="Expiry" icon="clock" defaultValue="08/29" />
          </View>
          <View style={{ flex: 1 }}>
            <TextField label="CVV" icon="lock" defaultValue="123" secureTextEntry />
          </View>
        </View>
        <TextField label="Name on card" icon="user" defaultValue="Yit Shen" />
      </PremiumCard>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SecondaryButton icon="card" style={{ flex: 1 }}>
          Apple Pay
        </SecondaryButton>
        <SecondaryButton icon="sparkle" style={{ flex: 1 }}>
          Google Pay
        </SecondaryButton>
      </View>

      <PremiumCard style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppIcon name="shield" color={Brand.success} size={25} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Secure and encrypted</Text>
          <Text selectable style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 17 }}>
            Payment details are tokenized and never stored on ChargeOne servers.
          </Text>
        </View>
      </PremiumCard>

      <PrimaryButton onPress={() => router.replace('/(tabs)/home')}>Finish setup</PrimaryButton>
    </Screen>
  );
}
