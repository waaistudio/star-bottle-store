import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { ensureAnonymousUser, getFirebaseClient } from "@/firebase/client";
import type { BottleService, CreateBottleInput, ReplyToBottleInput } from "@/services/bottle-service";
import type { Bottle, Reply } from "@/types/models";

export function createFirebaseBottleService(): BottleService | null {
  const client = getFirebaseClient();

  if (!client) {
    return null;
  }

  return {
    async createBottle(input: CreateBottleInput): Promise<Bottle> {
      const user = await ensureAnonymousUser();

      if (!user) {
        throw new Error("Firebase is not configured.");
      }

      const now = new Date().toISOString();
      const ref = await addDoc(collection(client.db, "bottles"), {
        senderId: user.uid,
        content: input.content,
        tags: input.tags,
        status: "drifting",
        assignedReceiverIds: [],
        moderationStatus: "pending",
        aiFallbackDueAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: ref.id,
        senderId: user.uid,
        content: input.content,
        tags: input.tags,
        timestamp: now,
        status: "drifting",
      };
    },
    async replyToBottle(input: ReplyToBottleInput): Promise<Reply> {
      const user = await ensureAnonymousUser();

      if (!user) {
        throw new Error("Firebase is not configured.");
      }

      const now = new Date().toISOString();
      const ref = await addDoc(collection(client.db, "replies"), {
        bottleId: input.bottleId,
        receiverId: user.uid,
        message: input.message,
        itemType: input.itemType,
        thanked: false,
        isAiGenerated: false,
        moderationStatus: "pending",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(client.db, "bottles", input.bottleId), {
        status: "replied",
        updatedAt: serverTimestamp(),
      });

      return {
        id: ref.id,
        bottleId: input.bottleId,
        receiverId: user.uid,
        message: input.message,
        itemType: input.itemType,
        timestamp: now,
        thanked: false,
      };
    },
    async reportBottle(bottleId: string): Promise<void> {
      const user = await ensureAnonymousUser();

      if (!user) {
        throw new Error("Firebase is not configured.");
      }

      await addDoc(collection(client.db, "reports"), {
        reporterId: user.uid,
        targetType: "bottle",
        targetId: bottleId,
        reason: "unsafe",
        status: "open",
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(client.db, "bottles", bottleId), {
        status: "archived",
        updatedAt: serverTimestamp(),
      });
    },
  };
}
