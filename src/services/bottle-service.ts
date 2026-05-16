import type { Bottle, Reply, ReplyItemType } from "@/types/models";

export type CreateBottleInput = {
  content: string;
  tags: string[];
};

export type ReplyToBottleInput = {
  bottleId: string;
  message: string;
  itemType: ReplyItemType;
};

export type BottleService = {
  createBottle(input: CreateBottleInput): Promise<Bottle>;
  replyToBottle(input: ReplyToBottleInput): Promise<Reply>;
  reportBottle(bottleId: string): Promise<void>;
};

export function createMockBottleService(): BottleService {
  return {
    async createBottle(input) {
      return {
        id: `bottle-${Date.now()}`,
        senderId: "demo-user",
        content: input.content,
        tags: input.tags,
        timestamp: new Date().toISOString(),
        status: "drifting",
      };
    },
    async replyToBottle(input) {
      return {
        id: `reply-${Date.now()}`,
        bottleId: input.bottleId,
        receiverId: "demo-user",
        message: input.message,
        itemType: input.itemType,
        timestamp: new Date().toISOString(),
        thanked: false,
      };
    },
    async reportBottle() {
      return undefined;
    },
  };
}
