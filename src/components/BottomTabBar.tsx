import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/Svg/HomeIcon.svg';
import OrderIcon from '../assets/Svg/OrderIcon.svg';
import OverlayTabIcon from '../assets/Svg/OverlayTabIcon.svg';
import TabProfileIcon from '../assets/Svg/TabProfileIcon.svg';
import TabWalletIcon from '../assets/Svg/TabWalletIcon.svg';
import {theme} from '../constants/colors';

export type TabKey = 'home' | 'orders' | 'newOrder' | 'wallet' | 'profile';
type Props = { activeTab?: TabKey; onTabPress?: (tab: TabKey) => void };

const tabs = [
  { key: 'home' as const, label: 'Home', Icon: HomeIcon },
  { key: 'orders' as const, label: 'Transaction', Icon: OrderIcon },
  // { key: 'newOrder' as const, label: 'New Orders', Icon: OverlayTabIcon },
  // { key: 'wallet' as const, label: 'Wallet', Icon: TabWalletIcon },
  { key: 'profile' as const, label: 'Profile', Icon: TabProfileIcon },
];

export default function BottomTabBar({
  activeTab = 'home',
  onTabPress,
}: Props) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: bottom }]}>
      <View style={styles.bar}>
        {tabs.map(({ key, label, Icon }) => {
          const active = key === activeTab;
          const center = key === 'newOrder';
          return (
            <Pressable
              key={key}
              onPress={() => onTabPress?.(key)}
              style={[styles.tab, center && styles.centerTab]}
            >
              {center ? (
                <View style={styles.centerButton}>
                  <Icon width={32} height={46} />
                </View>
              ) : (
                <Icon
                  width={27}
                  height={27}
                  color={active ? theme.colors.primary : theme.colors.white}
                />
              )}
              <Text style={[styles.label, active && styles.activeLabel]}>
                {label}
              </Text>
              {active && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {backgroundColor: theme.colors.white},
  bar: {
    backgroundColor: theme.colors.navyDark,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: 'row',
    height: 76,
  },
  tab: { alignItems: 'center', flex: 1, gap: 5, justifyContent: 'center' },
  centerTab: { paddingTop: 17 },
  centerButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 34,
    borderWidth: 3,
    height: 68,
    justifyContent: 'center',
    position: 'absolute',
    top: -29,
    width: 68,
  },
  label: {color: theme.colors.white, fontFamily: theme.typography.body, fontSize: 9},
  activeLabel: {color: theme.colors.primary},
  indicator: {
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    bottom: 0,
    height: 4,
    position: 'absolute',
    width: 60,
  },
});
