import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrowIcon from '../assets/Svg/BackArrowIcon.svg';
import FuelPumpOutline from '../assets/Svg/FuelPumpOutline.svg';
import { theme } from '../constants/colors';
import { RootStackParamList } from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OrdersHistory'>;
type Filter = 'All' | 'Diesel' | 'Petrol' | 'LPG';

const filters: Filter[] = ['All', 'Diesel', 'Petrol', 'LPG'];
const orders = [
  {id: '#AUTH12345', status: 'Completed'},
  {id: '#AUTH12345', status: 'Delivered'},
  {id: '#AUTH12345', status: 'Delivered'},
];

export default function OrdersHistoryScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>('All');
  const visibleOrders = orders;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.backButton}
        >
          <BackArrowIcon width={21} height={14} />
        </Pressable>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <View style={styles.filters}>
        {filters.map(item => {
          const selected = filter === item;
          return (
            <Pressable
              accessibilityRole="button"
              key={item}
              onPress={() => setFilter(item)}
              style={({ pressed }) => [
                styles.filter,
                selected && styles.filterSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {visibleOrders.map((order, index) => (
          <View key={`${order.id}-${order.status}-${index}`} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>

            <View style={styles.fuelRow}>
              <View style={styles.fuelIcon}>
                <FuelPumpOutline
                  width={20}
                  height={23}
                  color={theme.colors.success}
                />
              </View>
              <Text style={styles.fuelText}>Diesel</Text>
              <View style={styles.separatorDot} />
              <Text style={styles.fuelText}>100 Liters</Text>
            </View>

            <View style={styles.deliveryRow}>
              <Text style={styles.clock}>◷</Text>
              <View style={styles.dateBlock}>
                <Text style={styles.date}>25 May 2025, Tue</Text>
                <Text style={styles.time}>02:00 PM - 04:00 PM</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('ReviewOrder')}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.actionText}>View Details</Text>
            </Pressable>
          </View>
        ))}
        <Text style={styles.footer}>@NeyFuel2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  header: { alignItems: 'center', height: 52, justifyContent: 'center' },
  backButton: { left: 15, position: 'absolute' },
  title: {
    color: theme.colors.navy,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  filters: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  filter: {
    alignItems: 'center',
    backgroundColor: theme.colors.tabInactive,
    borderRadius: 5,
    flex: 1,
    height: 27,
    justifyContent: 'center',
  },
  filterSelected: { backgroundColor: theme.colors.primary },
  filterText: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 10,
  },
  filterTextSelected: { color: theme.colors.white },
  list: { flexGrow: 1, gap: 10, padding: 13, paddingBottom: 8 },
  card: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
  },
  cardHeader: { alignItems: 'center', flexDirection: 'row' },
  orderId: {
    color: theme.colors.navy,
    flex: 1,
    fontFamily: theme.typography.bodyBold,
    fontSize: 12,
  },
  statusPill: {
    backgroundColor: theme.colors.successBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    color: theme.colors.success,
    fontFamily: theme.typography.body,
    fontSize: 8,
  },
  fuelRow: { alignItems: 'center', flexDirection: 'row', marginTop: 11 },
  fuelIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.orderIconBackground,
    borderRadius: 5,
    height: 29,
    justifyContent: 'center',
    width: 31,
  },
  fuelText: {
    color: theme.colors.text,
    fontFamily: theme.typography.body,
    fontSize: 10,
    marginLeft: 13,
  },
  separatorDot: {
    backgroundColor: theme.colors.navy,
    borderRadius: 2,
    height: 3,
    marginLeft: 15,
    width: 3,
  },
  deliveryRow: { alignItems: 'center', flexDirection: 'row', marginTop: 12 },
  clock: { color: theme.colors.text, fontSize: 20, marginLeft: 6, width: 31 },
  dateBlock: { marginLeft: 7 },
  date: {
    color: theme.colors.text,
    fontFamily: theme.typography.body,
    fontSize: 10,
  },
  time: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 7,
    marginTop: 1,
  },
  amount: {
    color: theme.colors.navy,
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
    marginLeft: 'auto',
  },
  action: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    marginTop: 13,
  },
  trackAction: {
    backgroundColor: theme.colors.trackBackground,
    borderColor: theme.colors.trackBackground,
  },
  actionText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
  },
  pressed: { opacity: 0.72 },
  emptyText: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 12,
    paddingTop: 48,
    textAlign: 'center',
  },
  footer: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 9,
    marginTop: 'auto',
    paddingTop: 42,
    textAlign: 'center',
  },
});
