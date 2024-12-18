import React, { useCallback, useEffect, useMemo, useState } from "react";
import Hexagon from "../Hexagon";
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

const GameBoard = ({
  rows,
  cols,
  hexSize,
}: {
  rows: number;
  cols: number;
  hexSize: number;
}) => {
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
  const tileToFill = useMemo(
    () =>
      new Tile([
        TileSectionType.Forest,
        TileSectionType.Mountains,
        TileSectionType.Desert,
        TileSectionType.Water,
        TileSectionType.Swamp,
        TileSectionType.City,
      ]),
    []
  );
  // const upcomingTiles = useMemo(
  //   () => [Tile_FFFCCC, Tile_FFFFFF, Tile_CCCCCC, Tile_MMMCCC],
  //   []
  // );

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
      console.log("clicked", row, col);
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
                // <div>
                //   <div className="block hover:hidden">
                //     <Hexagon
                //       size={hexSize}
                //       muted
                //       onClick={() => onHexagonClick(rowIndex, colIndex)}
                //     />
                //   </div>
                //   <div className="hidden hover:block">
                //     <HexagonTile
                //       tile={upcomingTiles[0]}
                //       hexSize={hexSize}
                //       muted={false}
                //       onClick={() => console.log("Upcoming tile clicked")}
                //     />
                //   </div>
                // </div>
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
          <>
            <HexagonTile
              key={index}
              tile={tile}
              hexSize={hexSize}
              muted={false}
              onClick={() => console.log("Upcoming tile clicked")}
            />
            <div className="w-4" />
          </>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
