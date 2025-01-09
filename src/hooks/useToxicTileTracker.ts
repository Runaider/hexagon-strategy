import { Tile } from "@/models/Tile";
import { useCallback, useMemo, useState } from "react";
import { shuffle } from "lodash";

type Props = {
  setCell: (row: number, col: number, tile: Tile) => void;
  removeCell: (row: number, col: number) => void;
  canPriceBePaid: (price: ResourceProduction) => boolean;
  payPrice: (price: ResourceProduction) => void;
};

const useToxicTileTracker = ({
  removeCell,
  canPriceBePaid,
  payPrice,
}: Props) => {
  const [toxicTiles, setToxicTiles] = useState<ToxicTile[]>([]);
  const [destroyedToxicTiles, setDestroyedToxicTiles] = useState<ToxicTile[]>(
    []
  );

  const getToxicTile = useCallback(
    (row: number, col: number) => {
      return toxicTiles.find((t) => t.row === row && t.col === col);
    },
    [toxicTiles]
  );

  const removeTile = useCallback(
    (row: number, col: number) => {
      const tile = getToxicTile(row, col);
      if (!tile) {
        return;
      }

      if (!canPriceBePaid(tile.priceToDestroy)) return;

      payPrice(tile.priceToDestroy);
      setDestroyedToxicTiles((prev) => [...prev, tile]);
      setToxicTiles((prev) => prev.filter((t) => t !== tile));

      removeCell(row, col);
    },
    [canPriceBePaid, getToxicTile, payPrice, removeCell]
  );

  const isTileToxic = useCallback(
    (row: number, col: number) => {
      console.log("Checking for toxic tile at", row, col, toxicTiles);
      const isToxic = toxicTiles.some((t) => t.row === row && t.col === col);
      if (isToxic) {
        console.log("Toxic tile found at", row, col);
      }
      return isToxic;
    },
    [toxicTiles]
  );

  const createToxicTile = useCallback(
    (row: number, col: number, currentTurn: number) => {
      //  find nearby free hexes
      const priceToDestroy = shuffle([
        {
          wood: 5,
          stone: 5,
        },
        {
          food: 5,
          gold: 5,
        },
        {
          wood: 10,
        },
        {
          stone: 10,
        },
        {
          gold: 10,
        },
        {
          food: 10,
        },
      ])[0];
      const tile = {
        row,
        col,
        priceToDestroy: priceToDestroy,
        spawnedTurn: currentTurn,
        destructionTurn: null,
      };
      setToxicTiles((prev) => [...prev, tile]);
      return tile;
    },
    []
  );

  return useMemo(
    () => ({
      toxicTiles,
      getToxicTile,
      createToxicTile,
      removeTile,
      isTileToxic,
    }),
    [toxicTiles, getToxicTile, createToxicTile, removeTile, isTileToxic]
  );
};

export default useToxicTileTracker;
