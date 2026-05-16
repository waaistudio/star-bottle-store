import React, { createContext, useMemo, useReducer } from "react";

import type { Bottle, Reply, ReplyItemType, SafetyReport, User } from "@/types/models";

type StarBottleState = {
  user: User;
  bottles: Bottle[];
  replies: Reply[];
  reports: SafetyReport[];
};

type AddBottlePayload = {
  content: string;
  tags: string[];
};

type StarBottleAction =
  | { type: "addBottle"; payload: AddBottlePayload }
  | { type: "replyToBottle"; payload: { bottleId: string; message: string; itemType: ReplyItemType } }
  | { type: "sendStarlight"; payload: { replyId: string } }
  | { type: "reportBottle"; payload: { bottleId: string } }
  | { type: "markInboxRead" };

type StarBottleContextValue = StarBottleState & {
  addBottle: (payload: AddBottlePayload) => void;
  replyToBottle: (payload: { bottleId: string; message: string; itemType: ReplyItemType }) => void;
  sendStarlight: (replyId: string) => void;
  reportBottle: (bottleId: string) => void;
  markInboxRead: () => void;
};

const initialState: StarBottleState = {
  user: {
    uid: "demo-user",
    displayName: "海邊的旅人",
    points: 45,
    energyLevel: "glow_match",
    unreadReplies: 1,
    starFragments: 45,
  },
  bottles: [
    {
      id: "bottle-quiet-night",
      senderId: "warm-stranger",
      content: "最近有點累，但又不知道可以跟誰說。希望海的另一邊有人懂。",
      tags: ["日常"],
      timestamp: new Date().toISOString(),
      status: "drifting",
    },
  ],
  replies: [
    {
      id: "reply-warm-tea",
      bottleId: "bottle-demo-owned",
      receiverId: "kind-stranger-1",
      message: "你已經很努力了。今晚先讓自己好好休息，明天再慢慢整理也可以。",
      itemType: "tea",
      timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      thanked: false,
    },
    {
      id: "reply-soft-hug",
      bottleId: "bottle-demo-owned",
      receiverId: "kind-stranger-2",
      message: "送上一個安靜的擁抱。你不是一個人，海的這邊有人聽見你。",
      itemType: "hug",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      thanked: true,
    },
  ],
  reports: [],
};

const StarBottleContext = createContext<StarBottleContextValue | null>(null);

function reducer(state: StarBottleState, action: StarBottleAction): StarBottleState {
  switch (action.type) {
    case "addBottle": {
      const bottle: Bottle = {
        id: `bottle-${Date.now()}`,
        senderId: state.user.uid,
        content: action.payload.content,
        tags: action.payload.tags,
        timestamp: new Date().toISOString(),
        status: "drifting",
      };

      return {
        ...state,
        bottles: [bottle, ...state.bottles],
      };
    }
    case "replyToBottle": {
      const reply: Reply = {
        id: `reply-${Date.now()}`,
        bottleId: action.payload.bottleId,
        receiverId: state.user.uid,
        message: action.payload.message,
        itemType: action.payload.itemType,
        timestamp: new Date().toISOString(),
        thanked: false,
      };

      return {
        ...state,
        bottles: state.bottles.map((bottle) =>
          bottle.id === action.payload.bottleId ? { ...bottle, status: "replied" } : bottle,
        ),
        replies: [reply, ...state.replies],
      };
    }
    case "sendStarlight":
      if (state.user.starFragments <= 0 || state.replies.some((reply) => reply.id === action.payload.replyId && reply.thanked)) {
        return state;
      }

      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + 1,
          starFragments: Math.max(0, state.user.starFragments - 1),
          energyLevel: state.user.points + 1 >= 50 ? "beacon" : state.user.energyLevel,
        },
        replies: state.replies.map((reply) =>
          reply.id === action.payload.replyId ? { ...reply, thanked: true } : reply,
        ),
      };
    case "reportBottle": {
      const report: SafetyReport = {
        id: `report-${Date.now()}`,
        targetType: "bottle",
        targetId: action.payload.bottleId,
        reporterId: state.user.uid,
        reason: "unsafe",
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
        bottles: state.bottles.map((bottle) =>
          bottle.id === action.payload.bottleId ? { ...bottle, status: "archived" } : bottle,
        ),
        reports: [report, ...state.reports],
      };
    }
    case "markInboxRead":
      if (state.user.unreadReplies === 0) {
        return state;
      }

      return {
        ...state,
        user: {
          ...state.user,
          unreadReplies: 0,
        },
      };
    default:
      return state;
  }
}

export function StarBottleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<StarBottleContextValue>(
    () => ({
      ...state,
      addBottle: (payload) => dispatch({ type: "addBottle", payload }),
      replyToBottle: (payload) => dispatch({ type: "replyToBottle", payload }),
      sendStarlight: (replyId) => dispatch({ type: "sendStarlight", payload: { replyId } }),
      reportBottle: (bottleId) => dispatch({ type: "reportBottle", payload: { bottleId } }),
      markInboxRead: () => dispatch({ type: "markInboxRead" }),
    }),
    [state],
  );

  return <StarBottleContext.Provider value={value}>{children}</StarBottleContext.Provider>;
}

export function useStarBottleStore() {
  const context = React.use(StarBottleContext);

  if (!context) {
    throw new Error("useStarBottleStore must be used inside StarBottleProvider");
  }

  return context;
}
