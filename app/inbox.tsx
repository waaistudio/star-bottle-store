import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/bottom-nav";
import { OceanBackground } from "@/components/ocean-background";
import { PremiumButton } from "@/components/premium-button";
import { useStarBottleStore } from "@/state/star-bottle-store";
import { colors } from "@/theme/colors";
import type { EnergyLevel, ReplyItemType } from "@/types/models";
import { formatRelativeTime } from "@/utils/format-time";

const levelLabels: Record<EnergyLevel, { title: string; badge: string; next: string }> = {
  glow_match: { title: "微光火柴", badge: "✦", next: "再送出 5 次星光可升級燈塔" },
  beacon: { title: "燈塔", badge: "▴", next: "你已成為海上的穩定光源" },
};

const itemLabels: Record<ReplyItemType, string> = {
  text: "文字鼓勵",
  hug: "虛擬擁抱",
  tea: "遞熱茶",
  pat: "拍拍肩膀",
  star_bottle: "星星瓶",
};

export default function InboxScreen() {
  const { user, replies, sendStarlight, markInboxRead } = useStarBottleStore();
  const level = levelLabels[user.energyLevel];

  useEffect(() => {
    markInboxRead();
  }, [markInboxRead]);

  const thankReply = async (replyId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    sendStarlight(replyId);
  };

  return (
    <OceanBackground tone="night" showSand={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>●</Text>
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.levelLabel}>正能量等級勳章</Text>
              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeIcon}>{level.badge}</Text>
                  <Text style={styles.badgeText}>{level.title}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeIcon}>▴</Text>
                  <Text style={styles.badgeText}>燈塔</Text>
                </View>
              </View>
              <Text style={styles.starCount}>星光碎片：{user.starFragments} 顆星</Text>
              <Text style={styles.nextLevel}>{level.next}</Text>
            </View>
          </View>

          <PremiumButton title="兌換實體溫暖（解憂禮包）" subtitle="第 3 階段開放：物流、庫存、退款與客服" disabled />

          <Pressable accessibilityRole="button" onPress={() => router.push("/settings")} style={styles.settingsButton}>
            <Text style={styles.settingsTitle}>安全與帳號</Text>
            <Text style={styles.settingsCopy}>檢舉政策、資料刪除、匿名保護</Text>
          </Pressable>

          <View style={styles.wallet}>
            <View>
              <Text style={styles.walletLabel}>星光碎片</Text>
              <Text style={styles.walletSubcopy}>用於感謝回覆與日後兌換</Text>
            </View>
            <Text style={styles.walletAmount}>✦ {user.starFragments}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>收到的回覆</Text>
            <Text style={styles.sectionCount}>{replies.length} 則</Text>
          </View>

          <View style={styles.replyList}>
            {replies.map((reply) => (
              <View key={reply.id} style={styles.replyRow}>
                <View style={styles.replyAvatar}>
                  <Text style={styles.replyAvatarText}>●</Text>
                </View>
                <View style={styles.replyBody}>
                  <View style={styles.replyTitleRow}>
                    <Text style={styles.replySender}>一個溫暖的陌生人</Text>
                    <Text style={styles.replyTime}>{formatRelativeTime(reply.timestamp)}</Text>
                  </View>
                  <Text style={styles.replyType}>{itemLabels[reply.itemType]}</Text>
                  <Text selectable style={styles.replyMessage}>
                    {reply.message}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    disabled={reply.thanked || user.starFragments <= 0}
                    onPress={() => thankReply(reply.id)}
                    style={[styles.thankButton, reply.thanked ? styles.thankButtonDone : null]}
                  >
                    <Text style={styles.thankButtonText}>{reply.thanked ? "已送出星光" : "送出星光"}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <BottomNav active="inbox" />
      </SafeAreaView>
    </OceanBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 88,
    paddingBottom: 110,
    gap: 18,
  },
  profileHeader: {
    minHeight: 152,
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 226, 122, 0.24)",
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(235, 243, 255, 0.88)",
  },
  avatarText: {
    color: "#26384E",
    fontSize: 40,
  },
  profileCopy: {
    flex: 1,
    gap: 8,
  },
  levelLabel: {
    color: "rgba(255, 255, 255, 0.68)",
    fontSize: 15,
    fontWeight: "800",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    minHeight: 32,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(8, 24, 50, 0.72)",
  },
  badgeIcon: {
    color: colors.warmStar,
    fontSize: 15,
    fontWeight: "900",
  },
  badgeText: {
    color: colors.warmStarSoft,
    fontSize: 15,
    fontWeight: "900",
  },
  starCount: {
    color: colors.warmStarSoft,
    fontSize: 17,
    fontWeight: "900",
  },
  nextLevel: {
    color: "rgba(255, 255, 255, 0.64)",
    fontSize: 13,
    lineHeight: 18,
  },
  wallet: {
    borderRadius: 8,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 253, 247, 0.94)",
    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.18)",
  },
  settingsButton: {
    minHeight: 64,
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  settingsTitle: {
    color: colors.foam,
    fontSize: 17,
    fontWeight: "900",
  },
  settingsCopy: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  walletLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  walletSubcopy: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    fontWeight: "700",
  },
  walletAmount: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: colors.foam,
    fontSize: 22,
    fontWeight: "900",
  },
  sectionCount: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "800",
  },
  replyList: {
    gap: 12,
  },
  replyRow: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "rgba(255, 253, 247, 0.96)",
  },
  replyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8E4F7",
  },
  replyAvatarText: {
    color: "#5875AA",
    fontSize: 25,
  },
  replyBody: {
    flex: 1,
    gap: 7,
  },
  replyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  replySender: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  replyTime: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  replyType: {
    color: "#60739B",
    fontSize: 13,
    fontWeight: "900",
  },
  replyMessage: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  thankButton: {
    alignSelf: "flex-start",
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
  thankButtonDone: {
    backgroundColor: "rgba(24, 35, 59, 0.28)",
  },
  thankButtonText: {
    color: colors.warmStarSoft,
    fontSize: 13,
    fontWeight: "900",
  },
});
