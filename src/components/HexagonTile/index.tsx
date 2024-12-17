import "./styles.css";

const Hexagon = ({ x, y }) => {
  return (
    <div
      className="hexagon"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    />
  );
};

export default Hexagon;
