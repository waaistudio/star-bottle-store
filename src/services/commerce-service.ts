import { featureFlags } from "@/config/features";

export type VirtualProductId = "star_bottle_small" | "star_fragments_pack";

export type PurchaseResult = {
  productId: VirtualProductId;
  status: "verified" | "cancelled" | "failed";
};

export async function purchaseVirtualKindness(productId: VirtualProductId): Promise<PurchaseResult> {
  return {
    productId,
    status: "failed",
  };
}

export function isVirtualCommerceEnabled() {
  return featureFlags.virtualCommerce;
}
