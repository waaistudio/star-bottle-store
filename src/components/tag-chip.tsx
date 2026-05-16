import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/theme/colors";

type TagChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function TagChip({ label, selected, onPress }: TagChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.root, selected ? styles.selected : styles.idle]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : styles.idleLabel]}>#{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 38,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  idle: {
    backgroundColor: "rgba(255, 255, 255, 0.74)",
    borderColor: "rgba(24, 35, 59, 0.26)",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  selectedLabel: {
    color: colors.warmStarSoft,
  },
  idleLabel: {
    color: colors.text,
  },
});
