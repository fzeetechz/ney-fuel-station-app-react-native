import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FuelPumpIcon from '../assets/Svg/fuelpumpIcon.svg';
import {colors} from '../constants/colors';
import {fontFamilies} from '../styles/typography';

type Props = {title: string; description: string; color: string};

export default function FeatureRow({title, description, color}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, {backgroundColor: color}]}>
        <FuelPumpIcon width={25} height={25} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {alignItems: 'center', flexDirection: 'row', marginBottom: 24},
  iconBox: {
    alignItems: 'center',
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    width: 45,
  },
  copy: {flex: 1, marginLeft: 16},
  title: {
    color: colors.text,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
  },
  description: {
    color: colors.muted,
    fontFamily: fontFamilies.body,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
});
