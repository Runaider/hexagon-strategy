import { Tile } from "../../models/Tile";
import Hexagon from "../Hexagon";

type Props = {
  tile: Tile;
  hexSize: number;
  muted: boolean;
  onClick: () => void;
};

const HexagonTile = ({ tile, muted, hexSize, onClick }: Props) => {
  return (
    <Hexagon
      size={hexSize}
      muted={muted}
      onClick={onClick}
      colors={tile.getSides()?.map((side) => side.color)}
      img={tile.getSides()?.[0]?.img}
    />
  );
};

export default HexagonTile;
