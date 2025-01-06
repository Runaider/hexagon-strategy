const Hexagon = ({
  size,
  muted,
  colors,
  img,
  onClick,
}: {
  size: number;
  muted?: boolean;
  colors?: string[];
  img?: string;
  onClick?: () => void;
}) => {
  const width = Math.sqrt(3) * size; // Hexagon width
  const height = 2 * size; // Hexagon height
  const sideColors =
    colors ||
    (muted
      ? ["#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5"]
      : ["#4caf50", "#f44336", "#2196f3", "#ffeb3b", "#9c27b0", "#00bcd4"]);

  // Define hexagon points
  const points = [
    [width / 2, 0], // Top
    [width, height / 4], // Top-right
    [width, (3 * height) / 4], // Bottom-right
    [width / 2, height], // Bottom
    [0, (3 * height) / 4], // Bottom-left
    [0, height / 4], // Top-left
  ];

  const sizeFromPoints = (points: number[][]) => {
    const minX = Math.min(...points.map((p) => p[0]));
    const maxX = Math.max(...points.map((p) => p[0]));
    const minY = Math.min(...points.map((p) => p[1]));
    const maxY = Math.max(...points.map((p) => p[1]));

    return {
      width: maxX - minX,
      height: maxY - minY,
    };
  };
  const sizeByPoints = sizeFromPoints(points);

  return (
    <div className="transition-transform " onClick={onClick}>
      {img ? (
        <div
          className="relative"
          style={{ width: sizeByPoints.width, height: sizeByPoints.height }}
        >
          {" "}
          <img
            src={img}
            style={{ width: sizeByPoints.width, height: sizeByPoints.height }}
            alt="Hexagon"
            // className="object-cover"
          />
        </div>
      ) : (
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
                points={`${start[0]},${start[1]} ${end[0]},${end[1]} ${width /
                  2},${height / 2}`}
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
      )}
    </div>
  );
};

export default Hexagon;
