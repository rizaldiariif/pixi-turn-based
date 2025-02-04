import { createContext, Dispatch, useReducer } from "react";
import { ActionMap } from "./common";
import { Resource, Texture } from "pixi.js";
import { Sound } from "@pixi/sound";

export enum Types {
  SYSTEM_ADD_PLAYER = "SYSTEM_ADD_PLAYER",
  PLAYER_WALK = "PLAYER_WALK",
  PLAYER_ATTACK = "PLAYER_ATTACK",
  EFFECT_PLAY = "EFFECT_PLAY",
  EFFECT_STOP = "EFFECT_STOP",
}

type Payload = {
  [Types.SYSTEM_ADD_PLAYER]: {
    id: string;
    type: "boy" | "camouflage-green";
    health: number;
    x: number;
    y: number;
  };
  [Types.PLAYER_WALK]: {
    id: string;
    x: number;
    y: number;
  };
  [Types.PLAYER_ATTACK]: {
    actor_id: string;
    target_id: string;
  };
  [Types.EFFECT_PLAY]: {
    x: number;
    y: number;
    playing: boolean;
    textures: Texture<Resource>[];
    sound?: Sound;
  };
  [Types.EFFECT_STOP]: null;
};
type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

const reducer = (state: StateType, action: Actions): StateType => {
  const { type, payload } = action;
  switch (type) {
    case Types.SYSTEM_ADD_PLAYER:
      const newTurn = Array.from(state.turn);
      newTurn.push(payload.id);

      const newStats = { ...state.player_stats };
      newStats[payload.id] = {
        id: payload.id,
        type: payload.type,
        health: payload.health,
        x: payload.x,
        y: payload.y,
        animationState: "walkDown",
      };

      return { ...state, turn: newTurn, player_stats: newStats };
    case Types.PLAYER_WALK:
      const newTurn2 = Array.from(state.turn);
      // turn change
      const walked_id = newTurn2.shift() as string;
      newTurn2.push(walked_id);

      const newStats2 = { ...state.player_stats };
      // animation check
      if (payload.x !== newStats2[payload.id].x) {
        if (payload.x > newStats2[payload.id].x) {
          newStats2[payload.id].animationState = "walkRight";
        } else {
          newStats2[payload.id].animationState = "walkLeft";
        }
      }
      if (payload.y !== newStats2[payload.id].y) {
        if (payload.y > newStats2[payload.id].y) {
          newStats2[payload.id].animationState = "walkDown";
        } else {
          newStats2[payload.id].animationState = "walkUp";
        }
      }

      // position change
      newStats2[payload.id].x = payload.x;
      newStats2[payload.id].y = payload.y;

      return { ...state, turn: newTurn2, player_stats: newStats2 };
    case Types.PLAYER_ATTACK:
      // stat change
      let newStats3 = { ...state.player_stats };
      newStats3[payload.target_id].health -= 1;

      // animation check
      const actorStat = newStats3[payload.actor_id];
      const targetStat = newStats3[payload.target_id];
      if (targetStat.x !== actorStat.x) {
        if (targetStat.x > actorStat.x) {
          newStats3[payload.actor_id].animationState = "walkRight";
        } else {
          newStats3[payload.actor_id].animationState = "walkLeft";
        }
      }
      if (targetStat.y !== actorStat.y) {
        if (targetStat.y > actorStat.y) {
          newStats3[payload.actor_id].animationState = "walkDown";
        } else {
          newStats3[payload.actor_id].animationState = "walkUp";
        }
      }

      // turn change
      let newTurn3 = Array.from(state.turn);
      const a = newTurn3.shift() as string;
      newTurn3.push(a);

      if (newStats3[payload.target_id].health <= 0) {
        newTurn3 = newTurn3.filter((t) => t !== payload.target_id);
        delete newStats3[payload.target_id];
      }

      return { ...state, turn: newTurn3, player_stats: newStats3 };
    case Types.EFFECT_PLAY:
      return { ...state, effect: payload };
    case Types.EFFECT_STOP:
      return { ...state, effect: undefined };
    default:
      return { ...state };
  }
};

type AnimationState = "walkUp" | "walkRight" | "walkDown" | "walkLeft";
interface StateType {
  turn: string[];
  player_stats: {
    [index: string]: {
      id: string;
      type: "boy" | "camouflage-green";
      health: number;
      x: number;
      y: number;
      animationState: AnimationState;
    };
  };
  effect?: {
    x: number;
    y: number;
    playing: boolean;
    textures: Texture<Resource>[];
    sound?: Sound;
  };
}

const initialState: StateType = {
  turn: ["player-1", "player-2"],
  player_stats: {
    ["player-1"]: {
      id: "player-1",
      type: "boy",
      health: 5,
      x: 16 * 22,
      y: 16 * 16,
      animationState: "walkDown",
    },
    ["player-2"]: {
      id: "player-2",
      type: "camouflage-green",
      health: 1,
      x: 16 * 22,
      y: 16 * 15,
      animationState: "walkDown",
    },
  },
  effect: undefined,
};

export const BattleContext = createContext<{
  state: StateType;
  dispatch: Dispatch<Actions>;
}>({ state: initialState, dispatch: () => {} });

export const BattleProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BattleContext.Provider value={{ state, dispatch }}>
      {children}
    </BattleContext.Provider>
  );
};
