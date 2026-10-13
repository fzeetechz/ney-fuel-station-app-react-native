import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import BackArrowIcon from "../assets/Svg/BackArrowIcon.svg";
import FuelPumpOutline from "../assets/Svg/FuelPumpOutline.svg";
import LocationIcon from "../assets/Svg/LocationIcon.svg";
import UserOutline from "../assets/Svg/UserOutline.svg";
import { theme } from "../constants/colors";
import { RootStackParamList } from "../routes/types";
import BottomTabBar, { TabKey } from "../components/BottomTabBar";

type Props = NativeStackScreenProps<RootStackParamList, "OrdersHistory">;
type Filter = "All" | "Success" | "Failed" | "Pending";
type Order = { id: string; status: Exclude<Filter, "All"> };

const filters: Filter[] = ["All", "Success", "Failed", "Pending"];
const orders: Order[] = [
  { id: "#AUTH12345", status: "Success" },
  { id: "#AUTH12345", status: "Success" },
  { id: "#AUTH12345", status: "Success" },
  { id: "#AUTH12345", status: "Success" },
];

export default function OrdersHistoryScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const visibleOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          (filter === "All" || order.status === filter) &&
          order.id.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [filter, search],
  );


    const onTabPress = (tab: TabKey) => {
      if (tab === "home") {
        navigation.navigate("Home");
      }
      if (tab === "newOrder") {
        navigation.navigate("Order");
      }
      if (tab === "profile") {
        navigation.navigate("Profile");
      }
      if (tab === "wallet") {
        navigation.navigate("Wallet");
      }
    };
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
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
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search transactions"
          onChangeText={setSearch}
          placeholder="Search"
          placeholderTextColor="#A0A0A0"
          style={styles.searchInput}
          value={search}
        />
      </View>

      <View style={styles.filters}>
        {filters.map((item) => {
          const selected = filter === item;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
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
          <View key={`${order.id}-${index}`} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={styles.dateBlock}>
                <Text style={styles.date}>10:30 AM,</Text>
                <Text style={styles.date}>Today</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <UserOutline width={11} height={12} color={theme.colors.navy} />
              <Text style={styles.detailText}>Ahmad Bin Hassan</Text>
            </View>
            <View style={styles.detailRow}>
              <LocationIcon width={11} height={12} color={theme.colors.navy} />
              <Text style={styles.detailText}>
                Jalan Muara Bandar Seri Begawan BB1514
              </Text>
            </View>
            <View style={styles.bottomRow}>
              <View style={styles.fuelInfo}>
                <FuelPumpOutline
                  width={12}
                  height={14}
                  color={theme.colors.navy}
                />
                <Text style={styles.detailText}>Diesel</Text>
                <View style={styles.separatorDot} />
                <Text style={styles.detailText}>100 Liters</Text>
              </View>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        ))}
        {!visibleOrders.length && (
          <Text style={styles.emptyText}>No transactions found</Text>
        )}
      </ScrollView>
            <BottomTabBar activeTab="orders" onTabPress={onTabPress} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.colors.background, flex: 1 },
  header: { alignItems: "center", height: 47, justifyContent: "center" },
  backButton: { left: 15, position: "absolute" },
  title: {
    color: theme.colors.text,
    fontFamily: theme.typography.heading,
    fontSize: 17,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    height: 38,
    marginHorizontal: 13,
    marginTop: 2,
    paddingHorizontal: 10,
  },
  searchIcon: {
    color: "#999",
    fontSize: 22,
    lineHeight: 24,
    marginRight: 8,
    transform: [{ rotate: "-25deg" }],
  },
  searchInput: {
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 11,
    height: "100%",
    padding: 0,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 10,
  },
  filter: {
    alignItems: "center",
    backgroundColor: theme.colors.tabInactive,
    borderRadius: 5,
    flex: 1,
    height: 28,
    justifyContent: "center",
  },
  filterSelected: { backgroundColor: theme.colors.primary },
  filterText: {
    color: "#484848",
    fontFamily: theme.typography.body,
    fontSize: 9,
  },
  filterTextSelected: { color: theme.colors.white },
  list: { gap: 9, paddingHorizontal: 13, paddingBottom: 12 },
  card: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 117,
    justifyContent: "space-between",
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    color: "#111",
    fontFamily: theme.typography.bodyBold,
    fontSize: 11,
  },
  dateBlock: { alignItems: "flex-end", marginTop: -1 },
  date: {
    color: theme.colors.primary,
    fontFamily: theme.typography.body,
    fontSize: 8,
    lineHeight: 9,
  },
  detailRow: { alignItems: "center", flexDirection: "row", gap: 13 },
  detailText: {
    color: "#454545",
    fontFamily: theme.typography.body,
    fontSize: 8,
  },
  bottomRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fuelInfo: { alignItems: "center", flexDirection: "row", gap: 11 },
  separatorDot: {
    backgroundColor: theme.colors.navy,
    borderRadius: 2,
    height: 3,
    marginHorizontal: 1,
    width: 3,
  },
  statusText: {
    color: "#09A629",
    fontFamily: theme.typography.bodyBold,
    fontSize: 10,
  },
  pressed: { opacity: 0.72 },
  emptyText: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 12,
    paddingTop: 48,
    textAlign: "center",
  },
});
