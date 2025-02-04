import { useEffect, useState } from "react";
import { TilingSprite } from "@pixi/react";
import {
  Assets,
  Resource,
  Spritesheet,
  SpriteSheetJson,
  Texture,
} from "pixi.js";

type Props = {};

const Ground = (_props: Props) => {
  const [tiles, setTiles] = useState<Texture<Resource>[]>([]);

  useEffect(() => {
    (async () => {
      const atlas: SpriteSheetJson = {
        frames: {
          brownTopLeft: {
            frame: {
              x: 0,
              y: 0,
              w: 16,
              h: 16,
            },
          },
          brownTopMiddle: {
            frame: {
              x: 16,
              y: 0,
              w: 16,
              h: 16,
            },
          },
          brownTopRight: {
            frame: {
              x: 32,
              y: 0,
              w: 16,
              h: 16,
            },
          },
          brownMiddleLeft: {
            frame: {
              x: 0,
              y: 16,
              w: 16,
              h: 16,
            },
          },
          brownMiddleMiddle: {
            frame: {
              x: 16,
              y: 16,
              w: 16,
              h: 16,
            },
          },
          brownMiddleRight: {
            frame: {
              x: 32,
              y: 16,
              w: 16,
              h: 16,
            },
          },
          brownBottomLeft: {
            frame: {
              x: 0,
              y: 32,
              w: 16,
              h: 16,
            },
          },
          brownBottomMiddle: {
            frame: {
              x: 16,
              y: 32,
              w: 16,
              h: 16,
            },
          },
          brownBottomRight: {
            frame: {
              x: 32,
              y: 32,
              w: 16,
              h: 16,
            },
          },
        },
        meta: {
          image:
            "/assets/ninja-adventure/backgrounds/tilesets/tileset-field.png",
          scale: "1",
        },
      };

      const texture = await Assets.load(
        "/assets/ninja-adventure/backgrounds/tilesets/tileset-field.png"
      );
      const sheet = new Spritesheet(texture, atlas);
      await sheet.parse();
      const textures = Object.values(sheet.textures);
      setTiles(textures);
    })();
  }, []);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <>
      {/* wide center */}
      <TilingSprite
        texture={tiles[4]}
        width={800 - 32}
        height={600 - 32}
        tilePosition={{ x: 0, y: 0 }}
        tileScale={{ x: 1, y: 1 }}
        x={16}
        y={16}
      />

      {/* border top */}
      <TilingSprite
        texture={tiles[0]}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={0}
        y={0}
      />
      <TilingSprite
        texture={tiles[1]}
        width={800 - 32}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={16}
        y={0}
      />
      <TilingSprite
        texture={tiles[2]}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={800 - 16}
        y={0}
      />

      {/* border left and right */}
      <TilingSprite
        texture={tiles[3]}
        width={16}
        height={600 - 32}
        tilePosition={{ x: 0, y: 0 }}
        x={0}
        y={16}
      />
      <TilingSprite
        texture={tiles[5]}
        width={16}
        height={600 - 32}
        tilePosition={{ x: 0, y: 0 }}
        x={800 - 16}
        y={16}
      />

      {/* border bottom */}
      <TilingSprite
        texture={tiles[6]}
        width={16}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={0}
        y={600 - 16}
      />
      <TilingSprite
        texture={tiles[7]}
        width={800 - 32}
        height={16}
        tilePosition={{ x: 0, y: 0 }}
        x={16}
        y={600 - 16}
      />
      <TilingSprite
        texture={tiles[8]}
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
