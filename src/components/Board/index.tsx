import React, { useCallback, useState } from "react";
import Hexagon from "../Hexagon";

const GameBoard = ({
  rows,
  cols,
  hexSize,
}: {
  rows: number;
  cols: number;
  hexSize: number;
}) => {
  const [cellValues, setCellValues] = useState(
    {} as { [key: string]: JSX.Element }
  );

  const hexWidth = Math.sqrt(3) * hexSize; // Width of each hexagon
  const hexHeight = 2 * hexSize; // Height of each hexagon
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight; // Vertical distance between rows

  const grid = [];

  const nearbyHexes = useCallback(
    (row: number, col: number) => {
      const nearby = [];
      const isOffset = row % 2 === 1;

      if (row > 0) {
        nearby.push([row - 1, col]); // Top
      }
      if (col > 0) {
        nearby.push([row, col - 1]); // Left
      }
      if (col < cols - 1) {
        nearby.push([row, col + 1]); // Right
      }
      if (row < rows - 1) {
        nearby.push([row + 1, col]); // Bottom
      }

      if (isOffset) {
        if (row > 0 && col < cols - 1) {
          nearby.push([row - 1, col + 1]); // Top-Right
        }
        if (row < rows - 1 && col < cols - 1) {
          nearby.push([row + 1, col + 1]); // Bottom-Right
        }
      } else {
        if (row > 0 && col > 0) {
          nearby.push([row - 1, col - 1]); // Top-Left
        }
        if (row < rows - 1 && col > 0) {
          nearby.push([row + 1, col - 1]); // Bottom-Left
        }
      }

      return nearby;
    },
    [cols, rows]
  );

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      console.log("clicked", row, col);
      console.log("nearby", nearbyHexes(row, col));
      setCellValues((prev) => ({
        ...prev,
        [`${row},${col}`]: <Hexagon size={hexSize} />,
      }));
    },
    [hexSize, nearbyHexes]
  );

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
                cellValues[`${rowIndex},${colIndex}`]
              ) : (
                <Hexagon
                  size={hexSize}
                  muted
                  onClick={() => onHexagonClick(rowIndex, colIndex)}
                />
              )}
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
