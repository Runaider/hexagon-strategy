import { useGameCoreContext } from "@/contexts/gameCoreContext";
import StatsBarItem from "../StatsBarItem";
import { useAppConfig } from "@/contexts/appConfig";
import { useMemo, useRef } from "react";
import RollingNumber from "../RollingNumbers";
import { motion } from "framer-motion";
import { useResourceIconAnimationContext } from "@/contexts/resourceIconAnimationContext";

function StatsBar() {
  const {
    config: { perTurnResourceProduction },
  } = useAppConfig();

  const {
    setEndFoodRef,
    setEndGoldRef,
    setEndStoneRef,
    setEndWoodRef,
  } = useResourceIconAnimationContext();
  const woodEndRef = useRef<HTMLDivElement | null>(null);
  const stoneEndRef = useRef<HTMLDivElement | null>(null);
  const foodEndRef = useRef<HTMLDivElement | null>(null);
  const goldEndRef = useRef<HTMLDivElement | null>(null);

  const {
    currentTurn,
    resources: { wood, stone, food, gold: money },
    resourcesPerTurn: {
      wood: woodPerTurn,
      stone: stonePerTurn,
      food: foodPerTurn,
      gold: moneyPerTurn,
    },
    tilePlaceResourcePrice,
    setTilePlaceActiveResource,
  } = useGameCoreContext();

  const resourceInUse = useMemo(
    () => Object.keys(tilePlaceResourcePrice)[0] as ResourceNames,
    [tilePlaceResourcePrice]
  );
  return (
    <div className="w-screen h-10 bg-background-primary">
      <div className="absolute top-3 flex  shadow-filter-flat px-3">
        <motion.div
          initial={{ translateY: -50 }}
          animate={{
            translateY: [-50, 15, 0],
          }}
          transition={{ duration: 0.5 }}
          ref={(ref) => {
            woodEndRef.current = ref;
            setEndWoodRef(woodEndRef);
          }}
        >
          <StatsBarItem
            amount={wood!}
            amountPerTurn={woodPerTurn!}
            resource={"wood"}
            showPerTurn={perTurnResourceProduction!}
            isActive={resourceInUse === "wood"}
            onClick={() => setTilePlaceActiveResource("wood")}
          />
        </motion.div>
        <div className=" mx-2" />
        <motion.div
          initial={{ translateY: -50 }}
          animate={{
            translateY: [-50, 15, 0],
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
          ref={(ref) => {
            stoneEndRef.current = ref;
            setEndStoneRef(stoneEndRef);
          }}
        >
          <StatsBarItem
            amount={stone!}
            amountPerTurn={stonePerTurn!}
            resource={"stone"}
            showPerTurn={perTurnResourceProduction!}
            isActive={resourceInUse === "stone"}
            onClick={() => setTilePlaceActiveResource("stone")}
          />
        </motion.div>
        <div className=" mx-2" />
        <motion.div
          initial={{ translateY: -50 }}
          animate={{
            translateY: [-50, 15, 0],
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={(ref) => {
            foodEndRef.current = ref;
            setEndFoodRef(foodEndRef);
          }}
        >
          <StatsBarItem
            amount={food!}
            amountPerTurn={foodPerTurn!}
            resource={"food"}
            showPerTurn={perTurnResourceProduction!}
            isActive={resourceInUse === "food"}
            onClick={() => setTilePlaceActiveResource("food")}
          />
        </motion.div>
        <div className=" mx-2" />
        <motion.div
          initial={{ translateY: -50 }}
          animate={{
            translateY: [-50, 15, 0],
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          ref={(ref) => {
            goldEndRef.current = ref;
            setEndGoldRef(goldEndRef);
          }}
        >
          <StatsBarItem
            amount={money!}
            amountPerTurn={moneyPerTurn!}
            resource={"gold"}
            showPerTurn={perTurnResourceProduction!}
            isActive={resourceInUse === "gold"}
            onClick={() => setTilePlaceActiveResource("gold")}
          />
        </motion.div>
      </div>
      <div className={"absolute top-3 right-3"}>
        <div className="p-2 bg-background-secondary  clipped-corner-medium">
          <div className="flex justify-between items-center min-w-[60px]">
            <div className=" font-bold text-lg">Turn:</div>
            <div className="w-2" />
            <div className="mr-1 font-bold text-lg">
              <RollingNumber value={currentTurn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
