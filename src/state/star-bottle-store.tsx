import React, { createContext, useCallback, useEffect, useMemo, useReducer } from "react";

import { ensureAnonymousUser } from "@/firebase/client";
import { isFirebaseConfigured } from "@/firebase/config";
import { createMockBottleService } from "@/services/bottle-service";
import { createFirebaseBottleService } from "@/services/firebase-bottle-service";
import type { Bottle, Reply, ReplyItemType, SafetyReport, User } from "@/types/models";

type BackendStatus = "local" | "connecting" | "firebase-ready" | "firebase-error";

type StarBottleState = {
  user: User;
  bottles: Bottle[];
  replies: Reply[];
  reports: SafetyReport[];
  backendStatus: BackendStatus;
  backendMessage?: string;
};

type AddBottlePayload = {
  content: string;
  tags: string[];
};

type StarBottleAction =
  | { type: "addBottle"; payload: Bottle }
  | { type: "replyToBottle"; payload: Reply }
  | { type: "sendStarlight"; payload: { replyId: string } }
  | { type: "reportBottle"; payload: { bottleId: string } }
  | { type: "reportReply"; payload: { replyId: string } }
  | { type: "markInboxRead" }
  | { type: "setCurrentUser"; payload: { uid: string } }
  | { type: "setBackendStatus"; payload: { backendStatus: BackendStatus; backendMessage?: string } };

type StarBottleContextValue = StarBottleState & {
  addBottle: (payload: AddBottlePayload) => Promise<void>;
  replyToBottle: (payload: { bottleId: string; message: string; itemType: ReplyItemType }) => Promise<void>;
  sendStarlight: (replyId: string) => void;
  reportBottle: (bottleId: string) => Promise<void>;
  reportReply: (replyId: string) => Promise<void>;
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
  backendStatus: isFirebaseConfigured() ? "connecting" : "local",
};

const StarBottleContext = createContext<StarBottleContextValue | null>(null);

function reducer(state: StarBottleState, action: StarBottleAction): StarBottleState {
  switch (action.type) {
    case "addBottle": {
      return {
        ...state,
        bottles: [action.payload, ...state.bottles],
      };
    }
    case "replyToBottle": {
      return {
        ...state,
        bottles: state.bottles.map((bottle) =>
          bottle.id === action.payload.bottleId ? { ...bottle, status: "replied" } : bottle,
        ),
        replies: [action.payload, ...state.replies],
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
    case "reportReply": {
      if (state.reports.some((report) => report.targetType === "reply" && report.targetId === action.payload.replyId)) {
        return state;
      }

      const report: SafetyReport = {
        id: `report-${Date.now()}`,
        targetType: "reply",
        targetId: action.payload.replyId,
        reporterId: state.user.uid,
        reason: "unsafe",
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
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
    case "setCurrentUser":
      return {
        ...state,
        user: {
          ...state.user,
          uid: action.payload.uid,
        },
      };
    case "setBackendStatus":
      return {
        ...state,
        backendStatus: action.payload.backendStatus,
        backendMessage: action.payload.backendMessage,
      };
    default:
      return state;
  }
}

export function StarBottleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const firebaseService = useMemo(() => createFirebaseBottleService(), []);
  const fallbackService = useMemo(() => createMockBottleService(), []);

  useEffect(() => {
    let isMounted = true;

    async function connectFirebase() {
      if (!firebaseService) {
        dispatch({ type: "setBackendStatus", payload: { backendStatus: "local" } });
        return;
      }

      dispatch({ type: "setBackendStatus", payload: { backendStatus: "connecting" } });

      try {
        const user = await ensureAnonymousUser();
        if (!isMounted || !user) {
          return;
        }

        dispatch({ type: "setCurrentUser", payload: { uid: user.uid } });
        dispatch({ type: "setBackendStatus", payload: { backendStatus: "firebase-ready" } });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        dispatch({
          type: "setBackendStatus",
          payload: {
            backendStatus: "firebase-error",
            backendMessage: error instanceof Error ? error.message : "Firebase connection failed.",
          },
        });
      }
    }

    connectFirebase();

    return () => {
      isMounted = false;
    };
  }, [firebaseService]);

  const addBottle = useCallback(
    async (payload: AddBottlePayload) => {
      try {
        const bottle = firebaseService
          ? await firebaseService.createBottle(payload)
          : await fallbackService.createBottle(payload);
        dispatch({ type: "addBottle", payload: bottle });
      } catch (error) {
        const bottle = await fallbackService.createBottle(payload);
        dispatch({ type: "addBottle", payload: bottle });
        dispatch({
          type: "setBackendStatus",
          payload: {
            backendStatus: "firebase-error",
            backendMessage: error instanceof Error ? error.message : "Bottle saved locally.",
          },
        });
      }
    },
    [fallbackService, firebaseService],
  );

  const replyToBottle = useCallback(
    async (payload: { bottleId: string; message: string; itemType: ReplyItemType }) => {
      try {
        const reply = firebaseService
          ? await firebaseService.replyToBottle(payload)
          : await fallbackService.replyToBottle(payload);
        dispatch({ type: "replyToBottle", payload: reply });
      } catch (error) {
        const reply = await fallbackService.replyToBottle(payload);
        dispatch({ type: "replyToBottle", payload: reply });
        dispatch({
          type: "setBackendStatus",
          payload: {
            backendStatus: "firebase-error",
            backendMessage: error instanceof Error ? error.message : "Reply saved locally.",
          },
        });
      }
    },
    [fallbackService, firebaseService],
  );

  const reportBottle = useCallback(
    async (bottleId: string) => {
      try {
        if (firebaseService) {
          await firebaseService.reportBottle(bottleId);
        } else {
          await fallbackService.reportBottle(bottleId);
        }
      } catch (error) {
        dispatch({
          type: "setBackendStatus",
          payload: {
            backendStatus: "firebase-error",
            backendMessage: error instanceof Error ? error.message : "Report saved locally.",
          },
        });
      } finally {
        dispatch({ type: "reportBottle", payload: { bottleId } });
      }
    },
    [fallbackService, firebaseService],
  );

  const reportReply = useCallback(
    async (replyId: string) => {
      try {
        if (firebaseService) {
          await firebaseService.reportReply(replyId);
        } else {
          await fallbackService.reportReply(replyId);
        }
      } catch (error) {
        dispatch({
          type: "setBackendStatus",
          payload: {
            backendStatus: "firebase-error",
            backendMessage: error instanceof Error ? error.message : "Report saved locally.",
          },
        });
      } finally {
        dispatch({ type: "reportReply", payload: { replyId } });
      }
    },
    [fallbackService, firebaseService],
  );

  const sendStarlight = useCallback((replyId: string) => {
    dispatch({ type: "sendStarlight", payload: { replyId } });
  }, []);

  const markInboxRead = useCallback(() => {
    dispatch({ type: "markInboxRead" });
  }, []);

  const value = useMemo<StarBottleContextValue>(
    () => ({
      ...state,
      addBottle,
      replyToBottle,
      sendStarlight,
      reportBottle,
      reportReply,
      markInboxRead,
    }),
    [addBottle, markInboxRead, replyToBottle, reportBottle, reportReply, sendStarlight, state],
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
