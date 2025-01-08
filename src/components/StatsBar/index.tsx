import { useGameCoreContext } from "@/contexts/gameCoreContext";
import StatsBarItem from "../StatsBarItem";
import { useAppConfig } from "@/contexts/appConfig";
import { useMemo } from "react";
import RollingNumber from "../RollingNumbers";

function StatsBar() {
  const {
    config: { perTurnResourceProduction },
  } = useAppConfig();
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
