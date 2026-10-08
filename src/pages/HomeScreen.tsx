import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import InventoryIcon from "../assets/Svg/InventoryIcon.svg";
import NFCCardIcon from "../assets/Svg/NFCCardIcon.svg";
import PrintRecIcon from "../assets/Svg/PrintRecIcon.svg";
import QR from "../assets/Svg/QR.svg";
import Setting from "../assets/Svg/Setting.svg";
import FuelPumpOutline from "../assets/Svg/FuelPumpOutline.svg";
import GasIcon from "../assets/Svg/GasIcon.svg";
import BottomTabBar, { TabKey } from "../components/BottomTabBar";
import HomeHeader from "../components/HomeHeader";
import { colors } from "../constants/colors";
import { RootStackParamList } from "../routes/types";
import { fontFamilies } from "../styles/typography";
import { DashboardData, getDashboard } from "../services/dashboardService";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const quickOptions = [
  { label: "Scan QR", Icon: QR },
  { label: "Read NFC", Icon: NFCCardIcon },
  { label: "Transaction", Icon: PrintRecIcon },
  { label: "Inventory", Icon: InventoryIcon },
  { label: "Print Receipt", Icon: PrintRecIcon },
  { label: "Settings", Icon: Setting },
];
const fuelColors: Record<string, string> = {
  DIESEL: "#17B32A",
  PETROL: "#E65A18",
  LPG: "#172B73",
};

const formatMoney = (amountMinor: number, currency: string) =>
  `${currency} ${(amountMinor / 100).toFixed(2)}`;

const formatOrderDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return `${parsedDate.toLocaleDateString()} . ${parsedDate.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  )}`;
};

const formatQuantity = (quantityMl: number) => {
  const litres = quantityMl / 1000;
  return `${Number.isInteger(litres) ? litres : litres.toFixed(1)} Ltrs`;
};

const formatStatus = (status: string) =>
  status.toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());

