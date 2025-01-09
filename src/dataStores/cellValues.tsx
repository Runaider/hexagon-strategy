import { Tile } from "@/models/Tile";
import { create } from "zustand";

// const [cellValues, setCellValues] = useState<{ [key: string]: Tile }>({});

type CellValuesState = {
  values: { [key: string]: Tile };
  setValue: (row: number, col: number, tile: Tile) => void;
  removeValue: (row: number, col: number) => void;
  resetValues: () => void;
};

const useCellValueStore = create<CellValuesState>((set) => ({
  values: {} as { [key: string]: Tile },
  setValue: (row: number, col: number, tile: Tile) =>
    set((state) => ({ values: { ...state.values, [`${row},${col}`]: tile } })),
  removeValue: (row: number, col: number) =>
    set((state) => {
      const newValues = { ...state.values };
      delete newValues[`${row},${col}`];
      return { values: newValues };
    }),
  resetValues: () => set({ values: {} }),
}));

export default useCellValueStore;
