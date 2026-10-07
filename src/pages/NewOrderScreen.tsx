import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import BankCardIcon from '../assets/Svg/BanlCardIcon.svg';
import CalenderIcon from '../assets/Svg/CalenderIcon.svg';
import ForwrdArrowIcon from '../assets/Svg/ForwrdArrowIcon.svg';
import FuelPumpOutline from '../assets/Svg/FuelPumpOutline.svg';
import MobileMoneyIcon from '../assets/Svg/MobileMoneyIcon.svg';
import OrderIcon from '../assets/Svg/OrderIcon.svg';
import QRCodeIcon from '../assets/Svg/QRCodeIcon.svg';
import SecurePaymentLockIcon from '../assets/Svg/SecurePayementlockIcon.svg';
import StepPaymentIcon from '../assets/Svg/StepPaymentIcon.svg';
import WalletIconStep from '../assets/Svg/WalletIconStep.svg';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../routes/types';
import { fontFamilies } from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;
type Step = 0 | 1 | 2 | 3 | 4;
const stepTitles = ['Place New Order', 'Delivery Details', 'Payment'];

function StepHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        <Pressable hitSlop={12} onPress={onBack} style={styles.back}>
          <BackArrowIcon width={20} height={13} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{stepTitles[Math.min(step, 2)]}</Text>
      </View>
      <View style={styles.steps}>
        {[
          { label: 'Fuel', Icon: FuelPumpOutline },
          { label: 'Details', Icon: OrderIcon },
          { label: 'Payment', Icon: StepPaymentIcon },
        ].map(({ label, Icon }, index) => (
          <React.Fragment key={label}>
            {index > 0 && (
              <View
                style={[
                  styles.stepLine,
                  index <= step && styles.stepLineActive,
                ]}
              />
            )}
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  index <= step && styles.stepCircleActive,
                ]}
              >
                <Icon width={index === 0 ? 27 : 29} height={30} color="#FFF" />
              </View>
              <Text style={styles.stepLabel}>{label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

function SectionTitle({
  number,
  children,
}: {
  number: number;
  children: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {number}. {children}
    </Text>
  );
}
function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected && <Text style={styles.check}>✓</Text>}
    </View>
  );
}

