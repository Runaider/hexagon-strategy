import { useCallback, useEffect, useRef, useState } from "react";
import HexagonTile from "../HexagonTile";
import HexagonTilePreview from "../HexagonTilePreview";
import classNames from "classnames";
import { useAppConfig } from "@/contexts/appConfig";

import { useGameCoreContext } from "@/contexts/gameCoreContext";
import { AnimatePresence, motion } from "framer-motion";

import HexagonTileToxicOverlay from "../HexagonTileToxicOverlay";
import CloudLayer from "../CloudLayer";
import { useResourceIconAnimationContext } from "@/contexts/resourceIconAnimationContext";

const GameBoard = () => {
  const tileRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const {
    config: { rows, cols, hexSize },
  } = useAppConfig();
  const { setStartRef, triggerBubble } = useResourceIconAnimationContext();

  const {
    nextTileToPlace,
    unlockedCells,
    cellValues,
    isTileToxic,
    onTilePlace,
    getToxicTile,
    removeToxicTile,
    getNewTileResourceProduction,
  } = useGameCoreContext();

  const [highlightedHexes, setHighlightedHexes] = useState<
    { row: number; col: number }[]
  >([]);

  const hexWidth = Math.sqrt(3) * hexSize!; // Width of each hexagon
  const hexHeight = 2 * hexSize!; // Height of each hexagon
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight; // Vertical distance between rows

  const grid = [];

  const onToxicHexagonClick = useCallback(
    (row: number, col: number) => {
      console.log("toxic hexagon clicked", row, col);
      removeToxicTile(row, col, (price) => {
        Object.entries(price).forEach(([key, value]) => {
          if (value) {
            triggerBubble(
              tileRefs.current[`${row},${col}`]!,
              key as ResourceNames,
              value,
              "red"
            );
          }
        });
      });
    },
    [removeToxicTile, triggerBubble]
  );
  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      if (tileRefs.current[`${row},${col}`]) {
        const production = Object.entries(
          getNewTileResourceProduction(row, col, nextTileToPlace)
        ).reduce(
          (acc, [key, value]) => {
            console.log("key", key, "value", value);
            Object.entries(value).forEach(([key, value]) => {
              // @ts-ignore
              if (acc[key] !== undefined) {
                // @ts-ignore
                acc[key] += value;
              }
            });
            return acc;
          },
          { food: 0, gold: 0, stone: 0, wood: 0 }
        );

        Object.entries(production).forEach(([key, value]) => {
          if (value) {
            triggerBubble(
              tileRefs.current[`${row},${col}`]!,
              key as ResourceNames,
              value,
              "green"
            );
          }
        });
      }
      onTilePlace(row, col);
    },
    [getNewTileResourceProduction, nextTileToPlace, onTilePlace, triggerBubble]
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
      <CloudLayer
        rows={rows!}
        cols={cols!}
        xOffset={xOffset}
        yOffset={yOffset}
        hexSize={hexSize!}
      />
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
                    initial={{ scale: 1.1 }}
                    animate={{ scale: [1.1, 0.9, 1.1, 1] }}
                    transition={{ duration: 1 }}
                  >
                    <HexagonTile
                      tile={cellValues[`${rowIndex},${colIndex}`]}
                      hexSize={hexSize!}
                      muted={false}
                      onClick={function(): void {}}
                    />
                    {isTileToxic(rowIndex, colIndex) && (
                      <HexagonTileToxicOverlay
                        toxicTile={getToxicTile(rowIndex, colIndex)!}
                        onClick={() => onToxicHexagonClick(rowIndex, colIndex)}
                      />
                    )}
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
                      onMouseOver={() =>
                        setHighlightedHexes([{ row: rowIndex, col: colIndex }])
                      }
                      onMouseOut={() => setHighlightedHexes([])}
                    >
                      <HexagonTilePreview
                        row={rowIndex}
                        col={colIndex}
                        previewTile={nextTileToPlace}
                        hexSize={hexSize!}
                        onClick={() => onHexagonClick(rowIndex, colIndex)}
                        isHighlighted={highlightedHexes.some(
                          (hex) => hex.row === rowIndex && hex.col === colIndex
                        )}
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
    </div>
  );
};

export default GameBoard;
