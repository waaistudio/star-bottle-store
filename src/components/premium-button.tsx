import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/theme/colors";

type PremiumButtonProps = {
  title: string;
  subtitle?: string;
  disabled?: boolean;
  onPress?: () => void;
};

export function PremiumButton({ title, subtitle, disabled, onPress }: PremiumButtonProps) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.root, disabled ? styles.disabled : null]}>
      <LinearGradient colors={["#132C58", "#0C1B3B"]} style={styles.gradient}>
        <Text style={styles.sparkle}>✦</Text>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Text style={styles.sparkle}>✦</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.warmStar,
    boxShadow: "0 0 18px rgba(255, 226, 122, 0.58)",
  },
  disabled: {
    opacity: 0.8,
  },
  gradient: {
    minHeight: 62,
    borderRadius: 28,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sparkle: {
    color: colors.warmStar,
    fontSize: 24,
    textShadowColor: "rgba(255, 226, 122, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  copy: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: colors.warmStarSoft,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },
});
