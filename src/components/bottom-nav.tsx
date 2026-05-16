import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type TabKey = "home" | "messages" | "heart" | "inbox" | "profile";

type BottomNavProps = {
  active: TabKey;
};

const tabs: Array<{ key: TabKey; label: string; icon: string; href: "/" | "/inbox" }> = [
  { key: "home", label: "海岸", icon: "⌂", href: "/" },
  { key: "messages", label: "瓶訊", icon: "▤", href: "/inbox" },
  { key: "heart", label: "溫暖", icon: "♥", href: "/inbox" },
  { key: "inbox", label: "信箱", icon: "✉", href: "/inbox" },
  { key: "profile", label: "我", icon: "●", href: "/inbox" },
];

export function BottomNav({ active }: BottomNavProps) {
  return (
    <View style={styles.root}>
      {tabs.map((tab) => (
        <Link key={tab.key} href={tab.href} asChild>
          <Pressable accessibilityRole="button" accessibilityLabel={tab.label} style={styles.item}>
            <Text style={[styles.icon, active === tab.key ? styles.active : styles.idle]}>{tab.icon}</Text>
            <View style={[styles.indicator, active === tab.key ? styles.indicatorActive : null]} />
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(8, 24, 50, 0.92)",
  },
  item: {
    width: 46,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 25,
    fontWeight: "900",
  },
  active: {
    color: colors.foam,
  },
  idle: {
    color: "rgba(255, 255, 255, 0.52)",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    width: 24,
    height: 3,
    borderRadius: 999,
  },
  indicatorActive: {
    backgroundColor: colors.warmStarSoft,
  },
});
