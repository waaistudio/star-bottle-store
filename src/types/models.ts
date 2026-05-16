export type EnergyLevel = "glow_match" | "beacon";

export type BottleStatus = "drifting" | "picked" | "replied" | "archived";

export type ReplyItemType = "text" | "hug" | "tea" | "pat" | "star_bottle";

export type ReportReason = "harassment" | "self_harm" | "spam" | "unsafe" | "other";

export type User = {
  uid: string;
  displayName: string;
  points: number;
  energyLevel: EnergyLevel;
  unreadReplies: number;
  starFragments: number;
};

export type Bottle = {
  id: string;
  senderId: string;
  content: string;
  tags: string[];
  timestamp: string;
  status: BottleStatus;
};

export type Reply = {
  id: string;
  bottleId: string;
  receiverId: string;
  message: string;
  itemType: ReplyItemType;
  timestamp: string;
  thanked: boolean;
};

export type SafetyReport = {
  id: string;
  targetType: "bottle" | "reply" | "user";
  targetId: string;
  reporterId: string;
  reason: ReportReason;
  timestamp: string;
};
