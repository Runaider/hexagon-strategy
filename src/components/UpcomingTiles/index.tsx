import { useAppConfig } from "@/contexts/appConfig";
import { useGameCoreContext } from "@/contexts/gameCoreContext";
import classNames from "classnames";
import HexagonTile from "../HexagonTile";
import { useCallback, useEffect } from "react";
import useTileCostTracker from "@/hooks/useTileCostTracker";
import ResourceIcon from "../ResourceIcon";
import RollingNumber from "../RollingNumbers";

function UpcomingTiles() {
  const {
    config: { previewTileCount, perTurnResourceProduction, actionPrices },
  } = useAppConfig();

  const {
    upcomingTiles,
    nextTileIndex,
    tilePlaceResourcePrice,
    canPriceBePaid,
    setNextTileIndex,
    payPrice,
    shuffleTiles,
    rotateUpcomingTile,
  } = useGameCoreContext();

  const resourceAmount =
    tilePlaceResourcePrice[
      Object.keys(tilePlaceResourcePrice)[0] as ResourceNames
    ];
  const resourceName = Object.keys(tilePlaceResourcePrice)[0] as ResourceNames;

  const onShuffleClick = () => {
    if (!canPriceBePaid(actionPrices!.redrawUpcomingHexes!)) {
      return;
    }
    payPrice(actionPrices!.redrawUpcomingHexes!);
    shuffleTiles();
  };

  const onUpcomingTileClick = (index: number) => {
    setNextTileIndex(index);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "r") {
        rotateUpcomingTile();
      }
    },
    [rotateUpcomingTile]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className=" flex flex-col items-center w-screen h-10 bg-background-primary">
      <div className="relative flex items-center justify-center shadow-filter-flat">
        <div className="absolute flex items-center z-20 top-[-110px] right-[-170px] px-2 py-1 clipped-corner-medium bg-background-primary text-text-primary text-xl font-bold">
          {/* {resourceAmount}{" "} */}
          <RollingNumber value={resourceAmount!} />
          <span className="ml-1">
            <ResourceIcon resource={resourceName} size="small" />
          </span>
        </div>
        <div
          className="absolute flex p-4 bg-background-secondary top-[-90px]  clipped-corner-medium"
          //   style={{ transform: "translateX(-50%)" }}
        >
          {upcomingTiles.slice(0, previewTileCount!).map((tile, index) => (
            <div key={index} className="flex">
              <div className="w-4 " />
              <div
                className={classNames(
                  "transition-transform cursor-pointer",
                  nextTileIndex == index ? "scale-110" : "",
                  nextTileIndex != index ? "opacity-50" : "",
                  "hover:opacity-100"
                )}
              >
                <HexagonTile
                  tile={tile}
                  hexSize={40}
                  muted={false}
                  onClick={() => onUpcomingTileClick(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingTiles;
