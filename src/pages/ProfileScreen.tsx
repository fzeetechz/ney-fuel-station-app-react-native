import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ImagePicker from 'react-native-image-crop-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import CallIcon from '../assets/Svg/CallIcon.svg';
import CamerIcon from '../assets/Svg/CamerIcon.svg';
import ChevronRightIcon from '../assets/Svg/ChevronRightIcon.svg';
import HelpSupportIcon from '../assets/Svg/helpSupportIcon.svg';
import LocationIcon from '../assets/Svg/LocationIcon.svg';
import LogoutIcon from '../assets/Svg/LogoutIcon.svg';
import PaymentIcon from '../assets/Svg/PaymentIcon.svg';
import ProfileHeaderBackground from '../assets/Svg/ProfileHeaderBackground.svg';
import ProfileIcon from '../assets/Svg/ProfileIcon.svg';
import {colors} from '../constants/colors';
import {RootStackParamList} from '../routes/types';
import {useAuthStore} from '../store/authStore';
import {fontFamilies} from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const defaultProfileImage = require('../assets/Images/welcomeTopimage.png');

const profileRows = [
  {label: 'Personal Information', Icon: ProfileIcon},
  {label: 'Contact Information', Icon: CallIcon},
  {label: 'Delivery Address', Icon: LocationIcon},
  {label: 'Payment Methods', Icon: PaymentIcon},
  {label: 'Help & Support', Icon: HelpSupportIcon},
  {label: 'Logout', Icon: LogoutIcon},
];

export default function ProfileScreen({navigation}: Props) {
  const clearAuth = useAuthStore(state => state.clearAuth);
  const [profileImage, setProfileImage] =
    useState<ImageSourcePropType>(defaultProfileImage);

  const handleRowPress = async (label: string) => {
    if (label === 'Delivery Address') {
      navigation.navigate('MyAddress');
      return;
    }

    if (label === 'Logout') {
      await clearAuth();
      navigation.reset({index: 0, routes: [{name: 'Login'}]});
    }
  };

  const updateProfileImage = async (source: 'camera' | 'gallery') => {
    try {
      const image =
        source === 'camera'
          ? await ImagePicker.openCamera({
              width: 600,
              height: 600,
              cropping: true,
              cropperCircleOverlay: true,
              mediaType: 'photo',
              compressImageQuality: 0.85,
            })
          : await ImagePicker.openPicker({
              width: 600,
              height: 600,
              cropping: true,
              cropperCircleOverlay: true,
              mediaType: 'photo',
              compressImageQuality: 0.85,
            });

      setProfileImage({uri: image.path});
    } catch (error) {
      const pickerError = error as {code?: string};
      if (pickerError.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(
          'Unable to update photo',
          'Please allow camera and photo access, then try again.',
        );
      }
    }
  };

  const showPhotoOptions = () => {
    Alert.alert('Change profile picture', 'Choose a photo source', [
      {text: 'Take Photo', onPress: () => updateProfileImage('camera')},
      {
        text: 'Choose from Gallery',
        onPress: () => updateProfileImage('gallery'),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.backButton}>
          <BackArrowIcon width={24} height={15} />
        </Pressable>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileHero}>
          <ProfileHeaderBackground width="100%" height={98} />
          <View style={styles.avatarWrap}>
            <Image source={profileImage} style={styles.avatar} />
            <Pressable
              accessibilityLabel="Change profile picture"
              accessibilityRole="button"
              hitSlop={8}
              onPress={showPhotoOptions}
              style={styles.cameraButton}>
              <CamerIcon width={14} height={11} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.card}>
          {profileRows.map(({label, Icon}, index) => (
            <Pressable
              accessibilityRole="button"
              key={label}
              onPress={() => handleRowPress(label)}
              style={({pressed}) => [
                styles.row,
                index < profileRows.length - 1 && styles.rowBorder,
                pressed && styles.rowPressed,
              ]}>
              <View style={styles.rowIcon}>
                <Icon width={20} height={20} />
              </View>
              <Text
                style={[
                  styles.rowLabel,
                  label === 'Logout' && styles.logoutLabel,
                ]}>
                {label}
              </Text>
              <ChevronRightIcon width={8} height={12} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>@NeyFuel{new Date().getFullYear()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: colors.background, flex: 1},
  header: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {left: 16, position: 'absolute'},
  headerTitle: {
    color: '#0A0A0A',
    fontFamily: fontFamilies.heading,
    fontSize: 17,
  },
  content: {flexGrow: 1, paddingBottom: 8, paddingHorizontal: 16},
  profileHero: {height: 116, marginTop: 6},
  avatarWrap: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 45,
    borderWidth: 2,
    height: 90,
    marginTop: -63,
    width: 90,
  },
  avatar: {borderRadius: 43, height: 86, resizeMode: 'cover', width: 86},
  cameraButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#D8D8D8',
    borderRadius: 13,
    borderWidth: 1,
    bottom: 1,
    height: 25,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    width: 25,
  },
  sectionTitle: {
    color: '#111111',
    fontFamily: fontFamilies.heading,
    fontSize: 17,
    marginBottom: 10,
    marginTop: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 14,
  },
  rowBorder: {borderBottomColor: '#E8E8E8', borderBottomWidth: 1},
  rowPressed: {backgroundColor: '#F6F6F6'},
  rowIcon: {alignItems: 'center', marginRight: 12, width: 20},
  rowLabel: {
    color: colors.muted,
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 13,
  },
  logoutLabel: {color: colors.primary},
  footer: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginTop: 'auto',
    paddingTop: 30,
    textAlign: 'center',
  },
});