export default function OrderScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [fuel, setFuel] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [payment, setPayment] = useState(0);
  const next = () => setStep(value => Math.min(value + 1, 4) as Step);
  const back = () =>
    step > 0 ? setStep(value => (value - 1) as Step) : navigation.goBack();
  if (step === 4)
    return <Confirmation onHome={() => navigation.navigate('Home')} />;
  if (step === 3) return <Review onBack={back} onConfirm={next} />;
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#162F63" />
      <StepHeader step={step} onBack={back} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && (
          <FuelStep
            fuel={fuel}
            setFuel={setFuel}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        )}
        {step === 1 && <DeliveryStep />}
        {step === 2 && (
          <PaymentStep payment={payment} setPayment={setPayment} />
        )}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.bottom}>
        <PrimaryButton
          label={step === 2 ? 'Review Order' : 'Continue'}
          onPress={next}
          rightAccessory={<ForwrdArrowIcon width={25} height={12} />}
        />
        <Text style={styles.footer}>@NeyFuel2026</Text>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function FuelStep({
  fuel,
  setFuel,
  quantity,
  setQuantity,
}: {
  fuel: number;
  setFuel: (v: number) => void;
  quantity: number;
  setQuantity: (v: number) => void;
}) {
  const fuels = [
    { name: 'Diesel', price: '1.36', color: '#19AC35' },
    { name: 'Petrol', price: '1.55', color: '#E7530D' },
    { name: 'LPG (Cooking Gas)', price: '0.36', color: '#172B73' },
  ];
  return (
    <>
      <SectionTitle number={1}>Select Fuel Type</SectionTitle>
      <View style={styles.optionList}>
        {fuels.map((item, index) => (
          <Pressable
            key={item.name}
            onPress={() => setFuel(index)}
            style={[styles.fuelOption, fuel === index && styles.selectedOption]}
          >
            <FuelPumpOutline width={24} height={28} color={item.color} />
            <Text style={styles.fuelName}>{item.name}</Text>
            <Text style={styles.fuelPrice}>{item.price}</Text>
            <Radio selected={fuel === index} />
          </Pressable>
        ))}
      </View>
      <View style={styles.quantitySection}>
        <SectionTitle number={2}>Enter Quantity</SectionTitle>
        <View style={styles.quantityBox}>
          <Pressable
            onPress={() => setQuantity(Math.max(50, quantity - 50))}
            style={styles.roundButton}
          >
            <Text style={styles.math}>−</Text>
          </Pressable>
          <Text style={styles.quantity}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity(quantity + 50)}
            style={styles.roundButton}
          >
            <Text style={styles.math}>+</Text>
          </Pressable>
          <Text style={styles.litres}>Liters</Text>
        </View>
        <View style={styles.presets}>
          {[50, 100, 200, 500].map(value => (
            <Pressable
              key={value}
              onPress={() => setQuantity(value)}
              style={[
                styles.preset,
                quantity === value && styles.presetSelected,
              ]}
            >
              <Text style={styles.presetText}>{value} L</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

function DeliveryStep() {
  return (
    <>
      <SectionTitle number={1}>Delivery Location</SectionTitle>
      <View style={styles.infoCard}>
        <View style={styles.locationHead}>
          <Text style={styles.homeIcon}>⌂</Text>
          <Text style={styles.infoLabel}>Home</Text>
          <Text style={styles.change}>Change</Text>
        </View>
        <Text style={styles.address}>Jalan Muara</Text>
        <Text style={styles.address}>Bandar Seri Begawan BB1514</Text>
        <Text style={styles.address}>Brunei Darussalam</Text>
        <Text style={styles.phone}>⌕ +673 222 555 8888</Text>
      </View>
      <View style={styles.deliveryTime}>
        <SectionTitle number={2}>Delivery Date &amp; Time</SectionTitle>
        <View style={styles.dateCard}>
          <View style={styles.dateRow}>
            <CalenderIcon width={13} height={14} />
            <View style={styles.dateText}>
              <Text style={styles.miniLabel}>Date</Text>
              <Text style={styles.value}>25 May 2025, Sunday</Text>
            </View>
            <Text style={styles.chevron}>⌄</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.clock}>◷</Text>
            <View style={styles.dateText}>
              <Text style={styles.miniLabel}>Time</Text>
              <Text style={styles.value}>10:00 AM to 12:00 PM</Text>
            </View>
            <Text style={styles.chevron}>⌄</Text>
          </View>
        </View>
      </View>
    </>
  );
}

function PaymentStep({
  payment,
  setPayment,
}: {
  payment: number;
  setPayment: (v: number) => void;
}) {
  const methods = [
    {
      name: 'Wallet',
      sub: 'Balance : BND 245.00',
      Icon: WalletIconStep,
      bg: '#FCECE3',
    },
    { name: 'QR Code', sub: 'Pay via QR', Icon: QRCodeIcon, bg: '#E5EAF0' },
    {
      name: 'Mobile Money',
      sub: 'Balance : BND 245.00',
      Icon: MobileMoneyIcon,
      bg: '#E8EDF4',
    },
    {
      name: 'Bank Card',
      sub: 'Balance : BND 245.00',
      Icon: BankCardIcon,
      bg: '#E1F5E5',
    },
  ];
  return (
    <>
      <SectionTitle number={1}>Choose Payment Method</SectionTitle>
      <View style={styles.paymentCard}>
        {methods.map(({ name, sub, Icon, bg }, index) => (
          <Pressable
            key={name}
            onPress={() => setPayment(index)}
            style={[
              styles.paymentRow,
              index < methods.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={[styles.paymentIcon, { backgroundColor: bg }]}>
              <Icon width={20} height={20} />
            </View>
            <View style={styles.paymentText}>
              <Text style={styles.paymentName}>{name}</Text>
              <Text style={styles.paymentSub}>{sub}</Text>
            </View>
            <Radio selected={payment === index} />
          </Pressable>
        ))}
      </View>
      <View style={styles.secure}>
        <SecurePaymentLockIcon width={20} height={25} />
        <View>
          <Text style={styles.secureTitle}>Secure Payment</Text>
          <Text style={styles.secureSub}>
            Your Payment details are Safe with Us
          </Text>
        </View>
      </View>
    </>
  );
}

function Review({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: () => void;
}) {
  const rows = [
    ['Fuel Type', 'Diesel'],
    ['Quantity', '100 Liters'],
    [
      'Delivery Location',
      'HOME\nJalan Muara, Bandar Seri Begawan BB1514\nBrunei Darussalam',
    ],
    ['Delivery Time', '25 May 2025, Sunday\n10:00 AM - 12:00 PM'],
    ['Payment Method', 'Wallet'],
  ];
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.reviewSafe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />
      <View style={styles.reviewHeader}>
        <Pressable onPress={onBack}>
          <BackArrowIcon width={20} height={13} />
        </Pressable>
        <Text style={styles.reviewTitle}>Review Order</Text>
      </View>
      <View style={styles.reviewContent}>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{label}</Text>
              <Text style={styles.summaryValue}>{value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.estimate}>
          <Text style={styles.estimateLabel}>Estimated Amount</Text>
          <Text style={styles.estimateValue}>BND 136.00</Text>
        </View>
        <PrimaryButton label="Confirm Order" onPress={onConfirm} />
      </View>
      <Text style={styles.reviewFooter}>@NeyFuel2026</Text>
    </SafeAreaView>
  );
}

function Confirmation({ onHome }: { onHome: () => void }) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.confirmSafe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EBFBF0" />
      <ScrollView
        contentContainerStyle={styles.confirmContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../assets/Images/OrderConfirmScreenTopimage.png')}
          resizeMode="contain"
          style={styles.confirmImage}
        />
        <View style={styles.confirmBody}>
          <Text style={styles.confirmTitle}>Order Confirmed</Text>
          <Text style={styles.confirmSub}>
            You fuel delivery order has been{`\n`}placed successfully.
          </Text>
          <View style={styles.confirmCard}>
            <InfoLine label="Order ID" value="#ORD12345" />
            <InfoLine
              label="Delivery Date & Time"
              value={'25 May 2025, Sunday\n10:00 AM - 12:00 PM'}
            />
            <InfoLine
              label="Total Amount"
              value={'BND 136.00\nPaid Via Wallet'}
              last
            />
          </View>
          <PrimaryButton label="Track Order" onPress={() => {}} />
          <Pressable onPress={onHome}>
            <Text style={styles.backHome}>Back to Home</Text>
          </Pressable>
        </View>
        <Text style={styles.confirmFooter}>@NeyFuel2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
function InfoLine({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.confirmRow, !last && styles.rowBorder]}>
      <Text style={styles.confirmLabel}>{label}</Text>
      <Text style={styles.confirmValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#162F63', flex: 1 },
  header: {
    backgroundColor: '#162F63',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    height: 184,
  },
  headerTitleRow: {
    alignItems: 'center',
    height: 66,
    justifyContent: 'center',
  },
  back: { left: 18, position: 'absolute' },
  headerTitle: {
    color: '#FFF',
    fontFamily: fontFamilies.heading,
    fontSize: 19,
  },
  steps: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  stepItem: { alignItems: 'center', width: 82 },
  stepCircle: {
    alignItems: 'center',
    backgroundColor: '#203E76',
    borderRadius: 31,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  stepCircleActive: { backgroundColor: colors.primary },
  stepLabel: {
    color: '#FFF',
    fontFamily: fontFamilies.body,
    fontSize: 12,
    marginTop: 9,
  },
  stepLine: {
    backgroundColor: '#294779',
    height: 1,
    marginHorizontal: -3,
    marginTop: 31,
    width: 55,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  scroll: { backgroundColor: '#F6F6F8', flex: 1 },
  content: { padding: 15, paddingBottom: 20 },
  sectionTitle: {
    color: '#151515',
    fontFamily: fontFamilies.heading,
    fontSize: 14,
    marginBottom: 14,
    marginTop: 5,
  },
  optionList: { gap: 6 },
  fuelOption: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#E1E1E1',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    height: 57,
    paddingHorizontal: 11,
  },
  selectedOption: { backgroundColor: '#F7EAE3', borderColor: colors.primary },
  fuelName: {
    color: '#102A55',
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 12,
    marginLeft: 12,
  },
  fuelPrice: {
    color: '#102A55',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
    marginRight: 10,
  },
  radio: {
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderRadius: 9,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  check: { color: '#FFF', fontFamily: fontFamilies.bodyBold, fontSize: 10 },
  quantitySection: { marginTop: 21 },
  quantityBox: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#E3E3E3',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    height: 57,
    paddingHorizontal: 15,
  },
  roundButton: {
    alignItems: 'center',
    borderColor: '#ECECEC',
    borderRadius: 14,
    borderWidth: 1,
    height: 27,
    justifyContent: 'center',
    width: 27,
  },
  math: { color: '#000', fontFamily: fontFamilies.bodyBold, fontSize: 20 },
  quantity: {
    color: '#111',
    flex: 1,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
    textAlign: 'center',
  },
  litres: {
    color: '#555',
    fontFamily: fontFamilies.body,
    fontSize: 10,
    marginLeft: 20,
    width: 55,
  },
  presets: { flexDirection: 'row', gap: 8, marginTop: 10 },
  preset: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#DFDFDF',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 29,
    justifyContent: 'center',
  },
  presetSelected: { borderColor: '#328CFF', borderWidth: 2 },
  presetText: { color: '#102A55', fontFamily: fontFamilies.body, fontSize: 11 },
  bottom: { backgroundColor: '#F6F6F8', paddingHorizontal: 14, paddingTop: 6 },
  footer: {
    color: '#666',
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginBottom: 1,
    marginTop: 10,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    elevation: 2,
    padding: 13,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.17,
    shadowRadius: 2,
  },
  locationHead: { alignItems: 'center', flexDirection: 'row' },
  homeIcon: { color: '#1D7976', fontSize: 17 },
  infoLabel: {
    color: '#183555',
    fontFamily: fontFamilies.body,
    fontSize: 10,
    marginLeft: 7,
  },
  change: {
    color: colors.primary,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
    marginLeft: 'auto',
  },
  address: {
    color: '#5C5C5C',
    fontFamily: fontFamilies.body,
    fontSize: 8,
    marginLeft: 18,
    marginTop: 5,
  },
  phone: {
    color: '#555',
    fontFamily: fontFamilies.body,
    fontSize: 8,
    marginLeft: 18,
    marginTop: 9,
  },
  deliveryTime: { marginTop: 20 },
  dateCard: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
  },
  dateRow: {
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 47,
    paddingHorizontal: 9,
  },
  dateText: { marginLeft: 10 },
  miniLabel: { color: '#4D5360', fontFamily: fontFamilies.body, fontSize: 9 },
  value: {
    color: '#102A55',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
    marginTop: 3,
  },
  chevron: { fontSize: 17, marginLeft: 'auto' },
  clock: { color: '#555', fontSize: 17 },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  paymentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 51,
    paddingHorizontal: 13,
  },
  rowBorder: { borderBottomColor: '#E8E8E8', borderBottomWidth: 1 },
  paymentIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  paymentText: { flex: 1, marginLeft: 9 },
  paymentName: {
    color: '#102A55',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
  },
  paymentSub: {
    color: '#102A55',
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginTop: 3,
  },
  secure: {
    alignItems: 'center',
    backgroundColor: '#DDEFE3',
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 82,
    minHeight: 51,
    paddingHorizontal: 13,
  },
  secureTitle: {
    color: '#294764',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 11,
    marginLeft: 12,
  },
  secureSub: {
    color: '#294764',
    fontFamily: fontFamilies.body,
    fontSize: 8,
    marginLeft: 12,
    marginTop: 3,
  },
  reviewSafe: { backgroundColor: '#F5F5F7', flex: 1 },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 57,
    paddingHorizontal: 15,
  },
  reviewTitle: {
    color: '#102A55',
    fontFamily: fontFamilies.heading,
    fontSize: 17,
    marginLeft: 75,
  },
  reviewContent: { padding: 15 },
  summary: {
    backgroundColor: '#162F63',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  summaryTitle: {
    color: '#FFF',
    fontFamily: fontFamilies.heading,
    fontSize: 14,
    marginBottom: 11,
  },
  summaryRow: {
    borderBottomColor: 'rgba(255,255,255,.1)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 42,
    paddingVertical: 10,
  },
  summaryLabel: {
    color: '#B7C2D5',
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 9,
  },
  summaryValue: {
    color: '#FFF',
    flex: 1.5,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 9,
    textAlign: 'right',
  },
  estimate: {
    backgroundColor: '#DCEFE3',
    borderRadius: 8,
    marginBottom: 41,
    marginTop: 20,
    padding: 15,
  },
  estimateLabel: {
    color: '#294764',
    fontFamily: fontFamilies.body,
    fontSize: 11,
  },
  estimateValue: {
    color: '#294764',
    fontFamily: fontFamilies.heading,
    fontSize: 17,
    marginTop: 4,
  },
  reviewFooter: {
    color: '#666',
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginBottom: 1,
    marginTop: 'auto',
    textAlign: 'center',
    width: '100%',
  },
  confirmSafe: { backgroundColor: '#EBFBF0', flex: 1 },
  confirmContent: { flexGrow: 1, paddingBottom: 4 },
  confirmImage: { aspectRatio: 393 / 360, width: '100%' },
  confirmBody: { paddingHorizontal: 15, paddingTop: 8 },
  confirmTitle: {
    color: '#080808',
    fontFamily: fontFamilies.heading,
    fontSize: 30,
    textAlign: 'center',
  },
  confirmSub: {
    color: '#102A55',
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 20,
    marginTop: 4,
    textAlign: 'center',
  },
  confirmCard: {
    backgroundColor: '#FFF',
    borderRadius: 4,
    elevation: 2,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  confirmRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 55,
    paddingHorizontal: 15,
  },
  confirmLabel: {
    color: '#294764',
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 10,
  },
  confirmValue: {
    color: '#102A55',
    flex: 1.3,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
    textAlign: 'right',
  },
  backHome: {
    color: colors.primary,
    fontFamily: fontFamilies.heading,
    fontSize: 14,
    marginTop: 18,
    textAlign: 'center',
  },
  confirmFooter: {
    color: '#666',
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginBottom: 1,
    marginTop: 'auto',
    paddingTop: 24,
    textAlign: 'center',
    width: '100%',
  },
});
