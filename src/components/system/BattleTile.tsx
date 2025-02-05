import { useCallback, useContext, useMemo, useState } from "react";
import { BattleContext, Types } from "../../contexts/battle";
import { Graphics } from "@pixi/react";
import { Rectangle } from "pixi.js";
import { useFX } from "../../hooks/useFx";

type Props = {
  size: number;
};

type TileProps = {
  x: number;
  y: number;
  size: number;
  baseColor: number;
  activeColor: number;
  active: boolean;
  onClick: () => void;
};

const Tile = (tileProps: TileProps) => {
  const { baseColor, activeColor, x, y, active, onClick, size: s } = tileProps;

  const [tileHovered, setTileHovered] = useState(false);
  const [alpha, setAlpha] = useState(0.6);

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(tileHovered ? activeColor : baseColor, 1);
        g.drawRect(x, y, s, s);
        g.endFill();
      }}
      interactive={true}
      onmouseenter={() => {
        setAlpha(1);
        setTileHovered(true);
      }}
      onmouseleave={() => {
        setAlpha(0.6);
        setTileHovered(false);
      }}
      onclick={onClick}
      renderable={active}
      alpha={alpha}
    />
  );
};

const BattleTile = (props: Props) => {
  const { size: s } = props;

  const { state, dispatch } = useContext(BattleContext);
  const { effectHit } = useFX();

  const player = state.player_stats[state.turn[0]];
  const { x, y, id } = player;

  const tileRectangles = useMemo(() => {
    const rects = [];
    rects.push(new Rectangle(x, y - s, s, s));
    rects.push(new Rectangle(x + s, y, s, s));
    rects.push(new Rectangle(x, y + s, s, s));
    rects.push(new Rectangle(x - s, y, s, s));
    return rects;
  }, [x, y]);
  const bounded = useMemo(() => {
    const bound: {
      top?: {
        target_id: string;
        type: "player" | "object";
        collision: boolean;
      };
      right?: {
        target_id: string;
        type: "player" | "object";
        collision: boolean;
      };
      bottom?: {
        target_id: string;
        type: "player" | "object";
        collision: boolean;
      };
      left?: {
        target_id: string;
        type: "player" | "object";
        collision: boolean;
      };
    } = {};

    const otherPlayers = Object.values(state.player_stats).filter(
      (c) => c.id !== id
    );
    tileRectangles.forEach((r, i) => {
      otherPlayers.forEach((op) => {
        const opRectangle = new Rectangle(op.x, op.y, s, s);
        if (r.intersects(opRectangle)) {
          switch (i) {
            case 0:
              bound.top = {
                target_id: op.id,
                type: "player",
                collision: true,
              };
              break;
            case 1:
              bound.right = {
                target_id: op.id,
                type: "player",
                collision: true,
              };
              break;
            case 2:
              bound.bottom = {
                target_id: op.id,
                type: "player",
                collision: true,
              };
              break;
            case 3:
              bound.left = {
                target_id: op.id,
                type: "player",
                collision: true,
              };
              break;
            default:
              break;
          }
        }
      });
      state.mapObjects.forEach((o) => {
        const opRectangle = new Rectangle(
          o.x - o.size / 2,
          o.y,
          o.size,
          o.size / 2
        );
        if (r.intersects(opRectangle)) {
          switch (i) {
            case 0:
              bound.top = {
                target_id: o.id,
                type: "object",
                collision: o.collision,
              };
              break;
            case 1:
              bound.right = {
                target_id: o.id,
                type: "object",
                collision: o.collision,
              };
              break;
            case 2:
              bound.bottom = {
                target_id: o.id,
                type: "object",
                collision: o.collision,
              };
              break;
            case 3:
              bound.left = {
                target_id: o.id,
                type: "object",
                collision: o.collision,
              };
              break;
            default:
              break;
          }
        }
      });
    });
    return bound;
  }, [id, x, y, state.player_stats, tileRectangles, state.mapObjects, s]);
  const active = state?.turn[0] === id;
  const handleMove = useCallback(
    (toX: number, toY: number) => () => {
      dispatch({ type: Types.PLAYER_WALK, payload: { id, x: toX, y: toY } });
    },
    [dispatch, id]
  );
  const handleHit = useCallback(
    (target_id: string) => () => {
      const target = state.player_stats[target_id];
      effectHit({ x: target.x, y: target.y });
      setTimeout(() => {
        dispatch({
          type: Types.PLAYER_ATTACK,
          payload: { actor_id: id, target_id },
        });
      }, 500);
    },
    [dispatch, id, state.player_stats]
  );

  return (
    <>
      <Tile
        active={
          active &&
          (bounded.top === undefined || bounded?.top.type === "player")
        }
        activeColor={bounded.top ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x}
        y={y - s}
        onClick={
          bounded.top ? handleHit(bounded.top.target_id) : handleMove(x, y - s)
        }
        size={s}
      />
      <Tile
        active={
          active &&
          (bounded.right === undefined || bounded?.right.type === "player")
        }
        activeColor={bounded.right ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x + s}
        y={y}
        onClick={
          bounded.right
            ? handleHit(bounded.right.target_id)
            : handleMove(x + s, y)
        }
        size={s}
      />
      <Tile
        active={
          active &&
          (bounded.bottom === undefined || bounded?.bottom.type === "player")
        }
        activeColor={bounded.bottom ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x}
        y={y + s}
        onClick={
          bounded.bottom
            ? handleHit(bounded.bottom.target_id)
            : handleMove(x, y + s)
        }
        size={s}
      />
      <Tile
        active={
          active &&
          (bounded.left === undefined || bounded?.left.type === "player")
        }
        activeColor={bounded.left ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x - s}
        y={y}
        onClick={
          bounded.left && bounded.left.type === "player"
            ? handleHit(bounded.left.target_id)
            : handleMove(x - s, y)
        }
        size={s}
      />
    </>
  );
};

export default BattleTile;
