import { useState } from "react";
import { Tile } from "../../models/Tile";
import Hexagon from "../Hexagon";
import HexagonTile from "../HexagonTile";

type Props = {
  previewTile: Tile;
  hexSize: number;
  isHighlighted: boolean;
  onClick: () => void;
};

function HexagonTilePreview({
  previewTile,
  hexSize,
  isHighlighted,
  onClick,
}: Props) {
  // const [isHoveredOver, setIsHoveredOver] = useState(false);
  return (
    <div
    // onMouseOver={() => setIsHoveredOver(true)}
    // onMouseOut={() => setIsHoveredOver(false)}
    >
      {isHighlighted ? (
        <HexagonTile
          tile={previewTile}
          hexSize={hexSize}
          muted={false}
          onClick={onClick}
        />
      ) : (
        <Hexagon size={hexSize} muted onClick={onClick} />
      )}
    </div>
  );
}

export default HexagonTilePreview;
