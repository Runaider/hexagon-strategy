import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tile, TileSectionType } from "../../models/Tile";
import HexagonTile from "../HexagonTile";
import { nearbyHexes, getHexConnectedToSide } from "../../utils/nearbyHexes";
import { allTiles } from "../../constants/hexTiles";
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
  const [currentTurn, setCurrentTurn] = useState(0);
  const [resourcesPerTurn, setResourcesPerTurn] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    gold: 0,
  });
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
    // apply resources
    setResources((prev) => ({
      wood: prev.wood + resourcesPerTurn.wood,
      stone: prev.stone + resourcesPerTurn.stone,
      food: prev.food + resourcesPerTurn.food,
      gold: prev.gold + resourcesPerTurn.gold,
    }));
  }, [
    resourcesPerTurn.food,
    resourcesPerTurn.gold,
    resourcesPerTurn.stone,
    resourcesPerTurn.wood,
  ]);

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
      const resourceCounts = { ...resourcesPerTurn };
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
        console.log("Connected tile found", connectedTile);
        const connectedSide = connectedTile.getSides()[(index + 3) % 6];

        console.log("Connected side", connectedSide.type);

        if (connectedSide.type === side.type) {
          switch (side.type) {
            case TileSectionType.Forest:
              console.log("Adding wood");
              resourceCounts.wood += 1;
              break;
            case TileSectionType.Mountains:
              console.log("Adding stone");
              resourceCounts.stone += 1;
              break;
            case TileSectionType.Plains:
              console.log("Adding food");
              resourceCounts.food += 1;
              break;
            case TileSectionType.Water:
              break;
            case TileSectionType.City:
              console.log("Adding gold");
              resourceCounts.gold += 1;
              break;
          }
        }
      });

      setResourcesPerTurn(resourceCounts);
    },
    [cellValues, cols, resourcesPerTurn, rows]
  );

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      unlockHexesNearClickedHex(row, col);
      const newTile = upcomingTiles.shift();
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
      onTurnChange();
    },
    [
      onTurnChange,
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

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    console.log(`Key pressed: ${event.key}`);
    // on r press, rotate the upcoming tile
    if (event.key === "r") {
      console.log("Rotating upcoming tile");
      setUpcomingTiles((prev) => {
        prev[0].rotate();

        const newUpcomingTiles = [...prev];
        return newUpcomingTiles;
      });
    }
  }, []);

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
              <div
                className="text-black absolute"
                style={{
                  left: `${hexSize / 2}px`,
                  top: `${hexSize / 2}px`,
                }}
              >
                {rowIndex};{colIndex}
              </div>
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
                  previewTile={upcomingTiles[0]}
                  hexSize={hexSize}
                  onClick={() => onHexagonClick(rowIndex, colIndex)}
                />
              ) : (
                <></>
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
          Wood +{resourcesPerTurn.wood}: {recources.wood}
          <div className="w-4" />
          Stone +{resourcesPerTurn.stone}: {recources.stone}
          <div className="w-4" />
          Food +{resourcesPerTurn.food}: {recources.food}
          <div className="w-4" />
          Gold +{resourcesPerTurn.gold}: {recources.gold}
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
                index == 0 ? "scale-125" : ""
              )}
            >
              <HexagonTile
                tile={tile}
                hexSize={hexSize}
                muted={false}
                onClick={() => console.log("Upcoming tile clicked")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
