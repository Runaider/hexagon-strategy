import { useCallback, useEffect, useState } from "react";
import { Tile, TileSectionType } from "../../models/Tile";
import HexagonTile from "../HexagonTile";
import { nearbyHexes, getHexConnectedToSide } from "../../utils/nearbyHexes";
import { allTiles, Tile_CASTLE } from "../../constants/hexTiles";
import HexagonTilePreview from "../HexagonTilePreview";
import classNames from "classnames";
import { cloneDeep, shuffle } from "lodash";
import { calculateScoreFromGridData } from "@/utils/calculateScoreFromGridData";
import useStatTracker from "@/hooks/useStatTracker";
import useQuests from "@/hooks/useQuests";
import useToxicTileTracker from "@/hooks/useToxicTileTracker";
import { useAppConfig } from "@/contexts/appConfig";
import StatTag from "../StatTag";
import StatsBar from "../StatsBar";

const TOXIC_TILE_BUFFER = 3;

const GameBoard = ({
  rows,
  cols,
  hexSize,
}: {
  rows: number;
  cols: number;
  hexSize: number;
}) => {
  const { config } = useAppConfig();
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [nextTileIndex, setNextTileIndex] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [highlightedHexes, setHighlightedHexes] = useState<
    { row: number; col: number }[]
  >([]);

  console.log("Config", config);

  const {
    cellValues,
    resources,
    tileResourceProduction,
    setCell,
    removeCell,
    canPriceBePaid,
    payPrice,
  } = useStatTracker({ rows, cols });

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
    tileResourceProduction,
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
          if (currentTurn <= config.maxTurns! - TOXIC_TILE_BUFFER) {
            const { id: questId } = addRandomQuest();
            addToxicTile({
              row: nearbyRow,
              col: nearbyCol,
              questId: questId,
              spawnedTurn: currentTurn,
              destructionTurn: currentTurn + 3,
            });
          }
          return;
        }
      }
    },
    [
      addRandomQuest,
      addToxicTile,
      cellValues,
      cols,
      config.maxTurns,
      currentTurn,
      rows,
    ]
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

      if (Math.random() < config.toxicTileProbability!) {
        placeToxicHexOnNearbyFreeHex(row, col);
      }
      setZonesAfterTilePlacement(row, col, newTile);
      setNextTileIndex(0);
      onTurnChange();
    },
    [
      config.toxicTileProbability,
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

  const onUpcomingTileClick = useCallback(
    (index: number) => {
      if (!canPriceBePaid(config.actionPrices!.changeUpcomingHex)) {
        return;
      }
      payPrice(config.actionPrices!.changeUpcomingHex);
      setNextTileIndex(index);
    },
    [canPriceBePaid, config.actionPrices, payPrice]
  );

  const onShuffleClick = useCallback(() => {
    if (!canPriceBePaid(config.actionPrices!.redrawUpcomingHexes)) {
      return;
    }
    payPrice(config.actionPrices!.redrawUpcomingHexes);
    setUpcomingTiles(shuffle(upcomingTiles));
  }, [canPriceBePaid, config.actionPrices, payPrice, upcomingTiles]);

  // on first render place the core tile in the center
  useEffect(() => {
    if (isFirstTilePlaced) {
      return;
    }
    setIsFirstTilePlaced(true);
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    unlockHexesNearClickedHex(centerRow, centerCol);
    setCell(centerRow, centerCol, Tile_CASTLE);
  }, [
    // coreTile,
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
    if (currentTurn == config.maxTurns) {
      const { score, scoreLog } = calculateScoreFromGridData(zones, quests);
      console.log("scoreLog", scoreLog);
      alert(`Game over! Your score is ${score}`);
      setScore(score);
    }
  }, [cellValues, currentTurn, isGameOver, quests, zones]);

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
                  onClick={function(): void {
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
        style={{ top: "20px", left: "50%", transform: "translateX(-50%)" }}
      >
        <StatsBar
          wood={resources.wood}
          stone={resources.stone}
          food={resources.food}
          money={resources.gold}
        />
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
        <div
          className="absolute right-[-42px] top-[-12px] text-lg font-bold bg-indigo-600 px-2 h-8 rounded-full flex items-center justify-center hover:scale-110 cursor-pointer transition-transform"
          onClick={onShuffleClick}
        >
          Shuffle
        </div>
        {upcomingTiles.slice(0, config.previewTileCount!).map((tile, index) => (
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
                onClick={() => onUpcomingTileClick(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
