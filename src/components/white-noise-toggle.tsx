import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as Haptics from "expo-haptics";

import { colors } from "@/theme/colors";

const softNoise = require("../../assets/audio/soft-noise.wav");

export function WhiteNoiseToggle() {
  const player = useAudioPlayer(softNoise);
  const status = useAudioPlayerStatus(player);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    player.loop = true;
    player.volume = 0.22;
  }, [player]);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (enabled) {
      player.play();
      return;
    }

    player.pause();
    player.seekTo(0).catch(() => undefined);
  }, [enabled, player]);

  const toggle = async () => {
    await Haptics.selectionAsync().catch(() => undefined);
    setEnabled((current) => !current);
  };

  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: enabled }} onPress={toggle} style={styles.root}>
      <Text style={styles.icon}>{enabled && status.playing ? "≋" : "∿"}</Text>
      <View style={styles.copy}>
        <Text style={styles.title}>海浪白噪音</Text>
        <Text style={styles.subtitle}>{enabled ? "播放中" : "已關閉"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 18,
    top: 52,
    zIndex: 4,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(8, 24, 50, 0.42)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
  },
  icon: {
    color: colors.warmStarSoft,
    fontSize: 19,
    fontWeight: "900",
  },
  copy: {
    gap: 1,
  },
  title: {
    color: colors.foam,
    fontSize: 12,
    fontWeight: "900",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: 11,
    fontWeight: "700",
  },
});
