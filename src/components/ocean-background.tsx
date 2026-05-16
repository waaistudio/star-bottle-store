import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/theme/colors";

type OceanBackgroundProps = {
  children: React.ReactNode;
  tone?: "auto" | "sunrise" | "dusk" | "night";
  showSand?: boolean;
};

const toneGradients = {
  sunrise: ["#254A73", "#D39A9D", "#15506C"],
  dusk: ["#10234E", "#58408B", "#126175"],
  night: ["#07142F", "#17164F", "#073E59"],
} as const;

type StarPosition = {
  top: `${number}%`;
  left: `${number}%`;
  size: number;
  opacity: number;
};

export function OceanBackground({ children, tone = "auto", showSand = true }: OceanBackgroundProps) {
  const waveOne = useRef(new Animated.Value(0)).current;
  const waveTwo = useRef(new Animated.Value(0)).current;
  const resolvedTone = useMemo(() => resolveTone(tone), [tone]);
  const stars = useMemo<StarPosition[]>(
    () => [
      { top: "9%", left: "14%", size: 8, opacity: 0.85 },
      { top: "17%", left: "33%", size: 4, opacity: 0.72 },
      { top: "12%", left: "72%", size: 9, opacity: 0.9 },
      { top: "25%", left: "82%", size: 5, opacity: 0.64 },
      { top: "30%", left: "18%", size: 6, opacity: 0.8 },
      { top: "21%", left: "52%", size: 3, opacity: 0.72 },
    ],
    [],
  );

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveOne, { toValue: 1, duration: 5200, useNativeDriver: true }),
          Animated.timing(waveOne, { toValue: 0, duration: 5200, useNativeDriver: true }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveTwo, { toValue: 1, duration: 6800, useNativeDriver: true }),
          Animated.timing(waveTwo, { toValue: 0, duration: 6800, useNativeDriver: true }),
        ]),
      ),
    ]);

    animation.start();
    return () => animation.stop();
  }, [waveOne, waveTwo]);

  const waveOneShift = waveOne.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] });
  const waveTwoShift = waveTwo.interpolate({ inputRange: [0, 1], outputRange: [24, -12] });

  return (
    <View style={styles.root}>
      <LinearGradient colors={toneGradients[resolvedTone]} style={StyleSheet.absoluteFill} />
      <View style={styles.starField}>
        {stars.map((star, index) => (
          <Text
            key={index}
            style={[
              styles.star,
              {
                top: star.top,
                left: star.left,
                fontSize: star.size + 10,
                opacity: star.opacity,
              },
            ]}
          >
            ✦
          </Text>
        ))}
      </View>
      <View style={styles.horizonGlow} />
      <View style={styles.ocean}>
        <Animated.View style={[styles.wave, styles.waveBright, { transform: [{ translateX: waveOneShift }] }]} />
        <Animated.View style={[styles.wave, styles.waveSoft, { transform: [{ translateX: waveTwoShift }] }]} />
      </View>
      {showSand ? (
        <View style={styles.sand}>
          <View style={styles.foamLine} />
          <Text style={[styles.shell, { left: "18%", top: 38 }]}>✦</Text>
          <Text style={[styles.shell, { right: "17%", top: 58, opacity: 0.55 }]}>✦</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

function resolveTone(tone: OceanBackgroundProps["tone"]) {
  if (tone && tone !== "auto") {
    return tone;
  }

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return "sunrise";
  }

  if (hour >= 16 && hour < 20) {
    return "dusk";
  }

  return "night";
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.deepSea,
    overflow: "hidden",
  },
  starField: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: "absolute",
    color: colors.warmStar,
    textShadowColor: "rgba(255, 226, 122, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  horizonGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "45%",
    height: 3,
    backgroundColor: "rgba(255, 226, 122, 0.22)",
  },
  ocean: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 112,
    height: "43%",
    backgroundColor: "rgba(18, 112, 137, 0.76)",
  },
  wave: {
    position: "absolute",
    left: -36,
    right: -36,
    borderRadius: 999,
  },
  waveBright: {
    top: 38,
    height: 42,
    borderTopWidth: 4,
    borderColor: "rgba(242, 253, 255, 0.55)",
  },
  waveSoft: {
    top: 112,
    height: 52,
    borderTopWidth: 3,
    borderColor: "rgba(190, 232, 244, 0.34)",
  },
  sand: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 136,
    backgroundColor: "#F3D69E",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
  },
  foamLine: {
    position: "absolute",
    left: -24,
    right: -24,
    top: -8,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
  },
  shell: {
    position: "absolute",
    color: "#D98E78",
    fontSize: 22,
  },
});
