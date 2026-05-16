import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { OceanBackground } from "@/components/ocean-background";
import { PremiumButton } from "@/components/premium-button";
import { getDisabledFeatureCopy } from "@/config/features";
import { useStarBottleStore } from "@/state/star-bottle-store";
import { colors } from "@/theme/colors";
import type { ReplyItemType } from "@/types/models";

const quickActions: Array<{ type: ReplyItemType; title: string; subtitle: string }> = [
  { type: "hug", title: "送上擁抱", subtitle: "安靜陪伴" },
  { type: "tea", title: "遞熱茶", subtitle: "慢慢呼吸" },
  { type: "pat", title: "拍拍肩膀", subtitle: "你已很好" },
];

export default function ReadReplyScreen() {
  const { bottleId } = useLocalSearchParams<{ bottleId?: string }>();
  const { bottles, replyToBottle, reportBottle } = useStarBottleStore();
  const [message, setMessage] = useState("");
  const bottle = useMemo(() => bottles.find((item) => item.id === bottleId), [bottleId, bottles]);
  const canReply = message.trim().length > 0 && Boolean(bottle);

  const submitReply = async (itemType: ReplyItemType = "text", fallback?: string) => {
    if (!bottle) {
      return;
    }

    const finalMessage = (fallback ?? message).trim();
    if (!finalMessage) {
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    replyToBottle({ bottleId: bottle.id, message: finalMessage, itemType });
    router.replace("/");
  };

  const submitReport = async () => {
    if (!bottle) {
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    reportBottle(bottle.id);
    router.replace("/");
  };

  if (!bottle) {
    return (
      <OceanBackground tone="night" showSand={false}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>水瓶已經漂遠了</Text>
            <Text style={styles.emptyCopy}>請回到海岸，等待下一個需要溫柔的人。</Text>
          </View>
        </SafeAreaView>
      </OceanBackground>
    );
  }

  return (
    <OceanBackground tone="night" showSand={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
          <Pressable accessibilityRole="button" onPress={submitReport} style={styles.reportButton}>
            <Text style={styles.reportIcon}>⊘</Text>
            <View>
              <Text style={styles.reportTitle}>擊碎水瓶</Text>
              <Text style={styles.reportSubtitle}>Report / Block</Text>
            </View>
          </Pressable>

          <View style={styles.dialog}>
            <View style={styles.senderRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>●</Text>
              </View>
              <Text style={styles.senderName}>溫暖的陌生人</Text>
            </View>

            <View style={styles.messageBox}>
              <Text selectable style={styles.messageText}>
                {bottle.content}
              </Text>
              <Text style={styles.signature}>陌生人</Text>
            </View>

            <View style={styles.tags}>
              {bottle.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>

            <Text style={styles.blockTitle}>回覆</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              placeholder="回覆入人的陌生人"
              placeholderTextColor="rgba(24, 35, 59, 0.36)"
              style={styles.replyInput}
              textAlignVertical="top"
            />

            <Text style={styles.blockTitle}>快速反應</Text>
            <View style={styles.quickGrid}>
              {quickActions.map((action) => (
                <Pressable
                  key={action.type}
                  accessibilityRole="button"
                  onPress={() => submitReply(action.type, `${action.title}：${action.subtitle}`)}
                  style={styles.quickButton}
                >
                  <Text style={styles.quickTitle}>{action.title}</Text>
                  <Text style={styles.quickSubtitle}>{action.subtitle}</Text>
                </Pressable>
              ))}
            </View>

            <PremiumButton title="購買並送出星星瓶" subtitle={getDisabledFeatureCopy("virtualCommerce")} disabled />

            <Pressable
              accessibilityRole="button"
              disabled={!canReply}
              onPress={() => submitReply()}
              style={[styles.replyButton, !canReply ? styles.replyButtonDisabled : null]}
            >
              <Text style={styles.replyButtonText}>送出鼓勵</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </OceanBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 84,
    paddingBottom: 34,
    gap: 18,
  },
  reportButton: {
    alignSelf: "flex-end",
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(8, 24, 50, 0.34)",
  },
  reportIcon: {
    color: colors.danger,
    fontSize: 24,
    fontWeight: "900",
  },
  reportTitle: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "900",
  },
  reportSubtitle: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: 12,
    fontWeight: "700",
  },
  dialog: {
    borderRadius: 8,
    backgroundColor: "rgba(255, 253, 247, 0.96)",
    padding: 22,
    gap: 16,
    boxShadow: "0 18px 28px rgba(0, 0, 0, 0.32)",
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8E4F7",
  },
  avatarText: {
    color: "#5875AA",
    fontSize: 20,
  },
  senderName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  messageBox: {
    borderRadius: 8,
    backgroundColor: "rgba(24, 35, 59, 0.06)",
    padding: 14,
    gap: 10,
  },
  messageText: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
  },
  signature: {
    color: colors.textMuted,
    fontSize: 13,
    alignSelf: "flex-end",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    color: colors.text,
    fontWeight: "800",
    backgroundColor: "rgba(255, 226, 122, 0.28)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  blockTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
  },
  replyInput: {
    minHeight: 108,
    borderWidth: 1,
    borderColor: "rgba(24, 35, 59, 0.22)",
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 17,
    lineHeight: 25,
    backgroundColor: "rgba(255, 255, 255, 0.74)",
  },
  quickGrid: {
    flexDirection: "row",
    gap: 10,
  },
  quickButton: {
    flex: 1,
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(24, 35, 59, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  quickTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  quickSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
  replyButton: {
    minHeight: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
  replyButtonDisabled: {
    opacity: 0.48,
  },
  replyButtonText: {
    color: colors.warmStarSoft,
    fontSize: 18,
    fontWeight: "900",
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyTitle: {
    color: colors.foam,
    fontSize: 24,
    fontWeight: "900",
  },
  emptyCopy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});
