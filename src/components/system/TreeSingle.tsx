import { useEffect, useState } from "react";
import { Sprite } from "@pixi/react";
import { Assets, Resource, Spritesheet, Texture } from "pixi.js";
import spritesheetNature from "../sprites/backgrounds/tilesets/nature.json";

type Props = {
  id: string;
  x: number;
  y: number;
  size: number;
};

const TreeSingle = (props: Props) => {
  const [textures, setTextures] = useState<
    Record<string | number, Texture<Resource>>
  >({});

  useEffect(() => {
    (async () => {
      const texture = await Assets.load(
        "/assets/ninja-adventure/backgrounds/tilesets/tileset-nature.png"
      );
      const sheet = new Spritesheet(texture, spritesheetNature);
      await sheet.parse();
      setTextures(sheet.textures);
    })();
  }, []);

  if (!textures.treeSingle) {
    return null;
  }

  return (
    <Sprite
      name={props.id}
      texture={textures.treeSingle}
      width={props.size}
      height={props.size}
      x={props.x}
      y={props.y}
      anchor={0.5}
    />
  );
};

export default TreeSingle;
