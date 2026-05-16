import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottleWidget } from "@/components/bottle-widget";
import { OceanBackground } from "@/components/ocean-background";
import { TagChip } from "@/components/tag-chip";
import { useStarBottleStore } from "@/state/star-bottle-store";
import { colors } from "@/theme/colors";

const MAX_CONTENT_LENGTH = 300;
const TAGS = ["職場", "感情", "日常", "家庭", "學業", "迷惘"];

export default function ComposeScreen() {
  const { addBottle } = useStarBottleStore();
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["職場"]);
  const [isSending, setIsSending] = useState(false);
  const sendProgress = useRef(new Animated.Value(0)).current;
  const paperLines = useMemo(() => Array.from({ length: 7 }, (_, index) => index), []);
  const canSend = content.trim().length > 0 && !isSending;

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const sendBottle = async () => {
    if (!canSend) {
      return;
    }

    setIsSending(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    addBottle({ content: content.trim(), tags: selectedTags });

    Animated.timing(sendProgress, {
      toValue: 1,
      duration: 780,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/");
    });
  };

  const bottleTranslateY = sendProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -180] });
  const bottleTranslateX = sendProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 78] });
  const bottleOpacity = sendProgress.interpolate({ inputRange: [0, 0.82, 1], outputRange: [0, 1, 0] });

  return (
    <OceanBackground tone="night" showSand={false}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboard}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <View style={styles.paperCard}>
              <Text style={styles.sectionTitle}>寫心事</Text>
              <View style={styles.inputWrap}>
                {paperLines.map((line) => (
                  <View key={line} style={[styles.paperLine, { top: 42 + line * 38 }]} />
                ))}
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  maxLength={MAX_CONTENT_LENGTH}
                  multiline
                  placeholder="把今天沒有說出口的話，輕輕放進瓶裡。"
                  placeholderTextColor="rgba(24, 35, 59, 0.36)"
                  style={styles.textInput}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>
                  {content.length}/{MAX_CONTENT_LENGTH}
                </Text>
              </View>

              <View style={styles.tagsSection}>
                <Text style={styles.tagsTitle}>選擇標籤</Text>
                <View style={styles.tagGrid}>
                  {TAGS.map((tag) => (
                    <TagChip
                      key={tag}
                      label={tag}
                      selected={selectedTags.includes(tag)}
                      onPress={() => toggleTag(tag)}
                    />
                  ))}
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={!canSend}
              onPress={sendBottle}
              style={[styles.sendButton, !canSend ? styles.sendButtonDisabled : null]}
            >
              <Text style={styles.sendButtonText}>{isSending ? "正在丟出..." : "丟出水瓶"}</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.sendingBottle,
            {
              opacity: bottleOpacity,
              transform: [{ translateY: bottleTranslateY }, { translateX: bottleTranslateX }],
            },
          ]}
        >
          <BottleWidget left="0%" top="0%" scale={0.86} label="" />
        </Animated.View>
      </SafeAreaView>
    </OceanBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 86,
    paddingBottom: 36,
    gap: 22,
  },
  paperCard: {
    minHeight: 590,
    borderRadius: 8,
    backgroundColor: colors.paper,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 26,
    boxShadow: "0 14px 26px rgba(0, 0, 0, 0.28)",
  },
  sectionTitle: {
    color: "rgba(24, 35, 59, 0.58)",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  inputWrap: {
    minHeight: 314,
    position: "relative",
    borderBottomWidth: 1,
    borderColor: "rgba(24, 35, 59, 0.44)",
  },
  paperLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.paperLine,
  },
  textInput: {
    minHeight: 276,
    color: colors.text,
    fontSize: 19,
    lineHeight: 34,
    paddingTop: 12,
    paddingHorizontal: 0,
  },
  counter: {
    position: "absolute",
    right: 0,
    bottom: 8,
    color: "rgba(24, 35, 59, 0.54)",
    fontSize: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  tagsSection: {
    paddingTop: 28,
    gap: 14,
  },
  tagsTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  tagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sendButton: {
    minHeight: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: "rgba(255, 226, 122, 0.42)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.25)",
  },
  sendButtonDisabled: {
    opacity: 0.52,
  },
  sendButtonText: {
    color: colors.warmStarSoft,
    fontSize: 20,
    fontWeight: "900",
  },
  sendingBottle: {
    position: "absolute",
    left: "52%",
    bottom: 108,
    width: 120,
    height: 148,
  },
});
