import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import OrderIcon from '../assets/Svg/OrderIcon.svg';
import SecurePaymentLockIcon from '../assets/Svg/SecurePayementlockIcon.svg';
import WalletIcon from '../assets/Svg/WalletIcon.svg';
import { theme } from '../constants/colors';
import { RootStackParamList } from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const quickOptions = ['Transaction', 'Payment\nMethods', 'Offers'];

export default function WalletScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.navyDark}
      />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={12}
            onPress={navigation.goBack}
            style={styles.backButton}
          >
            <BackArrowIcon width={21} height={14} color={theme.colors.white} />
          </Pressable>
          <Text style={styles.title}>Wallet</Text>
        </View>

        <View style={styles.balanceCard}>
          <View pointerEvents="none" style={styles.glassGlow} />
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>Wallet Balance</Text>
              <Text style={styles.balance}>$ 2,450</Text>
            </View>
            <WalletIcon width={49} height={44} />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('AddMoney')}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.addButtonText}>+ Add Money</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.quickHeadingRow}>
          <Text style={styles.quickHeading}>Quick Option</Text>
          <Text style={styles.goToProfile}>Go to Profile</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickOptions.map(label => (
            <Pressable
              accessibilityRole="button"
              key={label}
              onPress={() => {
                if (label === 'Transaction') {
                  navigation.navigate('AllTransactions');
                }
              }}
              style={({ pressed }) => [
                styles.quickCard,
                pressed && styles.pressed,
              ]}
            >
              <OrderIcon width={23} height={26} color={theme.colors.primary} />
              <Text style={styles.quickLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.secureCard}>
          <SecurePaymentLockIcon width={18} height={23} />
          <View style={styles.secureCopy}>
            <Text style={styles.secureTitle}>Secure Payment</Text>
            <Text style={styles.secureText}>
              Your Payment details are Safe with Us
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>@NeyFuel2026</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.navyDark, flex: 1 },
  header: {
    backgroundColor: theme.colors.navyDark,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  titleRow: { alignItems: 'center', height: 48, justifyContent: 'center' },
  backButton: { left: 0, position: 'absolute' },
  title: {
    color: theme.colors.white,
    fontFamily: theme.typography.heading,
    fontSize: 17,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderColor: theme.colors.headerBorder,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 122,
    overflow: 'hidden',
    paddingTop: 14,
  },
  glassGlow: {
    backgroundColor: 'rgba(91,139,209,0.08)',
    borderRadius: 80,
    height: 160,
    position: 'absolute',
    right: -50,
    top: -90,
    width: 160,
  },
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 13,
  },
  balanceLabel: {
    color: theme.colors.white,
    fontFamily: theme.typography.bodyBold,
    fontSize: 10,
  },
  balance: {
    color: theme.colors.white,
    fontFamily: theme.typography.heading,
    fontSize: 28,
    marginTop: 5,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    height: 33,
    justifyContent: 'center',
    marginBottom: 11,
    marginHorizontal: 10,
  },
  addButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.bodyBold,
    fontSize: 10,
  },
  content: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 29,
  },
  quickHeadingRow: { alignItems: 'center', flexDirection: 'row' },
  quickHeading: {
    color: theme.colors.text,
    fontFamily: theme.typography.heading,
    fontSize: 14,
  },
  goToProfile: {
    color: theme.colors.white,
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
    marginLeft: 24,
  },
  quickGrid: { flexDirection: 'row', gap: 8, marginTop: 13 },
  quickCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.quickCard,
    borderColor: theme.colors.border,
    borderRadius: 5,
    borderWidth: 1,
    elevation: 2,
    flex: 1,
    height: 82,
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingTop: 16,
    shadowColor: theme.colors.navy,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  quickLabel: {
    color: theme.colors.navy,
    fontFamily: theme.typography.body,
    fontSize: 11,
    lineHeight: 12,
    textAlign: 'center',
  },
  secureCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.secureBackground,
    borderRadius: 8,
    flexDirection: 'row',
    height: 49,
    marginTop: 'auto',
    paddingHorizontal: 13,
  },
  secureCopy: { marginLeft: 13 },
  secureTitle: {
    color: theme.colors.navy,
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
  },
  secureText: {
    color: theme.colors.navy,
    fontFamily: theme.typography.body,
    fontSize: 8,
    marginTop: 2,
  },
  footer: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 9,
    paddingBottom: 8,
    paddingTop: 105,
    textAlign: 'center',
  },
  pressed: { opacity: 0.75 },
});
