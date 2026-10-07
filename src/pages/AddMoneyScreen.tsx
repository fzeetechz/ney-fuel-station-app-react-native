import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import BankCardIcon from '../assets/Svg/BanlCardIcon.svg';
import MobileMoneyIcon from '../assets/Svg/MobileMoneyIcon.svg';
import QRCodeIcon from '../assets/Svg/QRCodeIcon.svg';
import {theme} from '../constants/colors';
import {RootStackParamList} from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMoney'>;
type PaymentMethod = 'QR Code' | 'Mobile Money' | 'Bank Card';

const amounts = [50, 100, 200, 500];
const paymentMethods = [
  {name: 'QR Code' as const, detail: 'Pay via QR', Icon: QRCodeIcon},
  {name: 'Mobile Money' as const, detail: 'Balance : BND 245.00', Icon: MobileMoneyIcon},
  {name: 'Bank Card' as const, detail: 'Balance : BND 245.00', Icon: BankCardIcon},
];

export default function AddMoneyScreen({navigation}: Props) {
  const [amount, setAmount] = useState('150');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('Bank Card');

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.navyDark} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              hitSlop={12}
              onPress={navigation.goBack}
              style={styles.backButton}>
              <BackArrowIcon width={21} height={14} color={theme.colors.white} />
            </Pressable>
            <Text style={styles.title}>Add Money</Text>
          </View>
          <Text style={styles.inputLabel}>Enter Amount</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.currency}>BND</Text>
            <TextInput
              accessibilityLabel="Amount"
              keyboardType="number-pad"
              onChangeText={value => setAmount(value.replace(/[^0-9]/g, ''))}
              placeholder="0"
              placeholderTextColor={theme.colors.white}
              selectionColor={theme.colors.white}
              style={styles.input}
              value={amount}
            />
          </View>
          <View style={styles.presets}>
            {amounts.map(value => (
              <Pressable
                accessibilityRole="button"
                key={value}
                onPress={() => setAmount(String(value))}
                style={({pressed}) => [styles.preset, pressed && styles.pressed]}>
                <Text style={styles.presetText}>{value} L</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionHeading}>Select Payment Methods</Text>
            <Text style={styles.goToProfile}>Go to Profile</Text>
          </View>
          <View style={styles.paymentCard}>
            {paymentMethods.map(({name, detail, Icon}, index) => {
              const selected = paymentMethod === name;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{checked: selected}}
                  key={name}
                  onPress={() => setPaymentMethod(name)}
                  style={({pressed}) => [
                    styles.paymentRow,
                    index < paymentMethods.length - 1 && styles.rowBorder,
                    pressed && styles.pressed,
                  ]}>
                  <View style={[styles.iconCircle, name === 'Bank Card' && styles.bankIconCircle]}>
                    <Icon
                      width={name === 'Mobile Money' ? 12 : 20}
                      height={name === 'Bank Card' ? 13 : 20}
                    />
                  </View>
                  <View style={styles.paymentCopy}>
                    <Text style={styles.paymentName}>{name}</Text>
                    <Text style={styles.paymentDetail}>{detail}</Text>
                  </View>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            accessibilityRole="button"
            style={({pressed}) => [styles.submitButton, pressed && styles.pressed]}>
            <Text style={styles.submitText}>Add Money</Text>
          </Pressable>
          <Text style={styles.footer}>@NeyFuel2026</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: theme.colors.navyDark, flex: 1},
  screen: {flex: 1},
  header: {
    backgroundColor: theme.colors.navyDark,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    height: 188,
    paddingHorizontal: 16,
  },
  titleRow: {alignItems: 'center', height: 48, justifyContent: 'center'},
  backButton: {left: 0, position: 'absolute'},
  title: {color: theme.colors.white, fontFamily: theme.typography.heading, fontSize: 17},
  inputLabel: {color: theme.colors.white, fontFamily: theme.typography.body, fontSize: 11, marginBottom: 4, marginLeft: 2},
  inputWrap: {alignItems: 'center', borderColor: theme.colors.headerBorder, borderRadius: 8, borderWidth: 1, flexDirection: 'row', height: 34, paddingHorizontal: 12},
  currency: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 10},
  input: {color: theme.colors.white, flex: 1, fontFamily: theme.typography.bodyBold, fontSize: 10, height: 34, paddingHorizontal: 4, paddingVertical: 0},
  presets: {flexDirection: 'row', gap: 8, marginTop: 14},
  preset: {alignItems: 'center', backgroundColor: theme.colors.amountPreset, borderRadius: 3, flex: 1, height: 29, justifyContent: 'center'},
  presetText: {color: theme.colors.white, fontFamily: theme.typography.body, fontSize: 11},
  content: {backgroundColor: theme.colors.background, flex: 1, paddingHorizontal: 16, paddingTop: 19},
  sectionHeadingRow: {alignItems: 'center', flexDirection: 'row'},
  sectionHeading: {color: theme.colors.text, fontFamily: theme.typography.heading, fontSize: 14},
  goToProfile: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 11, marginLeft: 26},
  paymentCard: {backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderRadius: 4, borderWidth: 1, elevation: 2, marginTop: 18, shadowColor: theme.colors.text, shadowOffset: {height: 2, width: 0}, shadowOpacity: 0.15, shadowRadius: 2},
  paymentRow: {alignItems: 'center', flexDirection: 'row', height: 53, paddingHorizontal: 14},
  rowBorder: {borderBottomColor: theme.colors.border, borderBottomWidth: 1},
  iconCircle: {alignItems: 'center', backgroundColor: theme.colors.paymentIcon, borderRadius: 18, height: 36, justifyContent: 'center', width: 36},
  bankIconCircle: {backgroundColor: theme.colors.paymentCardIcon},
  paymentCopy: {flex: 1, marginLeft: 10},
  paymentName: {color: theme.colors.navy, fontFamily: theme.typography.bodyBold, fontSize: 10},
  paymentDetail: {color: theme.colors.navy, fontFamily: theme.typography.body, fontSize: 9, marginTop: 3},
  radio: {alignItems: 'center', borderColor: theme.colors.border, borderRadius: 8, borderWidth: 1, height: 16, justifyContent: 'center', width: 16},
  radioSelected: {backgroundColor: theme.colors.primary, borderColor: theme.colors.primary},
  check: {color: theme.colors.white, fontFamily: theme.typography.bodyBold, fontSize: 9},
  submitButton: {alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 4, height: 37, justifyContent: 'center', marginTop: 'auto'},
  submitText: {color: theme.colors.white, fontFamily: theme.typography.heading, fontSize: 14},
  footer: {color: theme.colors.muted, fontFamily: theme.typography.body, fontSize: 9, paddingBottom: 1, paddingTop: 30, textAlign: 'center'},
  pressed: {opacity: 0.75},
});
