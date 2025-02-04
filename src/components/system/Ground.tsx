import { useEffect, useState } from "react";
import { TilingSprite } from "@pixi/react";
import { Assets, Resource, Spritesheet, Texture } from "pixi.js";
import spritesheetField from "../sprites/backgrounds/tilesets/field.json";

type Props = {};

const Ground = (_props: Props) => {
  const [textures, setTextures] = useState<
    Record<string | number, Texture<Resource>>
  >({});

  useEffect(() => {
    (async () => {
      const texture = await Assets.load(
        "/assets/ninja-adventure/backgrounds/tilesets/tileset-field.png"
      );
      const sheet = new Spritesheet(texture, spritesheetField);
      await sheet.parse();
      setTextures(sheet.textures);
    })();
  }, []);

  if (!textures.centerCenter) {
    return null;
  }

  return (
    <>
      {/* wide center */}
      <TilingSprite
        texture={textures.centerCenter}
        width={800 - 32}
        height={600 - 32}
        tilePosition={{ x: 0, y: 0 }}
        tileScale={{ x: 1, y: 1 }}
        x={16}
        y={16}
      />

      {/* border top */}
      <TilingSprite
        texture={textures.topLeft}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={0}
        y={0}
      />
      <TilingSprite
        texture={textures.topCenter}
        width={800 - 32}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={16}
        y={0}
      />
      <TilingSprite
        texture={textures.topRight}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={800 - 16}
        y={0}
      />

      {/* border left and right */}
      <TilingSprite
        texture={textures.centerLeft}
        width={16}
        height={600 - 32}
        tilePosition={{ x: 0, y: 0 }}
        x={0}
        y={16}
      />
      <TilingSprite
        texture={textures.centerRight}
        width={16}
        height={600 - 32}
        tilePosition={{ x: 0, y: 0 }}
        x={800 - 16}
        y={16}
      />

      {/* border bottom */}
      <TilingSprite
        texture={textures.bottomLeft}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={0}
        y={600 - 16}
      />
      <TilingSprite
        texture={textures.bottomCenter}
        width={800 - 32}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={16}
        y={600 - 16}
      />
      <TilingSprite
        texture={textures.bottomRight}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={800 - 16}
        y={600 - 16}
      />
    </>
  );
};

export default Ground;
