import { Tile } from "@/models/Tile";
import { useCallback, useMemo, useState } from "react";
import { Tile_TOXIC } from "@/constants/hexTiles";

type Props = {
  setCell: (row: number, col: number, tile: Tile) => void;
  removeCell: (row: number, col: number) => void;
};

const useToxicTileTracker = ({ setCell, removeCell }: Props) => {
  const [toxicTiles, setToxicTiles] = useState<ToxicTile[]>([]);

  const addTile = useCallback(
    (tile: ToxicTile) => {
      setToxicTiles([...toxicTiles, tile]);
      setCell(tile.row, tile.col, Tile_TOXIC);
      return tile;
    },
    [toxicTiles, setCell]
  );

  const removeTile = useCallback(
    (tile: ToxicTile) => {
      if (!toxicTiles.includes(tile)) {
        return;
      }
      setToxicTiles(toxicTiles.filter((t) => t !== tile));
      removeCell(tile.row, tile.col);
    },
    [toxicTiles, removeCell]
  );

  return useMemo(
    () => ({ toxicTiles, addTile, removeTile }),
    [toxicTiles, addTile, removeTile]
  );
};

export default useToxicTileTracker;
