import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import {colors} from '../constants/colors';
import {RootStackParamList} from '../routes/types';
import {fontFamilies} from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export default function SuccessScreen({navigation}: Props) {
  return (
    <ImageBackground
      source={require('../assets/Images/SuccesWholeScreenimg.png')}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.bottomArea}>
          <PrimaryButton
            label="Go to Home"
            onPress={() => navigation.navigate('Home')}
          />
          <Text style={styles.footer}>@NeyFuel{new Date().getFullYear()}</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {flex: 1},
  safeArea: {flex: 1},
  bottomArea: {marginTop: 'auto', paddingHorizontal: 18},
  footer: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginBottom: 3,
    marginTop: 12,
    textAlign: 'center',
  },
});
