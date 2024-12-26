import { useCallback, useEffect, useMemo, useState } from "react";
import { Tile, TileSectionType } from "../../models/Tile";
import HexagonTile from "../HexagonTile";
import { nearbyHexes, getHexConnectedToSide } from "../../utils/nearbyHexes";
import { allTiles } from "../../constants/hexTiles";
import HexagonTilePreview from "../HexagonTilePreview";
import classNames from "classnames";
import { cloneDeep, shuffle } from "lodash";
import { calculateScoreFromGridData } from "@/utils/calculateScoreFromGridData";
import useStatTracker from "@/hooks/useStatTracker";
import useQuests from "@/hooks/useQuests";
import useToxicTileTracker from "@/hooks/useToxicTileTracker";

const TOXIC_TILE_PROBABILITY = 0.3;

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
  const [score, setScore] = useState(0);
  const [nextTileIndex, setNextTileIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [highlightedHexes, setHighlightedHexes] = useState<
    { row: number; col: number }[]
  >([]);

  const { cellValues, resources, tileResourceProduction, setCell, removeCell } =
    useStatTracker({ rows, cols });

  const {
    toxicTiles,
    addTile: addToxicTile,
    removeTile: removeToxicTile,
  } = useToxicTileTracker({
    setCell,
    removeCell,
  });

  const [zones, setZones] = useState<Zones>({
    [TileSectionType.Forest]: [],
    [TileSectionType.Water]: [],
    [TileSectionType.Mountains]: [],
    [TileSectionType.City]: [],
    [TileSectionType.Plains]: [],
  });

  const onQuestComplete = useCallback(
    (questId: string) => {
      removeToxicTile(toxicTiles.find((tile) => tile.questId === questId)!);
    },
    [removeToxicTile, toxicTiles]
  );

  const { quests, addRandomQuest } = useQuests(
    resources,
    zones,
    onQuestComplete
  );

  const [sectionsCounts, setSectionsCounts] = useState({
    [TileSectionType.City]: 0,
    [TileSectionType.Forest]: 0,
    [TileSectionType.Mountains]: 0,
    [TileSectionType.Plains]: 0,
    [TileSectionType.Water]: 0,
  });
  const [isFirstTilePlaced, setIsFirstTilePlaced] = useState(false);
  const [upcomingTiles, setUpcomingTiles] = useState(shuffle([...allTiles]));

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

  const setZonesAfterTilePlacement = useCallback(
    (row: number, col: number, tile: Tile) => {
      const tileSides = tile.getSides();
      const newZones = cloneDeep(zones);
      tileSides.forEach((side, index) => {
        const connectedHex = getHexConnectedToSide(row, col, rows, cols, index);
        if (!connectedHex) {
          return;
        }
        const [connectedRow, connectedCol] = connectedHex;
        const connectedTile = cellValues[`${connectedRow},${connectedCol}`];
        if (!connectedTile) {
          return;
        }
        const connectedSide = connectedTile.getSides()[(index + 3) % 6];

        const isConnectedSideSameType = connectedSide.type === side.type;
        if (!isConnectedSideSameType) {
          return;
        }

        const isConnectedSideInZone = newZones[side.type].some((zone) =>
          zone.hexes.some(
            (hex) => hex.row === connectedRow && hex.col === connectedCol
          )
        );
        const isSideAlreadyInZone = newZones[side.type].some((zone) =>
          zone.hexes.some((hex) => hex.row === row && hex.col === col)
        );
        if (isConnectedSideInZone) {
          // add the current hex to the zone
          const zone = newZones[side.type].find((zone) =>
            zone.hexes.some(
              (hex) => hex.row === connectedRow && hex.col === connectedCol
            )
          );
          if (!zone) {
            console.error("Zone not found");
            return;
          }
          zone.hexes.push({
            row,
            col,
            sides: tileSides.filter((_) => _.type == side.type),
          });
        } else if (isSideAlreadyInZone && !isConnectedSideInZone) {
          // add the connected hex to the zone
          const zone = newZones[side.type].find((zone) =>
            zone.hexes.some((hex) => hex.row === row && hex.col === col)
          );
          if (!zone) {
            console.error("Zone not found");
            return;
          }
          zone.hexes.push({
            row: connectedRow,
            col: connectedCol,
            sides: connectedTile.getSides().filter((_) => _.type == side.type),
          });
        } else {
          // create a new zone
          newZones[side.type].push({
            hexes: [
              {
                row: connectedRow,
                col: connectedCol,
                sides: connectedTile
                  .getSides()
                  .filter((_) => _.type == side.type),
              },
              {
                row,
                col,
                sides: tileSides.filter((_) => _.type == side.type),
              },
            ],
          });
        }
      });
      console.log("Zones", newZones);
      setZones(newZones);
    },
    [cellValues, cols, rows, zones]
  );

  const onTurnChange = useCallback(() => {
    setCurrentTurn((prev) => prev + 1);
  }, []);

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
          const { id: questId } = addRandomQuest();
          addToxicTile({
            row: nearbyRow,
            col: nearbyCol,
            questId: questId,
            spawnedTurn: currentTurn,
            destructionTurn: null,
          });
          // setCell(nearbyRow, nearbyCol, Tile_TOXIC);

          return;
        }
      }
    },
    [addRandomQuest, addToxicTile, cellValues, cols, currentTurn, rows]
  );

  const updateSectionCounts = useCallback(
    (tile: Tile) => {
      const newSectionCounts = { ...sectionsCounts };
      tile.sides.forEach((side) => {
        newSectionCounts[side.type as keyof typeof newSectionCounts] += 1;
      });
      setSectionsCounts(newSectionCounts);
    },
    [sectionsCounts]
  );

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      unlockHexesNearClickedHex(row, col);

      const newTile = upcomingTiles[nextTileIndex];
      upcomingTiles.splice(nextTileIndex, 1);
      updateSectionCounts(newTile!);

      setUpcomingTiles([...(upcomingTiles ?? []), newTile!]);
      if (!newTile) {
        return;
      }

      setCell(row, col, newTile);

      if (Math.random() < TOXIC_TILE_PROBABILITY) {
        placeToxicHexOnNearbyFreeHex(row, col);
      }
      setZonesAfterTilePlacement(row, col, newTile);
      onTurnChange();
    },
    [
      nextTileIndex,
      onTurnChange,
      placeToxicHexOnNearbyFreeHex,
      setCell,
      setZonesAfterTilePlacement,
      unlockHexesNearClickedHex,
      upcomingTiles,
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
    setCell(centerRow, centerCol, coreTile);
  }, [
    coreTile,
    cols,
    rows,
    isFirstTilePlaced,
    hexWidth,
    hexHeight,
    unlockHexesNearClickedHex,
    setCell,
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

  useEffect(() => {
    if (currentTurn == 10) {
      const { score, scoreLog } = calculateScoreFromGridData(zones);
      console.log(scoreLog);
      alert(`Game over! Your score is ${score}`);
      setScore(score);
    }
  }, [cellValues, currentTurn, isGameOver, zones]);

  return (
    <div>
      {Array.from({ length: rows }, (_, rowIndex) => {
        const row = Array.from({ length: cols }, (_, colIndex) => {
          const x = colIndex * xOffset + (rowIndex % 2 === 1 ? xOffset / 2 : 0);
          const y = rowIndex * yOffset;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={classNames(
                "transition-transform",
                "hover:z-30",
                highlightedHexes.some(
                  (hex) => hex.row === rowIndex && hex.col === colIndex
                )
                  ? "scale-110 z-30"
                  : ""
              )}
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
        className="fixed rounded-md flex text-md text-black"
        style={{ top: "30px", left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="flex border p-4 shadow-md bg-white rounded-md text-md">
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
          : {resources?.wood || 0}
          <div className="w-4" />
          Stone +{" "}
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.stone || 0),
            0
          )}
          : {resources?.stone || 0}
          <div className="w-4" />
          Food +{" "}
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.food || 0),
            0
          )}
          : {resources?.food || 0}
          <div className="w-4" />
          Gold +{" "}
          {Object.values(tileResourceProduction).reduce(
            (acc, curr) => acc + (curr?.gold || 0),
            0
          )}{" "}
          : {resources?.gold || 0}
        </div>
        <div className="w-4" />
        <div className="flex border p-4 shadow-md  bg-white rounded-md text-md">
          Turn: {currentTurn}
        </div>
        <div className="w-4" />
        <div className="flex border p-4 shadow-md  bg-white rounded-md text-md">
          Score: {score}
        </div>
      </div>
      {/* Quests */}
      <div
        className="fixed   rounded-md flex text-md text-black"
        style={{ left: "30px", top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="flex flex-col border p-4 shadow-md  bg-white rounded-md text-md">
          Pending Quests:
          {quests.map((quest, index) => (
            <div
              key={index}
              className={classNames(
                "ml-4",
                quest.completed ? "line-through" : ""
              )}
            >
              {quest.title}
            </div>
          ))}
        </div>
      </div>
      {/* zone numbers */}
      <div
        className="fixed   rounded-md flex text-md text-black"
        style={{ right: "30px", top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="flex flex-col border p-4 shadow-md  bg-white rounded-md text-md">
          Forest:{" "}
          <div className="flex flex-col">
            {zones[TileSectionType.Forest].map((zone, index) => (
              <div
                key={index}
                className="ml-4"
                onMouseOver={() => {
                  setHighlightedHexes(
                    zone.hexes.map((hex) => ({ row: hex.row, col: hex.col }))
                  );
                }}
                onMouseOut={() => setHighlightedHexes([])}
              >
                #{index} - {zone.hexes.length}
              </div>
            ))}
          </div>
          <div className="w-4" />
          Mountains:
          <div className="flex flex-col">
            {zones[TileSectionType.Mountains].map((zone, index) => (
              <div
                key={index}
                className="ml-4"
                onMouseOver={() => {
                  setHighlightedHexes(
                    zone.hexes.map((hex) => ({ row: hex.row, col: hex.col }))
                  );
                }}
                onMouseOut={() => setHighlightedHexes([])}
              >
                #{index} - {zone.hexes.length}
              </div>
            ))}
          </div>
          <div className="w-4" />
          Plains:
          <div className="flex flex-col">
            {zones[TileSectionType.Plains].map((zone, index) => (
              <div
                key={index}
                className="ml-4"
                onMouseOver={() => {
                  setHighlightedHexes(
                    zone.hexes.map((hex) => ({ row: hex.row, col: hex.col }))
                  );
                }}
                onMouseOut={() => setHighlightedHexes([])}
              >
                #{index} - {zone.hexes.length}
              </div>
            ))}
          </div>
          <div className="w-4" />
          Lakes:
          <div className="flex flex-col">
            {zones[TileSectionType.Water].map((zone, index) => (
              <div
                key={index}
                className="ml-4"
                onMouseOver={() => {
                  setHighlightedHexes(
                    zone.hexes.map((hex) => ({ row: hex.row, col: hex.col }))
                  );
                }}
                onMouseOut={() => setHighlightedHexes([])}
              >
                #{index} - {zone.hexes.length}
              </div>
            ))}
          </div>
          <div className="w-4" />
          City:{" "}
          <div className="flex flex-col">
            {zones[TileSectionType.City].map((zone, index) => (
              <div
                key={index}
                className="ml-4"
                onMouseOver={() => {
                  setHighlightedHexes(
                    zone.hexes.map((hex) => ({ row: hex.row, col: hex.col }))
                  );
                }}
                onMouseOut={() => setHighlightedHexes([])}
              >
                #{index} - {zone.hexes.length}
              </div>
            ))}
          </div>
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
