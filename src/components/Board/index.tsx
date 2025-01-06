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
import { AnimatePresence, motion } from "framer-motion";
import HexagonClouds from "../HexagonClouds";

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

  // const { quests, addRandomQuest } = useQuests(
  //   resources,
  //   tileResourceProduction,
  //   // zones,
  //   onQuestComplete
  // );

  const hexWidth = Math.sqrt(3) * hexSize!; // Width of each hexagon
  const hexHeight = 2 * hexSize!; // Height of each hexagon
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight; // Vertical distance between rows

  const grid = [];

  // const placeToxicHexOnNearbyFreeHex = useCallback(
  //   (row: number, col: number) => {
  //     // place on a random nearby hex

  //     const nearby = nearbyHexes(row, col, rows, cols);
  //     for (const [nearbyRow, nearbyCol] of shuffle(nearby)) {
  //       if (!cellValues[`${nearbyRow},${nearbyCol}`]) {
  //         if (currentTurn <= maxTurns! - TOXIC_TILE_BUFFER) {
  //           const { id: questId } = addRandomQuest();
  //           addToxicTile({
  //             row: nearbyRow,
  //             col: nearbyCol,
  //             questId: questId,
  //             spawnedTurn: currentTurn,
  //             destructionTurn: currentTurn + 3,
  //           });
  //         }
  //         return;
  //       }
  //     }
  //   },
  //   [
  //     addRandomQuest,
  //     addToxicTile,
  //     cellValues,
  //     cols,
  //     maxTurns,
  //     currentTurn,
  //     rows,
  //   ]
  // );

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      onTilePlace(row, col);
    },
    [onTilePlace]
  );

  const scrollToCenter = (key: string) => {
    if (tileRefs.current && tileRefs.current[key]) {
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
      <div className="absolute w-full h-full z-0">
        {Array.from({ length: rows! }, (_, rowIndex) => {
          const row = Array.from({ length: cols! }, (_, colIndex) => {
            const x =
              colIndex * xOffset + (rowIndex % 2 === 1 ? xOffset / 2 : 0);
            const y = rowIndex * yOffset;
            return (
              <div
                key={`te${rowIndex}-${colIndex}`}
                className={` z-0 opacity-1 `}
                style={{
                  height: `100px`,
                  width: `86px`,
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                }}
              >
                {Math.random() < 0.05 ? (
                  <motion.div
                    key="box"
                    initial={{ opacity: 1, y: 0 }}
                    // animate={{ opacity: 1, y: 0 }} // Animate to
                    exit={{
                      opacity: 0,
                      y: rowIndex < hexSize! / 2 ? -20 : 20,
                      x: colIndex < hexSize! / 2 ? 20 : -20,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ position: "absolute" }}
                    // Exit animation
                  >
                    <HexagonClouds
                      scale={shuffle([0.5, 0.75, 1, 1.25])[0]}
                      delay={
                        shuffle([
                          1000,
                          3000,
                          6000,
                          9000,
                          12000,
                          15000,
                          18000,
                        ])[0]
                      }
                      speed={shuffle([40, 30, 20])[0]}
                      hexSize={hexSize!}
                    />
                  </motion.div>
                ) : (
                  <></>
                )}
              </div>
            );
          });
          return row;
        })}
      </div>
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
                !cellValues[`${rowIndex},${colIndex}`] &&
                  !!unlockedCells[`${rowIndex},${colIndex}`] &&
                  "hover:z-30 hover:scale-110",
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
              {" "}
              <AnimatePresence>
                {cellValues[`${rowIndex},${colIndex}`] ? (
                  <motion.div
                    initial={{ scale: 1.1, zIndex: 100 }}
                    animate={{ scale: [1.1, 0.9, 1.1, 1] }}
                    transition={{ duration: 1 }}
                  >
                    <HexagonTile
                      tile={cellValues[`${rowIndex},${colIndex}`]}
                      hexSize={hexSize!}
                      muted={false}
                      onClick={function(): void {
                        console.log("Filed tile clicked", rowIndex, colIndex);
                      }}
                    />
                  </motion.div>
                ) : unlockedCells[`${rowIndex},${colIndex}`] ? (
                  <div>
                    <motion.div
                      initial={{ scale: 1, opacity: 0.0 }}
                      animate={{
                        opacity: [0, 1, 1, 1],
                        scale: [1, 0.9, 1.1, 1],
                      }}
                      transition={{ duration: 1, delay: 0.4 }}
                    >
                      <HexagonTilePreview
                        previewTile={nextTileToPlace}
                        hexSize={hexSize!}
                        onClick={() => onHexagonClick(rowIndex, colIndex)}
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div
                    className={`relative h-[${hexSize}px] w-[${hexSize}px] z-0 opacity-1`}
                    style={{
                      height: `100px`,
                      width: `86px`,
                    }}
                  ></div>
                )}
              </AnimatePresence>
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
        {/* <div className="flex flex-col border p-4 shadow-md  bg-white rounded-md text-md">
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
        </div> */}
      </div>
      {/* zone numbers */}
      <div
        className="fixed   rounded-md flex text-md text-black"
        style={{ right: "30px", top: "50%", transform: "translateY(-50%)" }}
      >
        {/* <div className="flex flex-col border p-4 shadow-md  bg-white rounded-md text-md">
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
        </div> */}
      </div>
    </div>
  );
};

export default GameBoard;
