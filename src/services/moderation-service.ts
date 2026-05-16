export type ModerationResult = {
  allowed: boolean;
  risk: "none" | "low" | "crisis" | "blocked";
  userMessage?: string;
};

const crisisKeywords = ["想死", "自殺", "傷害自己", "活不下去"];

export async function moderateBottleDraft(content: string): Promise<ModerationResult> {
  const normalized = content.trim();

  if (!normalized) {
    return { allowed: false, risk: "blocked", userMessage: "請先寫下一點內容。" };
  }

  if (crisisKeywords.some((keyword) => normalized.includes(keyword))) {
    return {
      allowed: false,
      risk: "crisis",
      userMessage: "如果你正處於立即危險，請先聯絡當地緊急服務或身邊可信任的人。你值得被即時照顧。",
    };
  }

  return { allowed: true, risk: "none" };
}
