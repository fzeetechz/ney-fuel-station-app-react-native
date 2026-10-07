import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ONBOARDING_STORAGE_KEY} from '../services/onboarding';
import {useAuthStore} from '../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({navigation}: Props) {
  useEffect(() => {
    let isMounted = true;

    const openNextScreen = async () => {
      const [, hasSeenWelcome] = await Promise.all([
        useAuthStore.persist.rehydrate(),
        AsyncStorage.getItem(ONBOARDING_STORAGE_KEY).catch(() => null),
      ]);
      const {accessToken} = useAuthStore.getState();

      setTimeout(() => {
        if (isMounted) {
          navigation.replace(
            accessToken
              ? 'Home'
              : 'Login'
          );
        }
      }, 2200);
    };

    openNextScreen();
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Images/Splash.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#020522', flex: 1},
  image: {height: '100%', resizeMode: 'cover', width: '100%'},
});
