import React from "react";
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
  const hexWidth = Math.sqrt(3) * hexSize; // Width of each hexagon
  const hexHeight = 2 * hexSize; // Height of each hexagon
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight; // Vertical distance between rows

  const grid = [];

  return (
    <div>
      {
        // mapp through grid
        Array.from({ length: rows }, (_, rowIndex) => {
          const row = Array.from({ length: cols }, (_, colIndex) => {
            const x =
              colIndex * xOffset + (rowIndex % 2 === 1 ? xOffset / 2 : 0);
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
                <Hexagon size={hexSize} />
              </div>
            );
          });

          grid.push(row);
          return row;
        })
      }
    </div>
  );
};

export default GameBoard;
