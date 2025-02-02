import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatedSprite as AnimatedSpriteClass,
  Assets,
  FederatedEventHandler,
  FederatedPointerEvent,
  ISpritesheetData,
  Rectangle,
  Resource,
  Spritesheet,
  Texture,
} from "pixi.js";
import {
  Container,
  AnimatedSprite,
  Graphics,
  useTick,
  useApp,
} from "@pixi/react";
import { Sound } from "@pixi/sound";
import { TurnContext, Types } from "./App";

const spriteJSON = {
  boy: {
    frames: {
      walkDown1: {
        frame: { x: 0, y: 0, w: 16, h: 16 },
      },
      walkDown2: {
        frame: { x: 0, y: 17, w: 16, h: 16 },
      },
      walkDown3: {
        frame: { x: 0, y: 33, w: 16, h: 16 },
      },
      walkDown4: {
        frame: { x: 0, y: 49, w: 16, h: 16 },
      },
      walkUp1: {
        frame: { x: 17, y: 0, w: 16, h: 16 },
      },
      walkUp2: {
        frame: { x: 17, y: 17, w: 16, h: 16 },
      },
      walkUp3: {
        frame: { x: 17, y: 33, w: 16, h: 16 },
      },
      walkUp4: {
        frame: { x: 17, y: 49, w: 16, h: 16 },
      },
      walkLeft1: {
        frame: { x: 33, y: 0, w: 16, h: 16 },
      },
      walkLeft2: {
        frame: { x: 33, y: 17, w: 16, h: 16 },
      },
      walkLeft3: {
        frame: { x: 33, y: 33, w: 16, h: 16 },
      },
      walkLeft4: {
        frame: { x: 33, y: 49, w: 16, h: 16 },
      },
      walkRight1: {
        frame: { x: 49, y: 0, w: 15, h: 15 },
      },
      walkRight2: {
        frame: { x: 49, y: 17, w: 15, h: 15 },
      },
      walkRight3: {
        frame: { x: 49, y: 33, w: 15, h: 15 },
      },
      walkRight4: {
        frame: { x: 49, y: 49, w: 15, h: 15 },
      },
    },
    animations: {
      walkDown: ["walkDown1", "walkDown2", "walkDown3", "walkDown4"],
      walkUp: ["walkUp1", "walkUp2", "walkUp3", "walkUp4"],
      walkLeft: ["walkLeft1", "walkLeft2", "walkLeft3", "walkLeft4"],
      walkRight: ["walkRight1", "walkRight2", "walkRight3", "walkRight4"],
    },
    meta: {
      image: "/assets/ninja-adventure/actor/characters/boy/spritesheet.png",
      scale: "1",
    },
  },
  ["camouflage-green"]: {
    frames: {
      walkDown1: {
        frame: { x: 0, y: 0, w: 16, h: 16 },
      },
      walkDown2: {
        frame: { x: 0, y: 17, w: 16, h: 16 },
      },
      walkDown3: {
        frame: { x: 0, y: 33, w: 16, h: 16 },
      },
      walkDown4: {
        frame: { x: 0, y: 49, w: 16, h: 16 },
      },
      walkUp1: {
        frame: { x: 17, y: 0, w: 16, h: 16 },
      },
      walkUp2: {
        frame: { x: 17, y: 17, w: 16, h: 16 },
      },
      walkUp3: {
        frame: { x: 17, y: 33, w: 16, h: 16 },
      },
      walkUp4: {
        frame: { x: 17, y: 49, w: 16, h: 16 },
      },
      walkLeft1: {
        frame: { x: 33, y: 0, w: 16, h: 16 },
      },
      walkLeft2: {
        frame: { x: 33, y: 17, w: 16, h: 16 },
      },
      walkLeft3: {
        frame: { x: 33, y: 33, w: 16, h: 16 },
      },
      walkLeft4: {
        frame: { x: 33, y: 49, w: 16, h: 16 },
      },
      walkRight1: {
        frame: { x: 49, y: 0, w: 15, h: 15 },
      },
      walkRight2: {
        frame: { x: 49, y: 17, w: 15, h: 15 },
      },
      walkRight3: {
        frame: { x: 49, y: 33, w: 15, h: 15 },
      },
      walkRight4: {
        frame: { x: 49, y: 49, w: 15, h: 15 },
      },
    },
    animations: {
      walkDown: ["walkDown1", "walkDown2", "walkDown3", "walkDown4"],
      walkUp: ["walkUp1", "walkUp2", "walkUp3", "walkUp4"],
      walkLeft: ["walkLeft1", "walkLeft2", "walkLeft3", "walkLeft4"],
      walkRight: ["walkRight1", "walkRight2", "walkRight3", "walkRight4"],
    },
    meta: {
      image:
        "/assets/ninja-adventure/actor/characters/camouflage-green/spritesheet.png",
      scale: "1",
    },
  },
  slash: {
    frames: {
      frame1: {
        frame: { x: 0, y: 0, w: 32, h: 32 },
      },
      frame2: {
        frame: { x: 33, y: 0, w: 32, h: 32 },
      },
      frame3: {
        frame: { x: 65, y: 0, w: 32, h: 32 },
      },
      frame4: {
        frame: { x: 97, y: 0, w: 31, h: 31 },
      },
    },
    animations: {
      slash: ["frame1", "frame2", "frame3", "frame4"],
    },
    meta: {
      image: "/assets/ninja-adventure/fx/slash/spritesheet.png",
      scale: "1",
    },
  },
};

