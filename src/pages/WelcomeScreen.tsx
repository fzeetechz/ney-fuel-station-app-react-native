import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import FeatureRow from '../components/FeatureRow';
import PrimaryButton from '../components/PrimaryButton';
import {colors} from '../constants/colors';
import {RootStackParamList} from '../routes/types';
import {fontFamilies} from '../styles/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ONBOARDING_STORAGE_KEY} from '../services/onboarding';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({navigation}: Props) {
  const finishOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true').catch(() => {});
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('../assets/Images/welcomeTopimage.png')}
          style={styles.hero}
        />
        <Text style={styles.heading}>
          Energy Delivered,{`\n`}
          <Text style={styles.orange}>Powering</Text> Lives
        </Text>
        <Text style={styles.subtitle}>
          Fast, reliable and secure fuel{`\n`}delivery at your fingertips
        </Text>
        <View style={styles.features}>
          <FeatureRow
            color={colors.primary}
            title="Order Fuel"
            description="Get fuel delivered to your location, when you need it."
          />
          <FeatureRow
            color={colors.navy}
            title="Secure & Reliable"
            description="Safe payment, real-time tracking and dedicated support."
          />
        </View>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.bottom}>
          <PrimaryButton
            label="Get started"
            onPress={finishOnboarding}
          />
          <Text style={styles.footer}>@NeyFuel{new Date().getFullYear()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.white, flex: 1},
  content: {flexGrow: 1, paddingBottom: 12, paddingHorizontal: 20},
  hero: {height: 258, marginTop: 8, resizeMode: 'contain', width: '100%'},
  heading: {
    color: colors.text,
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    lineHeight: 33,
    marginTop: 12,
  },
  orange: {color: colors.primary, fontFamily: fontFamilies.heading},
  subtitle: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 12,
  },
  features: {marginTop: 24},
  dots: {flexDirection: 'row', justifyContent: 'center', marginVertical: 8},
  dot: {
    backgroundColor: colors.dot,
    borderRadius: 4,
    height: 7,
    marginHorizontal: 5,
    width: 7,
  },
  activeDot: {backgroundColor: colors.primary},
  bottom: {marginTop: 'auto', paddingTop: 24},
  footer: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginTop: 14,
    textAlign: 'center',
  },
});
