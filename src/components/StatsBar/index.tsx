import { useGameCoreContext } from "@/contexts/gameCoreContext";
import StatsBarItem from "../StatsBarItem";
import { useAppConfig } from "@/contexts/appConfig";
import { useMemo } from "react";

function StatsBar() {
  const {
    config: { perTurnResourceProduction },
  } = useAppConfig();
  const {
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
      <div className="absolute top-3 flex  shadow-filter-flat px-10">
        <StatsBarItem
          amount={wood!}
          amountPerTurn={woodPerTurn!}
          resource={"wood"}
          showPerTurn={perTurnResourceProduction!}
          isActive={resourceInUse === "wood"}
          onClick={() => setTilePlaceActiveResource("wood")}
        />
        <div className=" mx-2" />
        <StatsBarItem
          amount={stone!}
          amountPerTurn={stonePerTurn!}
          resource={"stone"}
          showPerTurn={perTurnResourceProduction!}
          isActive={resourceInUse === "stone"}
          onClick={() => setTilePlaceActiveResource("stone")}
        />
        <div className=" mx-2" />
        <StatsBarItem
          amount={food!}
          amountPerTurn={foodPerTurn!}
          resource={"food"}
          showPerTurn={perTurnResourceProduction!}
          isActive={resourceInUse === "food"}
          onClick={() => setTilePlaceActiveResource("food")}
        />
        <div className=" mx-2" />
        <StatsBarItem
          amount={money!}
          amountPerTurn={moneyPerTurn!}
          resource={"gold"}
          showPerTurn={perTurnResourceProduction!}
          isActive={resourceInUse === "gold"}
          onClick={() => setTilePlaceActiveResource("gold")}
        />
      </div>
    </div>
  );
}

export default StatsBar;
