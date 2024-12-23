import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tile, TileSectionType } from "../../models/Tile";
import HexagonTile from "../HexagonTile";
import { nearbyHexes, getHexConnectedToSide } from "../../utils/nearbyHexes";
import { allTiles, Tile_TOXIC } from "../../constants/hexTiles";
import HexagonTilePreview from "../HexagonTilePreview";
import classNames from "classnames";
import { cloneDeep, shuffle } from "lodash";

const GameBoard = ({
  rows,
  cols,
  hexSize,
}: {
  rows: number;
  cols: number;
  hexSize: number;
}) => {
  const [isGameOver, setIsGameOver] = useState(false);

  const [nextTileIndex, setNextTileIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);

  const [recources, setResources] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    gold: 0,
  });
  const [sectionsCounts, setSectionsCounts] = useState({
    [TileSectionType.City]: 0,
    [TileSectionType.Forest]: 0,
    [TileSectionType.Mountains]: 0,
    [TileSectionType.Plains]: 0,
    [TileSectionType.Water]: 0,
  });
  const [isFirstTilePlaced, setIsFirstTilePlaced] = useState(false);
  const [upcomingTiles, setUpcomingTiles] = useState(shuffle([...allTiles]));
  const [cellValues, setCellValues] = useState<{ [key: string]: Tile }>({});
  const [tileResourceProduction, setTileResourceProduction] = useState<{
    [key: string]: {
      wood: number;
      stone: number;
      food: number;
      gold: number;
      isLocked: boolean;
    };
  }>({});
  const [unlockedCells, setUnlockedCells] = useState<{
    [key: string]: boolean;
  }>({});
  const coreTile = useMemo(
    () =>
      new Tile([
        TileSectionType.Castle,
        TileSectionType.Castle,
        TileSectionType.Castle,
        TileSectionType.Castle,
        TileSectionType.Castle,
        TileSectionType.Castle,
      ]),
    []
  );

  const hexWidth = Math.sqrt(3) * hexSize; // Width of each hexagon
  const hexHeight = 2 * hexSize; // Height of each hexagon
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight; // Vertical distance between rows

  const grid = [];

  const onTurnChange = useCallback(() => {
    setCurrentTurn((prev) => prev + 1);
    setResources((prev) => {
      const newResources = { ...prev };
      Object.entries(tileResourceProduction).forEach(([key, value]) => {
        const [row, col] = key.split(",").map(Number);
        if (value.isLocked) {
          return;
        }
        newResources.wood += value?.wood || 0;
        newResources.stone += value?.stone || 0;
        newResources.food += value?.food || 0;
        newResources.gold += value?.gold || 0;
      });
      return newResources;
    });
  }, [tileResourceProduction]);

  const unlockHexesNearClickedHex = useCallback(
    (row: number, col: number) => {
      const nearby = nearbyHexes(row, col, rows, cols);
      nearby.forEach(([nearbyRow, nearbyCol]) => {
        setUnlockedCells((prev) => ({
          ...prev,
          [`${nearbyRow},${nearbyCol}`]: true,
        }));
      });
    },
    [cols, rows]
  );

  const placeToxicHexOnNearbyFreeHex = useCallback(
    (row: number, col: number) => {
      // place on a random nearby hex

      const nearby = nearbyHexes(row, col, rows, cols);
      for (const [nearbyRow, nearbyCol] of shuffle(nearby)) {
        if (!cellValues[`${nearbyRow},${nearbyCol}`]) {
          setCellValues((prev) => ({
            ...prev,
            [`${nearbyRow},${nearbyCol}`]: Tile_TOXIC,
          }));
          return;
        }
      }
    },
    [cellValues, cols, rows]
  );

  const updateSectionCounts = useCallback(
    (tile: Tile) => {
      const newSectionCounts = { ...sectionsCounts };
      tile.sides.forEach((side) => {
        newSectionCounts[side.type] += 1;
      });
      setSectionsCounts(newSectionCounts);
    },
    [sectionsCounts]
  );

  const updateResourceCounts = useCallback(
    (newTileRow: number, newTileCol: number, newTile: Tile) => {
      const tileResources = { ...tileResourceProduction };
      // const resourceCounts = { ...resourcesPerTurn };
      // side 1 is the top right side
      // side 2 is the right side
      // side 3 is the bottom right side
      // side 4 is the bottom left side
      // side 5 is the left side
      // side 6 is the top left side
      // tiles generate resources only when they connected to same type of tile on other hex
      // console.log("tileSides", newTile.getSides());
      newTile.getSides().forEach((side, index) => {
        console.log("=================");
        console.log("Checking side", index, side.type);
        const connectedHex = getHexConnectedToSide(
          newTileRow,
          newTileCol,
          rows,
          cols,
          index
        );
        if (!connectedHex) {
          console.warn("No connected hex found");
          return;
        }
        const [connectedRow, connectedCol] = connectedHex;
        // console.log(
        //   "New tile side",
        //   side,
        //   side.type,
        //   "connectedHex",
        //   connectedHex
        // );
        const connectedTile = cellValues[`${connectedRow},${connectedCol}`];
        if (!connectedTile) {
          return;
        }
        // console.log("Connected tile found", connectedTile);
        const connectedSide = connectedTile.getSides()[(index + 3) % 6];

        // console.log("Connected side", connectedSide.type);

        if (connectedSide.type === side.type) {
          switch (side.type) {
            case TileSectionType.Forest:
              console.log("Adding wood");
              tileResources[`${newTileRow},${newTileCol}`] = {
                ...tileResources[`${newTileRow},${newTileCol}`],
                wood:
                  (tileResources[`${newTileRow},${newTileCol}`]?.wood || 0) +
                  0.5,
              };
              tileResources[`${connectedRow},${connectedCol}`] = {
                ...tileResources[`${connectedRow},${connectedCol}`],
                wood:
                  (tileResources[`${connectedRow},${connectedCol}`]?.wood ||
                    0) + 0.5,
              };

              break;
            case TileSectionType.Mountains:
              console.log("Adding stone");
              tileResources[`${newTileRow},${newTileCol}`] = {
                ...tileResources[`${newTileRow},${newTileCol}`],
                stone:
                  (tileResources[`${newTileRow},${newTileCol}`]?.stone || 0) +
                  0.5,
              };
              tileResources[`${connectedRow},${connectedCol}`] = {
                ...tileResources[`${connectedRow},${connectedCol}`],
                stone:
                  (tileResources[`${connectedRow},${connectedCol}`]?.stone ||
                    0) + 0.5,
              };

              break;
            case TileSectionType.Plains:
              console.log("Adding food");
              tileResources[`${newTileRow},${newTileCol}`] = {
                ...tileResources[`${newTileRow},${newTileCol}`],
                food:
                  (tileResources[`${newTileRow},${newTileCol}`]?.food || 0) +
                  0.5,
              };
              tileResources[`${connectedRow},${connectedCol}`] = {
                ...tileResources[`${connectedRow},${connectedCol}`],
                food:
                  (tileResources[`${connectedRow},${connectedCol}`]?.food ||
                    0) + 0.5,
              };

              break;
            case TileSectionType.Water:
              break;
            case TileSectionType.City:
              console.log("Adding gold");
              tileResources[`${newTileRow},${newTileCol}`] = {
                ...tileResources[`${newTileRow},${newTileCol}`],
                gold:
                  (tileResources[`${newTileRow},${newTileCol}`]?.gold || 0) +
                  0.5,
              };
              tileResources[`${connectedRow},${connectedCol}`] = {
                ...tileResources[`${connectedRow},${connectedCol}`],
                gold:
                  (tileResources[`${connectedRow},${connectedCol}`]?.gold ||
                    0) + 0.5,
              };

              break;
          }
        }
      });

      // setResourcesPerTurn(resourceCounts);
      setTileResourceProduction(tileResources);
    },
    [cellValues, cols, rows, tileResourceProduction]
  );

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      unlockHexesNearClickedHex(row, col);

      // const newTile = upcomingTiles.shift();
      const newTile = upcomingTiles[nextTileIndex];
      upcomingTiles.splice(nextTileIndex, 1);
      updateSectionCounts(newTile!);

      setUpcomingTiles([...(upcomingTiles ?? []), newTile!]);
      if (!newTile) {
        return;
      }

      setCellValues((prev) => ({
        ...prev,
        [`${row},${col}`]: cloneDeep(newTile),
      }));
      updateResourceCounts(row, col, newTile);
      // 20% chance to place a toxic hex
      if (Math.random() < 0.1) {
        placeToxicHexOnNearbyFreeHex(row, col);
      }
      onTurnChange();
    },
    [
      nextTileIndex,
      onTurnChange,
      placeToxicHexOnNearbyFreeHex,
      unlockHexesNearClickedHex,
      upcomingTiles,
      updateResourceCounts,
      updateSectionCounts,
    ]
  );

  // on first render place the core tile in the center
  useEffect(() => {
    if (isFirstTilePlaced) {
      return;
    }
    setIsFirstTilePlaced(true);
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    unlockHexesNearClickedHex(centerRow, centerCol);
    setCellValues((prev) => ({
      ...prev,
      [`${centerRow},${centerCol}`]: coreTile,
    }));
  }, [
    coreTile,
    cols,
    rows,
    isFirstTilePlaced,
    hexWidth,
    hexHeight,
    unlockHexesNearClickedHex,
  ]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}`);
      // on r press, rotate the upcoming tile
      if (event.key === "r") {
        console.log("Rotating upcoming tile");
        setUpcomingTiles((prev) => {
          prev[nextTileIndex].rotate();

          const newUpcomingTiles = [...prev];
          return newUpcomingTiles;
        });
      }
    },
    [nextTileIndex]
  );

  useEffect(() => {
    console.log("Adding key listener");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      console.log("Removing key listener");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      {Array.from({ length: rows }, (_, rowIndex) => {
        const row = Array.from({ length: cols }, (_, colIndex) => {
          const x = colIndex * xOffset + (rowIndex % 2 === 1 ? xOffset / 2 : 0);
          const y = rowIndex * yOffset;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="hover:z-30"
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {/* <div
                className="text-black absolute"
                style={{
                  left: `${hexSize / 2}px`,
                  top: `${hexSize / 2}px`,
                }}
              >
                {rowIndex};{colIndex}
              </div> */}
              {cellValues[`${rowIndex},${colIndex}`] ? (
                <HexagonTile
                  tile={cellValues[`${rowIndex},${colIndex}`]}
                  hexSize={hexSize}
                  muted={false}
                  onClick={function (): void {
                    console.log("Filed tile clicked", rowIndex, colIndex);
                  }}
                />
              ) : unlockedCells[`${rowIndex},${colIndex}`] ? (
                <HexagonTilePreview
                  previewTile={upcomingTiles[nextTileIndex]}
                  hexSize={hexSize}
                  onClick={() => onHexagonClick(rowIndex, colIndex)}
                />
              ) : (
                <div
                  className={`h-[${hexSize}px] w-[${hexSize}px]`}
                  style={{
                    height: `${hexSize}px`,
                    width: `${hexSize}px`,
                  }}
                ></div>
              )}
            </div>
          );
        });

        grid.push(row);
        return row;
      })}
      {/* resource counts */}
      <div
        className="fixed   rounded-md flex text-md text-black"
        style={{ top: "30px", left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="flex border p-4 shadow-md  bg-white rounded-md text-md">
          Forest: {sectionsCounts[TileSectionType.Forest]}
          <div className="w-4" />
          Mountains: {sectionsCounts[TileSectionType.Mountains]}
          <div className="w-4" />
          Plains: {sectionsCounts[TileSectionType.Plains]}
          <div className="w-4" />
          Water: {sectionsCounts[TileSectionType.Water]}
          <div className="w-4" />
          City: {sectionsCounts[TileSectionType.City]}
        </div>
        <div className="w-4" />
        <div className="flex border p-4 shadow-md  bg-white rounded-md text-md">
          {/* Wood +{resourcesPerTurn.wood}: {recources.wood}
          <div className="w-4" />
          Stone +{resourcesPerTurn.stone}: {recources.stone}
          <div className="w-4" />
          Food +{resourcesPerTurn.food}: {recources.food}
          <div className="w-4" />
          Gold +{resourcesPerTurn.gold}: {recources.gold} */}
          Wood +
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.wood || 0),
            0
          )}
          : {recources?.wood || 0}
          <div className="w-4" />
          Stone +{" "}
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.stone || 0),
            0
          )}
          : {recources?.stone || 0}
          <div className="w-4" />
          Food +{" "}
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.food || 0),
            0
          )}
          : {recources?.food || 0}
          <div className="w-4" />
          Gold +{" "}
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.gold || 0),
            0
          )}{" "}
          : {recources?.gold || 0}
        </div>
        <div className="w-4" />
        <div className="flex border p-4 shadow-md  bg-white rounded-md text-md">
          Turn: {currentTurn}
        </div>
      </div>
      {/* Next hex to place */}
      <div
        className="fixed bg-white shadow-md border p-4 rounded-md flex items-center justify-center"
        style={{ bottom: "30px", left: "50%", transform: "translateX(-50%)" }}
      >
        {upcomingTiles.slice(0, 5).map((tile, index) => (
          <div key={index} className="flex">
            <div className="w-4 " />
            <div
              className={classNames(
                "transition-transform",
                nextTileIndex == index ? "scale-125" : ""
              )}
            >
              <HexagonTile
                tile={tile}
                hexSize={hexSize}
                muted={false}
                onClick={() => setNextTileIndex(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
