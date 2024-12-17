import Hexagon from "../HexagonTile";

function GameBoard() {
  const hexSize = 30; // Size of a single hexagon (radius)
  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  const xOffset = hexWidth;
  const yOffset = (3 / 4) * hexHeight;

  const rows = 10;
  const cols = 10;

  const hexagons = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * xOffset + (row % 2 === 1 ? xOffset / 2 : 0);
      const y = row * yOffset;
      hexagons.push(<Hexagon key={`${row}-${col}`} x={x} y={y} />);
    }
  }

  return <div>{hexagons}</div>;
}

export default GameBoard;
