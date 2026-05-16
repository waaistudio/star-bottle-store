export const featureFlags = {
  virtualCommerce: false,
  physicalFulfillment: false,
  aiLighthouse: false,
  backendPersistence: false,
} as const;

export function getDisabledFeatureCopy(feature: keyof typeof featureFlags) {
  const copy: Record<keyof typeof featureFlags, string> = {
    virtualCommerce: "第 2 階段開放：平台內購與虛擬祝福",
    physicalFulfillment: "第 3 階段開放：物流、庫存、退款與客服",
    aiLighthouse: "第 2 階段開放：24 小時 AI 燈塔保底回覆",
    backendPersistence: "第 2 階段開放：雲端同步與推播",
  };

  return copy[feature];
}
