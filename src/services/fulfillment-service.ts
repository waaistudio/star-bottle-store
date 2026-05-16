export type RedemptionRequest = {
  rewardId: "comfort_pack";
  starFragmentsCost: number;
};

export type RedemptionResult = {
  status: "disabled" | "submitted";
  message: string;
};

export async function redeemPhysicalWarmth(_request: RedemptionRequest): Promise<RedemptionResult> {
  return {
    status: "disabled",
    message: "實體解憂禮包會在第 3 階段開放。",
  };
}
