import React, {ReactNode} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../constants/colors';
import {fontFamilies} from '../styles/typography';

type Props = {
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress: () => void;
  rightAccessory?: ReactNode;
};

export default function PrimaryButton({
  disabled = false,
  label,
  loading = false,
  onPress,
  rightAccessory,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  pressed: {opacity: 0.85},
  disabled: {opacity: 0.65},
  label: {
    color: colors.white,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
  },
  labelRow: {alignItems: 'center', justifyContent: 'center', width: '100%'},
  accessory: {position: 'absolute', right: 16},
});
