import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

type BottleWidgetProps = {
  label?: string;
  left: `${number}%`;
  top: `${number}%`;
  scale?: number;
  onPress?: () => void;
};

export function BottleWidget({ label = "未知的水瓶", left, top, scale = 1, onPress }: BottleWidgetProps) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 2800, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 2800, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [drift]);

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const rotate = drift.interpolate({ inputRange: [0, 1], outputRange: ["-18deg", "-9deg"] });

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          left,
          top,
          transform: [{ translateY }, { rotate }, { scale }],
        },
      ]}
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.cork} />
        <View style={styles.neck} />
        <View style={styles.body}>
          <View style={styles.paper} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignItems: "center",
  },
  pressable: {
    alignItems: "center",
    minWidth: 104,
    minHeight: 130,
  },
  cork: {
    width: 18,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#BA8A54",
    transform: [{ translateY: 6 }],
    zIndex: 2,
  },
  neck: {
    width: 22,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(207, 252, 255, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  body: {
    width: 38,
    height: 74,
    borderRadius: 16,
    backgroundColor: "rgba(184, 245, 248, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 18px rgba(255, 242, 168, 0.35)",
    transform: [{ translateY: -5 }],
  },
  paper: {
    width: 24,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.warmStarSoft,
  },
  label: {
    marginTop: 4,
    color: colors.foam,
    fontSize: 15,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
