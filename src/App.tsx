import { Stage } from "@pixi/react";
import Player from "./Player";
import { createContext, Dispatch, useReducer } from "react";

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  SYSTEM_ADD_PLAYER = "SYSTEM_ADD_PLAYER",
  PLAYER_WALK = "PLAYER_WALK",
  PLAYER_ATTACK = "PLAYER_ATTACK",
}

type Payload = {
  [Types.SYSTEM_ADD_PLAYER]: {
    id: string;
  };
  [Types.PLAYER_WALK]: {
    id: string;
  };
  [Types.PLAYER_ATTACK]: {
    actor_id: string;
    target_id: string;
  };
};
type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

const reducer = (state: StateType, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case Types.SYSTEM_ADD_PLAYER:
      state.turn.push(payload.id);
      state.player_ids.push(payload.id);
      return state;
    case Types.PLAYER_WALK:
      const walked_id = state.turn.shift() as string;
      state.turn.push(walked_id);
      return state;
    case Types.PLAYER_ATTACK:
      console.log(payload.actor_id, payload.target_id);
      return state;
    default:
      return state;
  }
};

interface StateType {
  turn: string[];
  player_ids: string[];
}

const initialState: StateType = {
  turn: [],
  player_ids: [],
};

export const TurnContext = createContext<{
  state: StateType;
  dispatch: Dispatch<Actions>;
}>({ state: initialState, dispatch: () => {} });

const TurnProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TurnContext.Provider value={{ state, dispatch }}>
      {children}
    </TurnContext.Provider>
  );
};

const App = () => {
  return (
    <Stage width={800} height={600} options={{ background: 0x1099bb }}>
      <TurnProvider>
        <Player id={"player-1"} x={16 * 25} y={16 * 12} type="boy" />
        <Player
          id={"player-2"}
          x={16 * 25}
          y={16 * 15}
          type="camouflage-green"
        />
      </TurnProvider>
    </Stage>
  );
};

export default App;
