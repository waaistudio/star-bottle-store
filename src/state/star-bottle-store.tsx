import React, { createContext, useMemo, useReducer } from "react";

import type { Bottle, Reply, User } from "@/types/models";

type StarBottleState = {
  user: User;
  bottles: Bottle[];
  replies: Reply[];
};

type AddBottlePayload = {
  content: string;
  tags: string[];
};

type StarBottleAction =
  | { type: "addBottle"; payload: AddBottlePayload }
  | { type: "markInboxRead" };

type StarBottleContextValue = StarBottleState & {
  addBottle: (payload: AddBottlePayload) => void;
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
  replies: [],
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
    case "markInboxRead":
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
