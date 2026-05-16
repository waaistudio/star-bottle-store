import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottleWidget } from "@/components/bottle-widget";
import { BottomNav } from "@/components/bottom-nav";
import { OceanBackground } from "@/components/ocean-background";
import { WhiteNoiseToggle } from "@/components/white-noise-toggle";
import { colors } from "@/theme/colors";
import { useStarBottleStore } from "@/state/star-bottle-store";

export default function HomeBeachScreen() {
  const { bottles, user } = useStarBottleStore();
  const driftingBottles = bottles.filter((bottle) => bottle.status === "drifting");
  const bottleLayout = useMemo(
    () => [
      { left: "11%" as const, top: "54%" as const, scale: 0.78 },
      { left: "55%" as const, top: "48%" as const, scale: 0.62 },
      { left: "68%" as const, top: "60%" as const, scale: 0.98 },
    ].slice(0, Math.min(3, Math.max(1, driftingBottles.length + 1))),
    [driftingBottles.length],
  );

  return (
    <OceanBackground>
      <SafeAreaView style={styles.safeArea}>
        <WhiteNoiseToggle />
        <View style={styles.mailWrap}>
          <Pressable accessibilityLabel="我的信箱" onPress={() => router.push("/inbox")} style={styles.mailButton}>
            <Text style={styles.mailIcon}>✉</Text>
            {user.unreadReplies > 0 ? <View style={styles.unreadDot} /> : null}
          </Pressable>
          <Text style={styles.mailLabel}>Inbox</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>星海回音</Text>
          <Text style={styles.subtitle}>Starry Echo</Text>
          <Text style={styles.description}>把心事交給大海，讓星光溫暖現實。</Text>
        </View>

        {bottleLayout.map((layout, index) => (
          <BottleWidget
            key={`${layout.left}-${index}`}
            left={layout.left}
            top={layout.top}
            scale={layout.scale}
            label={index === bottleLayout.length - 1 ? "未知的水瓶" : ""}
            onPress={() => {
              const bottle = driftingBottles[index] ?? driftingBottles[0];
              if (bottle) {
                router.push({ pathname: "/read-reply", params: { bottleId: bottle.id } });
              }
            }}
          />
        ))}

        <BottomNav active="home" />

        <Link href="/compose" asChild>
          <Pressable accessibilityRole="button" style={styles.fab}>
            <Text style={styles.fabText}>+ 寫心事</Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </OceanBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mailWrap: {
    position: "absolute",
    top: 52,
    right: 22,
    alignItems: "center",
    zIndex: 3,
  },
  mailButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  mailIcon: {
    color: colors.foam,
    fontSize: 26,
    fontWeight: "900",
  },
  unreadDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF7A7A",
    borderWidth: 2,
    borderColor: colors.ink,
  },
  mailLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    marginTop: 2,
  },
  hero: {
    alignItems: "center",
    paddingTop: 156,
    paddingHorizontal: 28,
    gap: 8,
  },
  title: {
    color: colors.foam,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: colors.foam,
    fontSize: 22,
    fontWeight: "800",
  },
  description: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    bottom: 46,
    alignSelf: "center",
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: "rgba(255, 226, 122, 0.34)",
    boxShadow: "0 16px 28px rgba(0, 0, 0, 0.36)",
    zIndex: 5,
  },
  fabText: {
    color: colors.warmStarSoft,
    fontSize: 19,
    fontWeight: "900",
  },
});
