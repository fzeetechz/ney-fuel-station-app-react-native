import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import FuelFillHandle from '../assets/Svg/fuelfillhandle.svg';
import NeyFuelLogo from '../assets/Svg/neyFuellogo.svg';
import SecureIcon from '../assets/Svg/secureicon.svg';
import PrimaryButton from '../components/PrimaryButton';
import {colors} from '../constants/colors';
import {RootStackParamList} from '../routes/types';
import {fontFamilies} from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <NeyFuelLogo width={76} height={62} />
          </View>
          {/* <FuelFillHandle width={113} height={156} style={styles.handle} /> */}
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to Continue</Text>

          <Text style={styles.label}>Enter Email</Text>
          <TextInput
            accessibilityLabel="Username or email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setUsername}
            placeholder="employee@gmail.com"
            placeholderTextColor="#888888"
            style={styles.textInput}
            value={username}
          />

          <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
          <View style={styles.passwordInputRow}>
            <TextInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#888888"
              secureTextEntry={!passwordVisible}
              style={styles.passwordInput}
              value={password}
            />
            <Pressable
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => setPasswordVisible(visible => !visible)}
              style={styles.visibilityButton}>
              <Text style={styles.visibilityIcon}>{passwordVisible ? '◉' : '⊘'}</Text>
            </Pressable>
          </View>

          <View style={styles.buttonWrap}>
            <PrimaryButton
              label="Login"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </View>

        <View style={styles.bottomArea}>
          {/* <View style={styles.security}>
            <SecureIcon width={25} height={29} />
            <View style={styles.securityCopy}>
              <Text style={styles.secureTitle}>Your data is 100% Secure</Text>
              <Text style={styles.secureText}>
                We never share your information
              </Text>
            </View>
          </View> */}
          <Text style={styles.footer}>@NeyFuel{new Date().getFullYear()}</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  container: {flex: 1, paddingHorizontal: 14},
  brandRow: {height: 132, paddingTop: 17},
  logoCircle: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 52,
    height: 98,
    justifyContent: 'center',
    width: 98,
  },
  handle: {position: 'absolute', right: -15, top: 0},
  form: {marginTop: 7},
  heading: {
    color: colors.text,
    fontFamily: fontFamilies.heading,
    fontSize: 25,
    lineHeight: 31,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    marginTop: 5,
  },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
    marginBottom: 5,
    marginTop: 27,
  },
  passwordLabel: {marginTop: 22},
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fontFamilies.body,
    fontSize: 12,
    height: 37,
    paddingHorizontal: 12,
  },
  passwordInputRow: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    height: 37,
  },
  passwordInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 12,
    paddingHorizontal: 12,
  },
  visibilityButton: {paddingHorizontal: 11, paddingVertical: 7},
  visibilityIcon: {color: colors.muted, fontSize: 16},
  buttonWrap: {marginTop: 32},
  bottomArea: {alignItems: 'center', marginTop: 'auto'},
  security: {alignItems: 'center', flexDirection: 'row'},
  securityCopy: {marginLeft: 8},
  secureTitle: {
    color: colors.text,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 11,
  },
  secureText: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginTop: 3,
  },
  footer: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginBottom: 8,
    marginTop: 17,
    textAlign: 'center',
  },
});
  