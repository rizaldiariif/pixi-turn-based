import { AnimatedSprite } from "@pixi/react";
import { useContext } from "react";
import { BattleContext, Types } from "../../contexts/battle";

type Props = {};

const FX = (_props: Props) => {
  const {
    state: { effect },
    dispatch,
  } = useContext(BattleContext);

  if (!effect) {
    return null;
  }

  return (
    <AnimatedSprite
      x={effect?.x || 0}
      y={effect?.y || 0}
      isPlaying={effect?.playing || false}
      initialFrame={0}
      animationSpeed={0.15}
      textures={effect?.textures}
      renderable={effect?.playing || false}
      width={16}
      height={16}
      loop={false}
      onComplete={() => {
        dispatch({ type: Types.EFFECT_STOP, payload: null });
      }}
    />
  );
};

export default FX;