type Props = {
  id: string;
  x: number;
  y: number;
  type: "boy" | "camouflage-green";
};

type AnimationState = "walkUp" | "walkRight" | "walkDown" | "walkLeft";
type Animations = Record<
  keyof NonNullable<ISpritesheetData["animations"]>,
  Texture[]
>;
type TileType = "move" | "attack";

const MovementTile = (props: {
  x: number;
  y: number;
  onclick: FederatedEventHandler<FederatedPointerEvent>;
  renderable: boolean;
  type: TileType;
  target_id?: string;
}) => {
  const { x, y, onclick, renderable } = props;
  const [tileActive, setTileActive] = useState(false);
  const [alpha, setAlpha] = useState(0.6);
  const activeColor = useMemo(() => {
    switch (props.type) {
      case "move":
        return 0x8e44ad;
      case "attack":
        return 0xe74c3c;
      default:
        return 0x8e44ad;
    }
  }, [props.type]);

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(tileActive ? activeColor : 0x58d68d, 1);
        g.drawRect(x, y, 16, 16);
        g.endFill();
      }}
      interactive={true}
      onmouseenter={() => {
        setAlpha(1);
        setTileActive(true);
      }}
      onmouseleave={() => {
        setAlpha(0.6);
        setTileActive(false);
      }}
      onclick={onclick}
      renderable={renderable}
      alpha={alpha}
    />
  );
};

