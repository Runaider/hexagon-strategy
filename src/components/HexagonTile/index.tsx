import "./styles.css";

const HexagonTile = ({ x, y }) => {
  return (
    <div
      className="hexagon"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    />
  );
};

export default HexagonTile;
