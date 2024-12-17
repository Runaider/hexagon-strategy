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

  const onHexagonClick = useCallback(
    (row: number, col: number) => {
      setCellValues((prev) => ({
        ...prev,
        [`${row},${col}`]: <Hexagon size={hexSize} />,
      }));
    },
    [hexSize]
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
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
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
