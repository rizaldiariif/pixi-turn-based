import { useEffect, useState } from "react";
import { TilingSprite } from "@pixi/react";
import { Assets, Resource, Spritesheet, Texture } from "pixi.js";
import spritesheetFloor from "../sprites/backgrounds/tilesets/floor.json";

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  tileSize: number;
};

const defaultSpriteSize = 16;

const Floor = (props: Props) => {
  const { width: w, height: h, x, y, tileSize: s } = props;

  const [textures, setTextures] = useState<
    Record<string | number, Texture<Resource>>
  >({});

  useEffect(() => {
    (async () => {
      const texture = await Assets.load(
        "/assets/ninja-adventure/backgrounds/tilesets/tileset-floor.png"
      );
      const sheet = new Spritesheet(texture, {
        ...spritesheetFloor,
        meta: {
          ...spritesheetFloor.meta,
          scale: `${defaultSpriteSize / s}`,
        },
      });
      await sheet.parse();
      setTextures(sheet.textures);
    })();
  }, [s]);

  if (!textures.centerCenter) {
    return null;
  }

  return (
    <>
      {/* wide center */}
      <TilingSprite
        texture={textures.centerCenter}
        width={s * w - s}
        height={s * h - s}
        tilePosition={{ x: 0, y: 0 }}
        tileScale={{ x: 1, y: 1 }}
        x={x + s}
        y={y + s}
      />

      {/* border top */}
      <TilingSprite
        texture={textures.topLeft}
        width={s}
        height={s}
        tilePosition={{ x: 0, y: 0 }}
        tileScale={{ x: 1, y: 1 }}
        x={x}
        y={y}
      />
      <TilingSprite
        texture={textures.topCenter}
        width={s * (w - 1)}
        height={s}
        tilePosition={{ x: 0, y: 0 }}
        x={x + s}
        y={y}
      />
      <TilingSprite
        texture={textures.topRight}
        width={s}
        height={s}
        tilePosition={{ x: 0, y: 0 }}
        x={x + s * w}
        y={y}
      />

      {/* border left and right */}
      <TilingSprite
        texture={textures.centerLeft}
        width={s}
        height={s * h - s}
        tilePosition={{ x: 0, y: 0 }}
        x={x}
        y={y + s}
      />
      <TilingSprite
        texture={textures.centerRight}
        width={s}
        height={s * h - s}
        tilePosition={{ x: 0, y: 0 }}
        x={x + s * w}
        y={y + s}
      />

      {/* border bottom */}
      <TilingSprite
        texture={textures.bottomLeft}
        width={s}
        height={s}
        tilePosition={{ x: 0, y: 0 }}
        x={x}
        y={y + s * h}
      />
      <TilingSprite
        texture={textures.bottomCenter}
        width={s * w - s}
        height={s}
        tilePosition={{ x: 0, y: 0 }}
        x={x + s}
        y={y + s * h}
      />
      <TilingSprite
        texture={textures.bottomRight}
        width={s}
        height={s}
        tilePosition={{ x: 0, y: 0 }}
        x={x + s * w}
        y={y + s * h}
      />

      {/* <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xe74c3c, 1);
          g.drawRect(x, y, s * w + s, s);
          g.endFill();
        }}
      />

      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xe74c3c, 1);
          g.drawRect(x + s * w, y + s, s, s * h - s);
          g.endFill();
        }}
      />

      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xe74c3c, 1);
          g.drawRect(x, y + s * h, s * w + s, s);
          g.endFill();
        }}
      />

      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xe74c3c, 1);
          g.drawRect(x, y + s, s, s * h - s);
          g.endFill();
        }}
      /> */}
    </>
  );
};

export default Floor;