const Player = (props: Props) => {
  const { state, dispatch } = useContext(TurnContext);
  const app = useApp();
  let refSlash = useRef<AnimatedSpriteClass>();

  // handle player position
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const [active, setActive] = useState(false);
  const [slashPlay, setSlashPlay] = useState(true);

  const triggerSlash = useCallback(
    (coordX: number, coordY: number) => {
      if (refSlash.current) {
        refSlash.current.x = coordX;
        refSlash.current.y = coordY;
        setSlashPlay(true);
        Sound.from({
          url: "/assets/ninja-adventure/sounds/game/hit.wav",
          volume: 0.25,
        }).play();
      }
    },
    [setSlashPlay, refSlash]
  );

  // handle sprite groupings
  const [animations, setAnimations] = useState<Animations>({});
  const [animationState, setAnimationState] =
    useState<AnimationState>("walkDown");
  const [animationSlash, setAnimationSlash] = useState<
    Texture<Resource>[] | null
  >(null);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const texture = await Assets.load(
          `/assets/ninja-adventure/actor/characters/${props.type}/spritesheet.png`
        );
        const sheet = new Spritesheet(texture, spriteJSON[props.type]);
        await sheet.parse();
        setAnimations(sheet.animations);

        const textureSlash = await Assets.load(
          "/assets/ninja-adventure/fx/slash/slash/spritesheet.png"
        );
        const sheetSlash = new Spritesheet(textureSlash, spriteJSON.slash);
        await sheetSlash.parse();
        setAnimationSlash(sheetSlash.animations.slash);

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

  useEffect(() => {
    dispatch({ type: Types.SYSTEM_ADD_PLAYER, payload: { id: props.id } });
  }, [dispatch]);

  useTick(() => {
    if (!active && state.turn[0] === props.id) {
      setActive(true);
      const currentObject = app.stage.getChildByName(props.id, true);
      if (currentObject) {
        app.stage.setChildIndex(currentObject, app.stage.children.length - 1);
        app.stage.setChildIndex(
          refSlash.current!,
          app.stage.children.length - 1
        );
      }
    } else if (active && state.turn[0] !== props.id) {
      setActive(false);
    }
  });

  const tileHandler = useCallback(
    (type: "attack" | "move", name: AnimationState) => () => {
      setAnimationState(name);
      switch (name) {
        case "walkUp":
          if (type === "move") {
            setY(y - 16);
          }
          if (type === "attack") {
            triggerSlash(x, y - 16);
          }
          break;
        case "walkRight":
          if (type === "move") {
            setX(x + 16);
          }
          if (type === "attack") {
            triggerSlash(x + 16, y);
          }
          break;
        case "walkDown":
          if (type === "move") {
            setY(y + 16);
          }
          if (type === "attack") {
            triggerSlash(x, y + 16);
          }
          break;
        case "walkLeft":
          if (type === "move") {
            setX(x - 16);
          }
          if (type === "attack") {
            triggerSlash(x - 16, y);
          }
          break;
        default:
          break;
      }
      setTimeout(
        () => {
          dispatch({ type: Types.PLAYER_WALK, payload: { id: props.id } });
        },
        type === "attack" ? 500 : 0
      );
    },
    [x, y, setX, setY, setAnimations, dispatch, props.id, triggerSlash]
  );

  if (!animations[animationState] || !animationSlash) {
    return null;
  }

  const otherPlayers = app.stage.children.filter(
    (c) => c.name && c.name.includes("player") && c.name !== props.id
  );
  const bound: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  } = {};
  otherPlayers.forEach((p) => {
    const boundTop = p.getBounds().intersects(new Rectangle(x, y - 16, 16, 16));
    const boundRight = p
      .getBounds()
      .intersects(new Rectangle(x + 16, y, 16, 16));
    const boundBottom = p
      .getBounds()
      .intersects(new Rectangle(x, y + 16, 16, 16));
    const boundLeft = p
      .getBounds()
      .intersects(new Rectangle(x - 16, y, 16, 16));
    if (boundTop) {
      bound.top = p.name as string;
    }
    if (boundRight) {
      bound.right = p.name as string;
    }
    if (boundBottom) {
      bound.bottom = p.name as string;
    }
    if (boundLeft) {
      bound.left = p.name as string;
    }
  });

  return (
    <>
      <MovementTile
        x={x}
        y={y - 16}
        onclick={tileHandler(bound.top ? "attack" : "move", "walkUp")}
        renderable={active}
        type={bound.top ? "attack" : "move"}
        target_id={bound.top}
      />
      <MovementTile
        x={x + 16}
        y={y}
        onclick={tileHandler(bound.right ? "attack" : "move", "walkRight")}
        renderable={active}
        type={bound.right ? "attack" : "move"}
        target_id={bound.right}
      />
      <MovementTile
        x={x}
        y={y + 16}
        onclick={tileHandler(bound.bottom ? "attack" : "move", "walkDown")}
        renderable={active}
        type={bound.bottom ? "attack" : "move"}
        target_id={bound.bottom}
      />
      <MovementTile
        x={x - 16}
        y={y}
        onclick={tileHandler(bound.left ? "attack" : "move", "walkLeft")}
        renderable={active}
        type={bound.left ? "attack" : "move"}
        target_id={bound.left}
      />

      <Container
        name={props.id}
        x={x}
        y={y}
        anchor={0.5}
        width={16}
        height={16}
        renderId={Math.ceil(Math.random() * 100)}
        zIndex={1}
        interactive={active}
        onclick={() => {
          dispatch({ type: Types.PLAYER_WALK, payload: { id: props.id } });
        }}
      >
        {Object.entries(animations).map(([animationName, textures]) => (
          <AnimatedSprite
            key={animationName}
            isPlaying={active}
            initialFrame={0}
            animationSpeed={0.15}
            textures={textures}
            renderable={animationName === animationState}
          />
        ))}
      </Container>

      <AnimatedSprite
        isPlaying={slashPlay}
        initialFrame={0}
        animationSpeed={0.15}
        textures={animationSlash}
        renderable={slashPlay}
        width={16}
        height={16}
        loop={false}
        onComplete={() => {
          setSlashPlay(false);
        }}
        zIndex={2}
        ref={(a) => {
          if (a) {
            refSlash.current = a;
          }
        }}
      />
    </>
  );
};

export default Player;
