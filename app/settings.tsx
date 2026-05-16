import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OceanBackground } from "@/components/ocean-background";
import { colors } from "@/theme/colors";

const sections = [
  {
    title: "匿名保護",
    body: "公開畫面只顯示陌生人身份。後端仍會保留 uid 與風控紀錄，用於封鎖濫用、處理檢舉與保護用戶。",
  },
  {
    title: "檢舉與封鎖",
    body: "每個水瓶與回覆都需要有檢舉入口。被檢舉內容會進入審核佇列，嚴重內容會先隱藏再處理。",
  },
  {
    title: "危機內容",
    body: "涉及立即危險、自傷或傷害他人的內容不會隨機派給陌生人，系統會顯示即時求助提示並送入審核。",
  },
  {
    title: "帳號與資料刪除",
    body: "正式版需要提供一鍵申請刪除帳號與資料的流程。刪除後會移除個人資料，必要的安全稽核紀錄按政策保留。",
  },
  {
    title: "白噪音",
    body: "海浪白噪音必須由用戶主動開啟，不會預設播放，也不會在背景持續播放。",
  },
];

export default function SettingsScreen() {
  return (
    <OceanBackground tone="night" showSand={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
          <Text style={styles.title}>安全與帳號</Text>
          <Text style={styles.intro}>這些規則會成為上架前的審核與後端實作標準。</Text>

          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}
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
    paddingHorizontal: 18,
    paddingTop: 90,
    paddingBottom: 32,
    gap: 14,
  },
  title: {
    color: colors.foam,
    fontSize: 28,
    fontWeight: "900",
  },
  intro: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
    marginBottom: 8,
  },
  section: {
    borderRadius: 8,
    padding: 16,
    gap: 8,
    backgroundColor: "rgba(255, 253, 247, 0.95)",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  sectionBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
});
