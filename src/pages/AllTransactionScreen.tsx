import React, { useState } from 'react';
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
import TabWalletIcon from '../assets/Svg/TabWalletIcon.svg';
import { theme } from '../constants/colors';
import { RootStackParamList } from '../routes/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AllTransactions'>;
type Filter = 'All' | 'Add Money' | 'Money Out';
type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  group: 'Today' | 'Yesterday';
};

const filters: Filter[] = ['All', 'Add Money', 'Money Out'];
const transactions: Transaction[] = [
  { id: 'today-credit', type: 'credit', group: 'Today' },
  { id: 'today-debit', type: 'debit', group: 'Today' },
  { id: 'yesterday-credit-1', type: 'credit', group: 'Yesterday' },
  { id: 'yesterday-debit-1', type: 'debit', group: 'Yesterday' },
  { id: 'yesterday-credit-2', type: 'credit', group: 'Yesterday' },
  { id: 'yesterday-debit-2', type: 'debit', group: 'Yesterday' },
  { id: 'yesterday-credit-3', type: 'credit', group: 'Yesterday' },
  { id: 'yesterday-debit-3', type: 'debit', group: 'Yesterday' },
];

export default function AllTransactionScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>('All');
  const visibleTransactions = transactions.filter(item => {
    if (filter === 'All') return true;
    return filter === 'Add Money'
      ? item.type === 'credit'
      : item.type === 'debit';
  });

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
          <BackArrowIcon width={21} height={14} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.title}>Transaction History</Text>
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
        {(['Today', 'Yesterday'] as const).map(group => {
          const groupItems = visibleTransactions.filter(
            item => item.group === group,
          );
          if (!groupItems.length) return null;
          return (
            <View key={group} style={styles.group}>
              <Text style={styles.groupTitle}>{group}</Text>
              {groupItems.map(item => (
                <TransactionRow key={item.id} transaction={item} />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const credit = transaction.type === 'credit';
  return (
    <View style={styles.transactionCard}>
      <View style={[styles.iconCircle, !credit && styles.debitIconCircle]}>
        {credit ? (
          <TabWalletIcon width={18} height={17} color={theme.colors.muted} />
        ) : (
          <FuelPumpOutline width={16} height={19} color={theme.colors.debit} />
        )}
      </View>
      <View style={styles.transactionCopy}>
        <Text style={styles.transactionTitle}>
          {credit ? 'Added to wallet' : 'Fuel Order Payment'}
        </Text>
        <Text style={styles.transactionDetail}>
          {credit ? 'Via Card' : 'Order #ORD123456'}
        </Text>
      </View>
      <View style={styles.amountCopy}>
        <Text style={[styles.amount, !credit && styles.debitAmount]}>
          {credit ? 'BND 136.00' : '- BND 136.00'}
        </Text>
        <Text style={styles.time}>{credit ? '10:30 AM' : '10:20 AM'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  header: { alignItems: 'center', height: 52, justifyContent: 'center' },
  backButton: { left: 15, position: 'absolute' },
  title: {
    color: theme.colors.text,
    fontFamily: theme.typography.heading,
    fontSize: 17,
  },
  filters: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 15,
    paddingBottom: 12,
    paddingTop: 5,
  },
  filter: {
    alignItems: 'center',
    backgroundColor: theme.colors.tabInactive,
    borderRadius: 4,
    height: 27,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  filterSelected: { backgroundColor: theme.colors.primary },
  filterText: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 10,
  },
  filterTextSelected: { color: theme.colors.white },
  list: { paddingBottom: 18, paddingHorizontal: 15 },
  group: { marginTop: 5 },
  groupTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.heading,
    fontSize: 14,
    marginBottom: 7,
  },
  transactionCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    marginBottom: 7,
    paddingHorizontal: 7,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.transactionIcon,
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  debitIconCircle: { backgroundColor: theme.colors.transactionDebitIcon },
  transactionCopy: { flex: 1, marginLeft: 9 },
  transactionTitle: {
    color: theme.colors.navy,
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
  },
  transactionDetail: {
    color: theme.colors.text,
    fontFamily: theme.typography.body,
    fontSize: 9,
    marginTop: 5,
  },
  amountCopy: { alignItems: 'flex-end' },
  amount: {
    color: theme.colors.success,
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
  },
  debitAmount: { color: theme.colors.debit },
  time: {
    color: theme.colors.text,
    fontFamily: theme.typography.body,
    fontSize: 9,
    marginTop: 7,
  },
  pressed: { opacity: 0.72 },
});
