import { Stage } from "@pixi/react";
import Player from "./components/actors/Player";
import { BattleContext, BattleProvider } from "./contexts/battle";
import FX from "./components/fx/FX";
import { useContext } from "react";
import BattleTile from "./components/system/BattleTile";

const App = () => {
  return (
    <Stage width={800} height={600} options={{ background: 0x1099bb }}>
      <BattleProvider>
        {/* Battle Tile */}
        <BattleTile />

        {/* Render Players */}
        {(() => {
          const { state } = useContext(BattleContext);
          return Object.values(state.player_stats).map((p) => (
            <Player key={p.id} id={p.id} type={p.type} health={p.health} />
          ));
        })()}

        {/* Render top layers (FX, GUI, etc.) */}
        <FX />
      </BattleProvider>
    </Stage>
  );
};

export default App;
