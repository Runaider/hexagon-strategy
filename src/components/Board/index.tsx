import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tile, TileSectionType } from "../../models/Tile";
import HexagonTile from "../HexagonTile";
import nearbyHexes from "../../utils/nearbyHexes";
import {
  Tile_CCCCCC,
  Tile_FFFCCC,
  Tile_FFFFFF,
  Tile_MMMCCC,
} from "../../constants/hexTiles";
import HexagonTilePreview from "../HexagonTilePreview";
import classNames from "classnames";
import { cloneDeep } from "lodash";

const GameBoard = ({
  rows,
  cols,
  hexSize,
}: {
  rows: number;
  cols: number;
  hexSize: number;
}) => {
  const keyListenerAdded = useRef(false);
  const [isFirstTilePlaced, setIsFirstTilePlaced] = useState(false);
  const [upcomingTiles, setUpcomingTiles] = useState([
    Tile_FFFCCC,
    Tile_FFFFFF,
    Tile_CCCCCC,
    Tile_MMMCCC,
  ]);
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

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      unlockHexesNearClickedHex(row, col);
      const newTile = upcomingTiles.shift();
      setUpcomingTiles([...(upcomingTiles ?? [])]);
      if (!newTile) {
        return;
      }
      setCellValues((prev) => ({
        ...prev,
        [`${row},${col}`]: newTile,
      }));
    },
    [unlockHexesNearClickedHex, upcomingTiles]
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
        console.log("before rotate", cloneDeep(prev));
        prev[0].rotate();
        console.log(
          "after rotate",
          cloneDeep(prev),
          cloneDeep(prev)[0].getSides()
        );
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
      {/* Next hex to place */}
      <div
        className="fixed bg-white shadow-md border p-4 rounded-md flex items-center justify-center"
        style={{ bottom: "30px", left: "50%", transform: "translateX(-50%)" }}
      >
        {upcomingTiles.map((tile, index) => (
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
