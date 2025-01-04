import { useAppConfig } from "@/contexts/appConfig";
import { useGameCoreContext } from "@/contexts/gameCoreContext";
import classNames from "classnames";
import HexagonTile from "../HexagonTile";
import { useCallback, useEffect } from "react";

function UpcomingTiles() {
  const {
    config: { previewTileCount, hexSize, actionPrices },
  } = useAppConfig();
  const {
    upcomingTiles,
    nextTileIndex,
    canPriceBePaid,
    setNextTileIndex,
    payPrice,
    shuffleTiles,
    rotateUpcomingTile,
  } = useGameCoreContext();

  const onShuffleClick = () => {
    if (!canPriceBePaid(actionPrices!.redrawUpcomingHexes!)) {
      return;
    }
    payPrice(actionPrices!.redrawUpcomingHexes!);
    shuffleTiles();
  };

  const onUpcomingTileClick = (index: number) => {
    if (!canPriceBePaid(actionPrices!.changeUpcomingHex!)) {
      return;
    }
    payPrice(actionPrices!.changeUpcomingHex!);
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
    // console.log("Adding key listener");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // console.log("Removing key listener");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center w-screen h-10 bg-background-primary">
      {/* <div
        className="absolute right-[-42px] top-[-12px] text-lg font-bold bg-indigo-600 px-2 h-8 rounded-full flex items-center justify-center hover:scale-110 cursor-pointer transition-transform"
        onClick={onShuffleClick}
      >
        Shuffle
      </div> */}
      <div className="flex items-center justify-center shadow-filter-flat">
        <div
          className="absolute flex p-4 bg-background-secondary top-[-105px]  clipped-corner-medium"
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
                  hexSize={hexSize!}
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
