import { useCallback, useContext } from "react";
import { BattleContext, Types } from "../contexts/battle";
import { Assets, Resource, Spritesheet, Texture } from "pixi.js";
import { Sound } from "@pixi/sound";
import spritesheetSlash from "../components/sprites/fx/slash/slash.json";

export const useFX = () => {
  const { dispatch } = useContext(BattleContext);

  // base function to play effect on battle map
  const playEffect = useCallback(
    ({
      x,
      y,
      textures,
      sound,
    }: {
      x: number;
      y: number;
      textures: Texture<Resource>[];
      sound?: Sound;
    }) => {
      dispatch({
        type: Types.EFFECT_PLAY,
        payload: {
          playing: true,
          x,
          y,
          textures,
          sound,
        },
      });
      if (sound) {
        sound.play();
      }
    },
    [dispatch]
  );

  // function to display hit animation and sound effect
  const effectHit = useCallback(
    async ({ x, y }: { x: number; y: number }) => {
      const textureSlash = await Assets.load(
        "/assets/ninja-adventure/fx/slash/slash/spritesheet.png"
      );
      const sheetSlash = new Spritesheet(textureSlash, spritesheetSlash);
      await sheetSlash.parse();

      const sound = Sound.from({
        url: "/assets/ninja-adventure/sounds/game/hit.wav",
        volume: 0.25,
        preload: true,
      });

      playEffect({ x, y, textures: sheetSlash.animations.slash, sound });
    },
    [playEffect]
  );

  return { effectHit };
};
