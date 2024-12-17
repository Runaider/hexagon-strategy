import React from "react";

const Hexagon = ({ size, colors }: { size: number; colors?: string[] }) => {
  const width = Math.sqrt(3) * size; // Hexagon width
  const height = 2 * size; // Hexagon height
  const sideColors = colors || [
    "#4caf50",
    "#f44336",
    "#2196f3",
    "#ffeb3b",
    "#9c27b0",
    "#00bcd4",
  ];

  // Define hexagon points
  const points = [
    [width / 2, 0], // Top
    [width, height / 4], // Top-right
    [width, (3 * height) / 4], // Bottom-right
    [width / 2, height], // Bottom
    [0, (3 * height) / 4], // Bottom-left
    [0, height / 4], // Top-left
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {points.map((start, index) => {
        const end = points[(index + 1) % points.length];
        return (
          <polygon
            key={index}
            points={`${start[0]},${start[1]} ${end[0]},${end[1]} ${width / 2},${
              height / 2
            }`}
            fill={sideColors[index]}
          />
        );
      })}
      <polygon
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Hexagon;
