import { useContext, useEffect, useState } from "react";
import {
  Assets,
  ISpritesheetData,
  Spritesheet,
  SpriteSheetJson,
  TextStyle,
  Texture,
} from "pixi.js";
import { Container, AnimatedSprite, Text } from "@pixi/react";
import { BattleContext, Types } from "../../contexts/battle";
import spritesheetBoy from "../sprites/actors/characters/boy.json";
import spritesheetCamouflageGreen from "../sprites/actors/characters/camouflage-green.json";

type Props = {
  id: string;
  type: "boy" | "camouflage-green";
  health: number;
};

type Animations = Record<
  keyof NonNullable<ISpritesheetData["animations"]>,
  Texture[]
>;

const Player = (props: Props) => {
  const { state, dispatch } = useContext(BattleContext);

  // handle sprite groupings
  const [animations, setAnimations] = useState<Animations>({});

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const texture = await Assets.load(
          `/assets/ninja-adventure/actor/characters/${props.type}/spritesheet.png`
        );
        let sprite: SpriteSheetJson;
        switch (props.type) {
          case "boy":
            sprite = spritesheetBoy;
            break;
          case "camouflage-green":
            sprite = spritesheetCamouflageGreen;
            break;
          default:
            sprite = spritesheetBoy;
            break;
        }
        const sheet = new Spritesheet(texture, sprite);
        await sheet.parse();
        setAnimations(sheet.animations);

        return sheet;
      } catch (error) {
        console.error(error);
      }
    };
    let storedSpriteSheet: Spritesheet;
    loadAsset().then((s) => {
      if (s) {
        storedSpriteSheet = s;
      }
    });
    return () => {
      if (storedSpriteSheet) {
        storedSpriteSheet.destroy();
      }
    };
  }, [setAnimations, props.type]);

  if (!state.player_stats[props.id]) {
    return null;
  }

  const active = state?.turn[0] === props.id;

  return (
    <>
      <Text
        text={`${state.player_stats[props.id].health}`}
        anchor={0.5}
        x={state.player_stats[props.id].x + 8}
        y={state.player_stats[props.id].y - 2}
        style={new TextStyle({ fontSize: 10 })}
      />

      <Container
        name={props.id}
        x={state.player_stats[props.id].x}
        y={state.player_stats[props.id].y}
        anchor={0.5}
        width={16}
        height={16}
        renderId={Math.ceil(Math.random() * 100)}
        zIndex={1}
        interactive={active}
        onclick={() => {
          dispatch({
            type: Types.PLAYER_WALK,
            payload: {
              id: props.id,
              x: state.player_stats[props.id].x,
              y: state.player_stats[props.id].y,
            },
          });
        }}
      >
        {Object.entries(animations).map(([animationName, textures]) => (
          <AnimatedSprite
            key={animationName}
            isPlaying={active}
            initialFrame={0}
            animationSpeed={0.15}
            textures={textures}
            renderable={
              animationName === state.player_stats[props.id].animationState
            }
          />
        ))}
      </Container>
    </>
  );
};

export default Player;
