import { useCallback, useContext, useMemo, useState } from "react";
import { BattleContext, Types } from "../../contexts/battle";
import { Graphics } from "@pixi/react";
import { Rectangle } from "pixi.js";
import { useFX } from "../../hooks/useFx";

type Props = {};

type TileProps = {
  x: number;
  y: number;
  baseColor: number;
  activeColor: number;
  active: boolean;
  onClick: () => void;
};

const Tile = (tileProps: TileProps) => {
  const { baseColor, activeColor, x, y, active, onClick } = tileProps;

  const [tileHovered, setTileHovered] = useState(false);
  const [alpha, setAlpha] = useState(0.6);

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(tileHovered ? activeColor : baseColor, 1);
        g.drawRect(x, y, 16, 16);
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

const BattleTile = (_props: Props) => {
  const { state, dispatch } = useContext(BattleContext);
  const { effectHit } = useFX();

  const player = state.player_stats[state.turn[0]];
  const { x, y, id } = player;

  const tileRectangles = useMemo(() => {
    const rects = [];
    rects.push(new Rectangle(x, y - 16, 16, 16));
    rects.push(new Rectangle(x + 16, y, 16, 16));
    rects.push(new Rectangle(x, y + 16, 16, 16));
    rects.push(new Rectangle(x - 16, y, 16, 16));
    return rects;
  }, [x, y]);
  const bounded = useMemo(() => {
    const bound: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    } = {};

    const otherPlayers = Object.values(state.player_stats).filter(
      (c) => c.id !== id
    );
    tileRectangles.forEach((r, i) => {
      otherPlayers.forEach((op) => {
        const opRectangle = new Rectangle(op.x, op.y, 16, 16);
        if (r.intersects(opRectangle)) {
          switch (i) {
            case 0:
              bound.top = op.id;
              break;
            case 1:
              bound.right = op.id;
              break;
            case 2:
              bound.bottom = op.id;
              break;
            case 3:
              bound.left = op.id;
              break;
            default:
              break;
          }
        }
      });
    });
    return bound;
  }, [id, x, y, state.player_stats, tileRectangles]);
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
        active={active}
        activeColor={bounded.top ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x}
        y={y - 16}
        onClick={bounded.top ? handleHit(bounded.top) : handleMove(x, y - 16)}
      />
      <Tile
        active={active}
        activeColor={bounded.right ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x + 16}
        y={y}
        onClick={
          bounded.right ? handleHit(bounded.right) : handleMove(x + 16, y)
        }
      />
      <Tile
        active={active}
        activeColor={bounded.bottom ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x}
        y={y + 16}
        onClick={
          bounded.bottom ? handleHit(bounded.bottom) : handleMove(x, y + 16)
        }
      />
      <Tile
        active={active}
        activeColor={bounded.left ? 0xe74c3c : 0x8e44ad}
        baseColor={0x58d68d}
        x={x - 16}
        y={y}
        onClick={bounded.left ? handleHit(bounded.left) : handleMove(x - 16, y)}
      />
    </>
  );
};

export default BattleTile;
