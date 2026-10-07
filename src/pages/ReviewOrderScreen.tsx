import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../routes/types";
import { theme } from "../constants/colors";

type Props = NativeStackScreenProps<RootStackParamList, "ReviewOrder">;

export default function ReviewOrderScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF9EE" />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Image
          source={require("../assets/Images/OrderConfirmScreenTopimage.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.subtitle}>
          You fuel delivery order has been{`\n`}placed successfully.
        </Text>
        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>Auth ID</Text>
            <Text style={styles.value}>#AUTH12345</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Date &amp; Time</Text>
            <View>
              <Text style={styles.value}>25 May 2025, Sunday</Text>
              <Text style={styles.smallValue}>10:00 AM - 12:00 PM</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>REX CARD</Text>
            <Text style={styles.value}>**** **** 1478</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
        <Text style={styles.footer}>@NeyFuel2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EAF9EE" },
  content: { alignItems: "center", flexGrow: 1, paddingBottom: 10 },
  image: { height: 400, resizeMode: "contain", width: "100%" },
  title: {
    color: "#000",
    fontFamily: theme.typography.heading,
    fontSize: 23,
    marginTop: 5,
  },
  subtitle: {
    color: theme.colors.navy,
    fontFamily: theme.typography.body,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
  },
  details: {
    backgroundColor: "#FFF",
    borderRadius: 3,
    elevation: 3,
    marginTop: 20,
    width: "90%",
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 43,
    paddingHorizontal: 13,
  },
  label: {
    color: theme.colors.navy,
    fontFamily: theme.typography.body,
    fontSize: 9,
  },
  value: {
    color: theme.colors.navy,
    fontFamily: theme.typography.bodyBold,
    fontSize: 9,
    textAlign: "right",
  },
  smallValue: {
    color: theme.colors.navy,
    fontFamily: theme.typography.body,
    fontSize: 7,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#FFF0E5",
    borderRadius: 3,
    marginTop: 42,
    paddingVertical: 5,
    width: "90%",
  },
  buttonText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    color: theme.colors.muted,
    fontFamily: theme.typography.body,
    fontSize: 9,
    marginTop: "auto",
    paddingTop: 81,
  },
});
