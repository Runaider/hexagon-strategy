import { useCallback, useEffect, useRef, useState } from "react";
import { TileSectionType } from "../../models/Tile";
import HexagonTile from "../HexagonTile";
import { nearbyHexes } from "../../utils/nearbyHexes";
import HexagonTilePreview from "../HexagonTilePreview";
import classNames from "classnames";
import { shuffle } from "lodash";
import useQuests from "@/hooks/useQuests";
import useToxicTileTracker from "@/hooks/useToxicTileTracker";
import { useAppConfig } from "@/contexts/appConfig";

import { useGameCoreContext } from "@/contexts/gameCoreContext";

const TOXIC_TILE_BUFFER = 3;

const GameBoard = () => {
  const tileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const {
    config: { rows, cols, hexSize, maxTurns },
  } = useAppConfig();
  const {
    zones,
    nextTileToPlace,
    resources,
    unlockedCells,
    currentTurn,
    cellValues,
    tileResourceProduction,

    setCell,
    removeCell,
    onTilePlace,
  } = useGameCoreContext();
  const [highlightedHexes, setHighlightedHexes] = useState<
    { row: number; col: number }[]
  >([]);

  const {
    toxicTiles,
    addTile: addToxicTile,
    removeTile: removeToxicTile,
  } = useToxicTileTracker({
    setCell,
    removeCell,
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
    // zones,
    onQuestComplete
  );

  const hexWidth = Math.sqrt(3) * hexSize!; // Width of each hexagon
  const hexHeight = 2 * hexSize!; // Height of each hexagon
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight; // Vertical distance between rows

  const grid = [];

  const placeToxicHexOnNearbyFreeHex = useCallback(
    (row: number, col: number) => {
      // place on a random nearby hex

      const nearby = nearbyHexes(row, col, rows, cols);
      for (const [nearbyRow, nearbyCol] of shuffle(nearby)) {
        if (!cellValues[`${nearbyRow},${nearbyCol}`]) {
          if (currentTurn <= maxTurns! - TOXIC_TILE_BUFFER) {
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
      maxTurns,
      currentTurn,
      rows,
    ]
  );

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      onTilePlace(row, col);
    },
    [onTilePlace]
  );

  const scrollToCenter = (key: string) => {
    console.log("Scrolling to center before if", tileRefs.current, key);

    if (tileRefs.current && tileRefs.current[key]) {
      console.log("Scrolling to center", key);
      tileRefs.current[key].scrollIntoView({
        behavior: "instant",
        block: "center", // Aligns the element in the vertical center of the viewport
        inline: "center", // Aligns the element in the horizontal center (for inline elements)
      });
    }
  };

  useEffect(() => {
    const centerTileKey = `${Math.floor(rows! / 2)},${Math.floor(cols! / 2)}`;
    scrollToCenter(centerTileKey);
  }, [cols, rows]);

  return (
    <div>
      {Array.from({ length: rows! }, (_, rowIndex) => {
        const row = Array.from({ length: cols! }, (_, colIndex) => {
          const x = colIndex * xOffset + (rowIndex % 2 === 1 ? xOffset / 2 : 0);
          const y = rowIndex * yOffset;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              ref={(el) => (tileRefs.current[`${rowIndex},${colIndex}`] = el)}
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
              {cellValues[`${rowIndex},${colIndex}`] ? (
                <HexagonTile
                  tile={cellValues[`${rowIndex},${colIndex}`]}
                  hexSize={hexSize!}
                  muted={false}
                  onClick={function(): void {
                    console.log("Filed tile clicked", rowIndex, colIndex);
                  }}
                />
              ) : unlockedCells[`${rowIndex},${colIndex}`] ? (
                <HexagonTilePreview
                  previewTile={nextTileToPlace}
                  hexSize={hexSize!}
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
    </div>
  );
};

export default GameBoard;
