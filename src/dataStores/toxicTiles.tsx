import { add, remove } from "lodash";
import { create } from "zustand";
//   const [toxicTiles, setToxicTiles] = useState<ToxicTile[]>([]);

type ToxicTileStore = {
  tiles: ToxicTile[];
  setTiles: (tiles: ToxicTile[]) => void;
  addTile: (tile: ToxicTile) => void;
  removeTile: (tile: ToxicTile) => void;
};

const useToxicTileStore = create<ToxicTileStore>((set) => ({
  tiles: [] as ToxicTile[],
  setTiles: (tiles: ToxicTile[]) => set({ tiles }),
  addTile: (tile: ToxicTile) =>
    set((state) => ({ tiles: [...state.tiles, tile] })),
  removeTile: (tile: ToxicTile) =>
    set((state) => ({ tiles: state.tiles.filter((t) => t !== tile) })),
}));

export default useToxicTileStore;
