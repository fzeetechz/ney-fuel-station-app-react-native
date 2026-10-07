import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import BellIcon from '../assets/Svg/BellIcon.svg';
import NeyFuelLogo from '../assets/Svg/neyFuellogo.svg';
import WalletIcon from '../assets/Svg/WalletIcon.svg';
import { fontFamilies } from '../styles/typography';

type Props = {
  greeting?: string;
  name: string;
  balance?: string;
  notificationCount?: number;
  onAddMoney?: () => void;
  onNotificationsPress?: () => void;
};

export default function HomeHeader({
  greeting = 'Hello',
  name,
  balance = '$ 2,450',
  notificationCount = 3,
  onAddMoney,
  onNotificationsPress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.welcome}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.logo}>
          <NeyFuelLogo width={40} height={40} />
        </View>
        <Pressable
          accessibilityLabel="Notifications"
          hitSlop={12}
          onPress={onNotificationsPress}
          style={styles.bell}
        >
          <BellIcon width={21} height={27} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.balanceCard}>
        <View pointerEvents="none" style={styles.glassSheen} />
        <View pointerEvents="none" style={styles.glassGlow} />
        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balance}>{balance}</Text>
          </View>
          <WalletIcon width={56} height={50} />
        </View>
        <Pressable
          onPress={onAddMoney}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Text style={styles.addText}>+ Add Money</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#162F63',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    paddingBottom: 16,
    paddingHorizontal: 18,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 75,
    justifyContent: 'center',
    position: 'relative',
  },
  welcome: {
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
  },
  greeting: {
    color: '#FFF',
    fontFamily: fontFamilies.body,
    fontSize: 9,
    lineHeight: 11,
  },
  name: {
    color: '#FFF',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
    lineHeight: 13,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  bell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    position: 'absolute',
    right: 0,
    width: 38,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#E7530D',
    borderRadius: 7,
    height: 14,
    justifyContent: 'center',
    right: 0,
    position: 'absolute',
    top: 6,
    width: 14,
  },
  badgeText: { color: '#FFF', fontFamily: fontFamilies.bodyBold, fontSize: 8 },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderColor: 'rgba(139,180,239,0.6)',
    borderRadius: 9,
    borderWidth: 1,
    minHeight: 136,
    overflow: 'hidden',
    paddingTop: 16,
    shadowColor: '#071B43',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
  glassSheen: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    height: 1,
    left: 10,
    position: 'absolute',
    right: 10,
    top: 0,
  },
  glassGlow: {
    backgroundColor: 'rgba(91,139,209,0.08)',
    borderRadius: 90,
    height: 180,
    position: 'absolute',
    right: -62,
    top: -92,
    width: 180,
  },
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 11,
    paddingHorizontal: 14,
  },
  balanceLabel: {
    color: '#FFF',
    fontFamily: fontFamilies.bodyBold,
    fontSize: 11,
  },
  balance: {
    color: '#FFF',
    fontFamily: fontFamilies.heading,
    fontSize: 30,
    marginTop: 7,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#E7530D',
    height: 38,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
  addText: { color: '#FFF', fontFamily: fontFamilies.bodyBold, fontSize: 12 },
  pressed: { opacity: 0.82 },
});