export default function HomeScreen({ navigation }: Props) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboard = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      const response = await getDashboard();
      if (response.success) setDashboard(response.data);
    } catch (error) {
      console.warn("Unable to load dashboard data", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onTabPress = (tab: TabKey) => {
    if (tab === "orders") {
      navigation.navigate("OrdersHistory");
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

  const staticPrices = [
    {
      _id: "static-diesel",
      code: "DIESEL",
      name: "Diesel",
      priceMinor: "1.36",
    },
    {
      _id: "static-petrol",
      code: "PETROL",
      name: "Petrol",
      priceMinor: "1.55",
    },
    {
      _id: "static-lpg",
      code: "LPG",
      name: "LPG (Cooking Gas)",
      priceMinor: "0.36",
    },
  ];

  const staticOrders = [
    {
      _id: "#ORD123",
      fuelName: "Diesel",
      quantityMl: 200000,
      createdAt: new Date().toISOString(),
      status: "DELIVERED",
    },
    {
      _id: "#ORD124",
      fuelName: "Diesel",
      quantityMl: 200000,
      createdAt: new Date().toISOString(),
      status: "PENDING",
    },
  ];
  return (
    <>
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} translucent={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={() => loadDashboard(true)}
            refreshing={isRefreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          name={dashboard?.user.name ?? "Kevin Piter"}
          notificationCount={dashboard?.unreadNotifications ?? 0}
        />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Quick Option</Text>
            <Text style={styles.viewAll}>View ALL</Text>
          </View>
          <View style={styles.quickGrid}>
            {quickOptions.map(({ label, Icon }) => (
              <Pressable
                key={label}
                onPress={() => {
                  if (label === "New Order") navigation.navigate("Order");
                  if (label === "My Orders")
                    navigation.navigate("OrdersHistory");
                  if (label === "Profile") navigation.navigate("Profile");
                  if (label === "Wallet") navigation.navigate("Wallet");
                }}
                style={({ pressed }) => [
                  styles.quickCard,
                  pressed && styles.pressed,
                ]}
              >
                <Icon
                  width={label === "Support" ? 34 : 28}
                  height={label === "Support" ? 34 : 30}
                  color={colors.primary}
                />
                <Text style={styles.quickLabel}>{label}</Text>
              </Pressable>
            ))}
          </View>
          {false && (
            <>
              {/* <View style={styles.carousel}>
            <BannerCarousel
              images={[
                require('../assets/Images/banner-image1.png'),
                require('../assets/Images/banner-image2.png'),
              ]}
            />
          </View>  */}
              <View style={styles.titleRow}>
                <Text style={styles.sectionTitle}>Fuel Price Today</Text>
                <Text style={styles.unit}>BND/ Litre</Text>
              </View>
              <View style={styles.priceList}>
                {(dashboard?.fuels ?? staticPrices).map((item) => (
                  <View key={item._id} style={styles.priceCard}>
                    {item.code === "LPG" ? (
                      <GasIcon width={15} height={29} />
                    ) : (
                      <FuelPumpOutline
                        width={24}
                        height={28}
                        color={fuelColors[item.code] ?? colors.primary}
                      />
                    )}
                    <Text style={styles.priceLabel}>{item.name}</Text>
                    <Text style={styles.price}>{item.priceMinor}</Text>
                    <View
                      style={[
                        styles.priceDot,
                        {
                          backgroundColor:
                            fuelColors[item.code] ?? colors.primary,
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
              <View style={[styles.titleRow, styles.orderHeading]}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <Text style={styles.viewAll}>View ALL</Text>
              </View>
              {(dashboard?.recentOrders ?? staticOrders).map((order) => (
                <View key={order._id} style={styles.orderCard}>
                  <FuelPumpOutline width={29} height={33} color="#17B32A" />
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>{order._id}</Text>
                    <Text style={styles.orderDetail}>
                      {order.fuelName} . {formatQuantity(order.quantityMl)}
                    </Text>
                    <Text style={styles.orderDate}>
                      {formatOrderDate(order.createdAt)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.delivered,
                      order.status !== "DELIVERED" && styles.deliveredOutline,
                    ]}
                  >
                    <Text
                      style={[
                        styles.deliveredText,
                        order.status !== "DELIVERED" &&
                          styles.deliveredOutlineText,
                      ]}
                    >
                      {formatStatus(order.status)}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
      <BottomTabBar activeTab="home" onTabPress={onTabPress} />
    </SafeAreaView>
  </>);
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F4F6FB", flex: 1 },
  scrollContent: { backgroundColor: "#F4F6FB", paddingBottom: 12 },
  body: { paddingHorizontal: 13 },
  availableBalanceCard: {
    backgroundColor: "#F5F6F7",
    borderColor: "#E6E6E6",
    borderRadius: 6,
    borderWidth: 1,
    elevation: 2,
    marginTop: 16,
    padding: 12,
    shadowColor: "#0B2448",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  availableBalanceTitle: {
    color: "#101010",
    fontFamily: fontFamilies.heading,
    fontSize: 14,
  },
  availableBalanceAmount: {
    color: "#17A52B",
    fontFamily: fontFamilies.heading,
    fontSize: 29,
    marginTop: 10,
  },
  limitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  availableLimit: { alignItems: "flex-end" },
  limitLabel: {
    color: "#171717",
    fontFamily: fontFamilies.body,
    fontSize: 12,
  },
  limitAmount: {
    color: "#171717",
    fontFamily: fontFamilies.bodyBold,
    fontSize: 12,
    marginTop: 7,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },
  sectionTitle: {
    color: "#101010",
    fontFamily: fontFamilies.heading,
    fontSize: 16,
  },
  viewAll: {
    color: colors.primary,
    fontFamily: fontFamilies.bodyBold,
    fontSize: 10,
  },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 20 },
  quickCard: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderColor: "#E5E5E5",
    borderRadius: 6,
    borderWidth: 1,
    elevation: 2,
    height: 80,
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 14,
    shadowColor: "#0B2448",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    width: "31.7%",
  },
  quickLabel: { color: "#102A55", fontFamily: fontFamilies.body, fontSize: 12 },
  pressed: { opacity: 0.75 },
  carousel: { marginTop: 14 },
  unit: { color: "#676767", fontFamily: fontFamilies.bodyBold, fontSize: 10 },
  priceList: { gap: 4, marginTop: 9 },
  priceCard: {
    alignItems: "center",
    borderColor: "#E7E7E7",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    height: 49,
    paddingHorizontal: 13,
  },
  priceLabel: {
    color: "#102A55",
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    marginLeft: 12,
  },
  price: { color: "#102A55", fontFamily: fontFamilies.bodyBold, fontSize: 13 },
  priceDot: { borderRadius: 6, height: 11, marginLeft: 10, width: 11 },
  orderHeading: { marginBottom: 10, marginTop: 18 },
  orderCard: {
    alignItems: "center",
    borderColor: "#E7E7E7",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 7,
    minHeight: 79,
    paddingHorizontal: 14,
  },
  orderInfo: { flex: 1, marginLeft: 15 },
  orderId: {
    color: "#102A55",
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13,
  },
  orderDetail: {
    color: "#102A55",
    fontFamily: fontFamilies.body,
    fontSize: 12,
    marginTop: 5,
  },
  orderDate: {
    color: "#696969",
    fontFamily: fontFamilies.body,
    fontSize: 9,
    marginTop: 5,
  },
  delivered: {
    backgroundColor: "#E5F7E8",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  deliveredText: {
    color: "#25AD3B",
    fontFamily: fontFamilies.body,
    fontSize: 8,
  },
  deliveredOutline: {
    backgroundColor: "#FFF",
    borderColor: "#2B91FF",
    borderWidth: 2,
    paddingVertical: 2,
  },
  deliveredOutlineText: { color: "#25AD3B" },
});
