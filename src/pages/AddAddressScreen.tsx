import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountryItem, CountryPicker } from 'react-native-country-codes-picker';
import Toast from 'react-native-toast-message';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import AddressMapPicker, {
  SelectedMapAddress,
} from '../components/AddressMapPicker';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../routes/types';
import { createAddress, updateAddress } from '../services/addressServices';
import { getApiErrorMessage } from '../services/auth';
import { fontFamilies } from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'AddAddress'>;
type FormKey =
  | 'recipient'
  | 'phone'
  | 'line1'
  | 'city'
  | 'postalCode'
  | 'country';

const india: CountryItem = {
  code: 'IN',
  dial_code: '+91',
  flag: '🇮🇳',
  name: { en: 'India' },
};

const addressLabels = ['Home', 'Office', 'Other'] as const;

export default function AddAddressScreen({ navigation, route }: Props) {
  const existing = route.params?.address;
  const [countryCode, setCountryCode] = useState<CountryItem>(india);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<FormKey | 'location', string>>
  >({});
  const [form, setForm] = useState({
    label:
      addressLabels.find(
        option => option.toLowerCase() === existing?.label?.toLowerCase(),
      ) ?? 'Home',
    recipient: existing?.recipient ?? '',
    phone: existing?.phone?.startsWith(india.dial_code)
      ? existing.phone.slice(india.dial_code.length).replace(/\D/g, '')
      : existing?.phone?.replace(/\D/g, '') ?? '',
    line1: existing?.line1 ?? '',
    city: existing?.city ?? '',
    postalCode: existing?.postalCode ?? '',
    country: existing?.country ?? 'BN',
    latitude: existing?.latitude,
    longitude: existing?.longitude,
  });

  const setValue = (key: FormKey, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors(current => ({ ...current, [key]: undefined }));
    }
  };

  const applyMapAddress = (address: SelectedMapAddress) => {
    setForm(current => ({
      ...current,
      latitude: address.latitude,
      longitude: address.longitude,
      line1: address.line1 || current.line1,
      city: address.city || current.city,
      postalCode: address.postalCode || current.postalCode,
      country: address.country || current.country,
    }));
    setErrors(current => ({ ...current, location: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.recipient.trim()) next.recipient = 'Recipient name is required.';
    if (
      form.phone.length < 6 ||
      `${countryCode.dial_code}${form.phone}`.replace(/\D/g, '').length > 15
    )
      next.phone = 'Enter a valid phone number.';
    if (!form.line1.trim()) next.line1 = 'Street address is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.postalCode.trim()) next.postalCode = 'Postal code is required.';
    if (!form.country.trim() || form.country.trim().length !== 2)
      next.country = 'Use a 2-letter country code.';
    if (form.latitude == null || form.longitude == null)
      next.location = 'Select a location on the map.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    const payload = {
      label: form.label.trim(),
      recipient: form.recipient.trim(),
      phone: `${countryCode.dial_code}${form.phone}`,
      line1: form.line1.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim().toUpperCase(),
      latitude: form.latitude!,
      longitude: form.longitude!,
    };
    try {
      setIsSaving(true);
      const response = existing
        ? await updateAddress(existing._id, payload)
        : await createAddress(payload);
      Toast.show({
        type: 'success',
        text1:
          response.message ||
          `Address ${existing ? 'updated' : 'added'} successfully.`,
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: 'error', text1: getApiErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const field = (
    label: string,
    key: FormKey,
    options?: {
      placeholder?: string;
      keyboardType?: 'default' | 'phone-pad';
      autoCapitalize?: 'none' | 'characters' | 'words';
    },
  ) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.required}> *</Text>
      </Text>
      <TextInput
        autoCapitalize={options?.autoCapitalize}
        keyboardType={options?.keyboardType}
        onChangeText={value => setValue(key, value)}
        placeholder={options?.placeholder}
        placeholderTextColor="#999999"
        style={[styles.input, errors[key] && styles.inputError]}
        value={form[key]}
      />
      {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />
      <View style={styles.header}>
        <Pressable
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.backButton}
        >
          <BackArrowIcon width={24} height={15} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {existing ? 'Edit Address' : 'Add Address'}
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.flex}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          contentContainerStyle={styles.content}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.title}>
              {existing
                ? 'Update delivery details'
                : 'Where should we deliver?'}
            </Text>
            <Text style={styles.subtitle}>
              Choose the exact spot and complete the address below.
            </Text>
          </View>
          <AddressMapPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onAddressChange={applyMapAddress}
          />
          {errors.location ? (
            <Text style={styles.locationError}>{errors.location}</Text>
          ) : null}

          <View style={styles.formCard}>
            <View
              accessibilityLabel="Address type"
              accessibilityRole="radiogroup"
              style={styles.addressLabelOptions}
            >
              {addressLabels.map(option => {
                const selected = form.label === option;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{checked: selected}}
                    key={option}
                    onPress={() =>
                      setForm(current => ({...current, label: option}))
                    }
                    style={({pressed}) => [
                      styles.addressLabelOption,
                      selected && styles.addressLabelOptionSelected,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterSelected,
                      ]}
                    >
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.addressLabelText,
                        selected && styles.addressLabelTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {field('Recipient name', 'recipient', {
              placeholder: 'Full name',
              autoCapitalize: 'words',
            })}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Phone number<Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.phoneRow}>
                <Pressable
                  onPress={() => setShowCountryPicker(true)}
                  style={styles.countrySelector}
                >
                  <Text style={styles.flag}>{countryCode.flag}</Text>
                  <Text style={styles.chevron}>⌄</Text>
                </Pressable>
                <View
                  style={[
                    styles.phoneInputRow,
                    errors.phone && styles.inputError,
                  ]}
                >
                  <Text style={styles.dialCode}>{countryCode.dial_code}</Text>
                  <View style={styles.divider} />
                  <TextInput
                    keyboardType="phone-pad"
                    maxLength={15}
                    onChangeText={value =>
                      setValue('phone', value.replace(/\D/g, ''))
                    }
                    placeholder="712 3456"
                    placeholderTextColor="#999999"
                    style={styles.phoneInput}
                    value={form.phone}
                  />
                </View>
              </View>
              {errors.phone ? (
                <Text style={styles.error}>{errors.phone}</Text>
              ) : null}
            </View>
            {field('Address line', 'line1', {
              placeholder: 'Unit, building and street',
            })}
            <View style={styles.twoColumns}>
              <View style={styles.column}>
                {field('City', 'city', {
                  placeholder: 'City',
                  autoCapitalize: 'words',
                })}
              </View>
              <View style={styles.column}>
                {field('Postal code', 'postalCode', {
                  placeholder: 'Postal code',
                  autoCapitalize: 'characters',
                })}
              </View>
            </View>
            {field('Country code', 'country', {
              placeholder: 'BN',
              autoCapitalize: 'characters',
            })}
          </View>
          <Pressable
            disabled={isSaving}
            onPress={save}
            style={({ pressed }) => [
              styles.saveButton,
              (pressed || isSaving) && styles.buttonPressed,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveLabel}>
                {existing ? 'Update Address' : 'Save Address'}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <CountryPicker
        initialState=""
        inputPlaceholder="Search by country name or code"
        lang="en"
        onBackdropPress={() => setShowCountryPicker(false)}
        onRequestClose={() => setShowCountryPicker(false)}
        pickerButtonOnPress={item => {
          setCountryCode(item);
          setForm(current => ({ ...current, country: item.code }));
          setShowCountryPicker(false);
        }}
        show={showCountryPicker}
        style={countryPickerStyles}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.navyDark, flex: 1 },
  flex: { backgroundColor: '#F6F7F9', flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    height: 54,
    justifyContent: 'center',
  },
  backButton: { left: 16, position: 'absolute' },
  headerTitle: {
    color: colors.white,
    fontFamily: fontFamilies.heading,
    fontSize: 17,
  },
  content: { paddingBottom: 140, paddingHorizontal: 16, paddingTop: 18 },
  intro: { marginBottom: 16 },
  title: { color: colors.navy, fontFamily: fontFamilies.heading, fontSize: 21 },
  subtitle: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 12,
    marginTop: 5,
  },
  locationError: {
    color: '#C9372C',
    fontFamily: fontFamilies.body,
    fontSize: 10,
    marginTop: 5,
  },
  formCard: {
    backgroundColor: colors.white,
    borderColor: '#E8E9ED',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 17,
    padding: 14,
  },
  fieldWrap: { marginBottom: 14 },
  addressLabelOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  addressLabelOption: {
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
  },
  addressLabelOptionSelected: {
    backgroundColor: '#FFF4EE',
    borderColor: colors.primary,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: '#A1A5AD',
    borderRadius: 7,
    borderWidth: 1.5,
    height: 14,
    justifyContent: 'center',
    marginRight: 7,
    width: 14,
  },
  radioOuterSelected: {borderColor: colors.primary},
  radioInner: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  addressLabelText: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 12,
  },
  addressLabelTextSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.bodyBold,
  },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
    marginBottom: 7,
  },
  required: { color: colors.primary },
  input: {
    backgroundColor: '#FAFAFB',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    height: 46,
    paddingHorizontal: 12,
  },
  inputError: { borderColor: '#C9372C' },
  error: {
    color: '#C9372C',
    fontFamily: fontFamilies.body,
    fontSize: 10,
    marginTop: 4,
  },
  phoneRow: { flexDirection: 'row', gap: 8 },
  countrySelector: {
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 46,
    justifyContent: 'center',
    width: 64,
  },
  flag: { fontSize: 20 },
  chevron: { color: colors.muted, fontSize: 14, marginLeft: 5 },
  phoneInputRow: {
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  dialCode: {
    color: colors.text,
    fontFamily: fontFamilies.body,
    fontSize: 12,
    paddingHorizontal: 10,
  },
  divider: { backgroundColor: colors.border, height: 25, width: 1 },
  phoneInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    paddingHorizontal: 11,
  },
  twoColumns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1 },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 9,
    height: 51,
    justifyContent: 'center',
    marginTop: 18,
  },
  saveLabel: {
    color: colors.white,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 14,
  },
  buttonPressed: { opacity: 0.7 },
});

const countryPickerStyles = {
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: '78%' as const,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 9,
    color: colors.text,
    fontFamily: fontFamilies.body,
    height: 48,
    paddingHorizontal: 14,
  },
  line: { backgroundColor: 'transparent' },
  countryButtonStyles: {
    backgroundColor: '#F5F5F5',
    borderRadius: 9,
    height: 48,
    marginVertical: 2,
    paddingHorizontal: 14,
  },
  flag: { fontSize: 19 },
  dialCode: { color: colors.text, fontFamily: fontFamilies.body, fontSize: 13 },
  countryName: {
    color: colors.text,
    fontFamily: fontFamilies.body,
    fontSize: 13,
  },
  searchMessageText: { color: colors.muted, fontFamily: fontFamilies.body },
};
