import { Tile, TileSectionType } from "@/models/Tile";
import { getHexConnectedToSide } from "@/utils/nearbyHexes";
import { cloneDeep } from "lodash";
import { useCallback, useState } from "react";

type Props = {
  rows: number;
  cols: number;
};

type ResourceNames = "wood" | "stone" | "food" | "gold" | "_";

const Resources: { [key in TileSectionType]: ResourceNames } = {
  [TileSectionType.Forest]: "wood",
  [TileSectionType.Mountains]: "stone",
  [TileSectionType.Plains]: "food",
  [TileSectionType.City]: "gold",
  [TileSectionType.Water]: "_",
  [TileSectionType.Castle]: "_",
  [TileSectionType.Toxic]: "_",
};

const useScoreTracker = ({ rows, cols }: Props) => {
  const [cellValues, setCellValues] = useState<{ [key: string]: Tile }>({});

  const [resources, setResources] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    gold: 0,
    _: 0,
  });

  type ResourceProduction = {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
    _: number;
    isLocked: boolean;
  };

  const [tileResourceProduction, setTileResourceProduction] = useState<{
    [key: string]: ResourceProduction;
  }>({});

  const updateResourceCounts = useCallback(
    (newTileRow: number, newTileCol: number, newTile: Tile) => {
      const tileResources = { ...tileResourceProduction };

      // const resourceCounts = { ...resourcesPerTurn };
      // side 1 is the top right side
      // side 2 is the right side
      // side 3 is the bottom right side
      // side 4 is the bottom left side
      // side 5 is the left side
      // side 6 is the top left side

      newTile.getSides().forEach((side, index) => {
        const connectedHex = getHexConnectedToSide(
          newTileRow,
          newTileCol,
          rows,
          cols,
          index
        );
        if (!connectedHex) {
          console.warn("No connected hex found");
          return;
        }
        const [connectedRow, connectedCol] = connectedHex;
        const connectedTile = cellValues[`${connectedRow},${connectedCol}`];
        if (!connectedTile) {
          return;
        }
        const connectedSide = connectedTile.getSides()[(index + 3) % 6];

        if (connectedSide.type === side.type) {
          tileResources[`${newTileRow},${newTileCol}`] = {
            ...tileResources[`${newTileRow},${newTileCol}`],
            [Resources[side.type as TileSectionType]]:
              (tileResources[`${newTileRow},${newTileCol}`]?.[
                Resources[side.type as TileSectionType]
              ] || 0) + 0.5,
          };
          tileResources[`${connectedRow},${connectedCol}`] = {
            ...tileResources[`${connectedRow},${connectedCol}`],
            [Resources[side.type as TileSectionType]]:
              (tileResources[`${connectedRow},${connectedCol}`]?.[
                Resources[side.type as TileSectionType]
              ] || 0) + 0.5,
          };
        }
      });

      setTileResourceProduction(tileResources);
    },
    [cellValues, cols, rows, tileResourceProduction]
  );

  const setCell = useCallback(
    (row: number, col: number, tile: Tile) => {
      setCellValues((prev) => {
        const newCellValues = { ...prev };
        newCellValues[`${row},${col}`] = cloneDeep(tile);
        return newCellValues;
      });

      updateResourceCounts(row, col, tile);

      setResources((prev) => {
        const newResources = { ...prev };
        Object.entries(tileResourceProduction).forEach(([, value]) => {
          if (value.isLocked) {
            return;
          }
          newResources.wood += value?.wood || 0;
          newResources.stone += value?.stone || 0;
          newResources.food += value?.food || 0;
          newResources.gold += value?.gold || 0;
        });
        return newResources;
      });
    },
    [tileResourceProduction, updateResourceCounts]
  );

  return { cellValues, resources, tileResourceProduction, setCell };
};

export default useScoreTracker;
