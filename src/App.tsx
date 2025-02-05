import { useContext } from "react";
import { Stage } from "@pixi/react";

import { BattleContext, BattleProvider } from "./contexts/battle";

import Player from "./components/actors/Player";

import FX from "./components/fx/FX";

import BattleTile from "./components/system/BattleTile";
import Field from "./components/system/Field";
import TreeSingle from "./components/system/TreeSingle";
import Floor from "./components/system/Floor";

const gameTileSize = 64;

const App = () => {
  return (
    <Stage
      width={gameTileSize * 24}
      height={gameTileSize * 18}
      options={{
        background: 0x1099bb,
      }}
    >
      <BattleProvider>
        <Field x={0} y={0} width={23} height={17} tileSize={gameTileSize} />
        <Floor
          x={gameTileSize * 6}
          y={gameTileSize * 3}
          width={10}
          height={10}
          tileSize={gameTileSize}
        />

        {(() => {
          const { state } = useContext(BattleContext);

          return state.mapObjects.map((o) => {
            switch (o.type) {
              case "tree-single":
                return <TreeSingle id={o.id} x={o.x} y={o.y} size={o.size} />;
              case "tree-multiple":
                return <TreeSingle id={o.id} x={o.x} y={o.y} size={o.size} />;
              default:
                return null;
            }
          });
        })()}

        {/* Battle Tile */}
        <BattleTile size={gameTileSize} />

        {/* Render Players */}
        {(() => {
          const { state } = useContext(BattleContext);
          return Object.values(state.player_stats).map((p) => (
            <Player
              key={p.id}
              id={p.id}
              type={p.type}
              health={p.health}
              size={gameTileSize}
            />
          ));
        })()}

        {/* Render top layers (FX, GUI, etc.) */}
        <FX size={gameTileSize} />
      </BattleProvider>
    </Stage>
  );
};

export default App;
