# Backend Schema Draft

This schema is intentionally close to the current local reducer state so the UI can migrate without major rewrites.

## users

```ts
{
  uid: string;
  displayName: string;
  points: number;
  energyLevel: "glow_match" | "beacon";
  unreadReplies: number;
  starFragments: number;
  createdAt: Timestamp;
  deletedAt?: Timestamp;
}
```

## bottles

```ts
{
  id: string;
  senderId: string;
  content: string;
  tags: string[];
  status: "drifting" | "picked" | "replied" | "archived";
  assignedReceiverIds: string[];
  moderationStatus: "pending" | "approved" | "flagged" | "blocked";
  aiFallbackDueAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## replies

```ts
{
  id: string;
  bottleId: string;
  receiverId: string;
  message: string;
  itemType: "text" | "hug" | "tea" | "pat" | "star_bottle";
  thanked: boolean;
  isAiGenerated: boolean;
  moderationStatus: "pending" | "approved" | "flagged" | "blocked";
  createdAt: Timestamp;
}
```

## reports

```ts
{
  id: string;
  reporterId: string;
  targetType: "bottle" | "reply" | "user";
  targetId: string;
  reason: "harassment" | "self_harm" | "spam" | "unsafe" | "other";
  status: "open" | "reviewing" | "resolved";
  createdAt: Timestamp;
}
```

## purchases

```ts
{
  id: string;
  uid: string;
  platform: "ios" | "android";
  productId: string;
  receiptHash: string;
  status: "pending" | "verified" | "refunded" | "revoked";
  createdAt: Timestamp;
}
```

## redemptions

```ts
{
  id: string;
  uid: string;
  rewardId: string;
  status: "draft" | "submitted" | "packing" | "shipped" | "delivered" | "cancelled";
  shippingProfileId: string;
  supportCaseId?: string;
  createdAt: Timestamp;
}
```
