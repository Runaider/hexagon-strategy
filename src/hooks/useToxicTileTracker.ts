import { Tile } from "@/models/Tile";
import { useState } from "react";
import { Tile_TOXIC } from "@/constants/hexTiles";

type Props = {
  setCell: (row: number, col: number, tile: Tile) => void;
  removeCell: (row: number, col: number) => void;
};

const useToxicTileTracker = ({ setCell, removeCell }: Props) => {
  const [toxicTiles, setToxicTiles] = useState<ToxicTile[]>([]);

  const addTile = (tile: ToxicTile) => {
    setToxicTiles([...toxicTiles, tile]);
    setCell(tile.row, tile.col, Tile_TOXIC);
    return tile;
  };

  const removeTile = (tile: ToxicTile) => {
    if (!toxicTiles.includes(tile)) {
      return;
    }
    setToxicTiles(toxicTiles.filter((t) => t !== tile));
    removeCell(tile.row, tile.col);
  };

  return { toxicTiles, addTile, removeTile };
};

export default useToxicTileTracker;
