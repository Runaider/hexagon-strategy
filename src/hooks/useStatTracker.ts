import { Tile, TileSectionType } from "@/models/Tile";
import { getHexConnectedToSide } from "@/utils/nearbyHexes";
import { cloneDeep } from "lodash";
import { useCallback, useMemo, useState } from "react";

type Props = {
  rows: number;
  cols: number;
};

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

  const [resources, setResources] = useState<ResourceProduction>({
    wood: 10,
    stone: 10,
    food: 10,
    gold: 10,
    _: 0,
  });

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
          console.info("No connected tile");
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

      if (tile.sides[0].type === TileSectionType.Toxic) {
        return;
      }
      // console.log("Setting cell", row, col, tile);
      updateResourceCounts(row, col, tile);

      setResources((prev) => {
        const newResources = { ...prev };
        Object.entries(tileResourceProduction).forEach(([, value]) => {
          // if (value.isLocked) {
          //   return;
          // }
          newResources.wood! += value?.wood || 0;
          newResources.stone! += value?.stone || 0;
          newResources.food! += value?.food || 0;
          newResources.gold! += value?.gold || 0;
        });
        return newResources;
      });
    },
    [tileResourceProduction, updateResourceCounts]
  );

  const removeCell = useCallback(
    (row: number, col: number) => {
      setCellValues((prev) => {
        const newCellValues = { ...prev };
        delete newCellValues[`${row},${col}`];
        return newCellValues;
      });

      setResources((prev) => {
        const newResources = { ...prev };
        const tileResource = tileResourceProduction[`${row},${col}`];
        if (tileResource) {
          newResources.wood! -= tileResource.wood || 0;
          newResources.stone! -= tileResource.stone || 0;
          newResources.food! -= tileResource.food || 0;
          newResources.gold! -= tileResource.gold || 0;
        }
        return newResources;
      });

      setTileResourceProduction((prev) => {
        const newTileResourceProduction = { ...prev };
        delete newTileResourceProduction[`${row},${col}`];
        return newTileResourceProduction;
      });
    },
    [tileResourceProduction]
  );

  const canPriceBePaid = useCallback(
    (price: ResourceProduction) => {
      return (
        (resources.wood || 0) >= (price.wood || 0) &&
        (resources.stone || 0) >= (price.stone || 0) &&
        (resources.food || 0) >= (price.food || 0) &&
        (resources.gold || 0) >= (price.gold || 0)
      );
    },
    [resources]
  );

  const payPrice = useCallback(
    (price: ResourceProduction) => {
      setResources((prev) => {
        const newResources = { ...prev };
        newResources.wood! -= price.wood || 0;
        newResources.stone! -= price.stone || 0;
        newResources.food! -= price.food || 0;
        newResources.gold! -= price.gold || 0;
        return newResources;
      });
    },
    [setResources]
  );

  return useMemo(
    () => ({
      cellValues,
      resources,
      tileResourceProduction,
      payPrice,
      canPriceBePaid,
      setCell,
      removeCell,
    }),
    [
      cellValues,
      resources,
      tileResourceProduction,
      payPrice,
      canPriceBePaid,
      setCell,
      removeCell,
    ]
  );
};

export default useScoreTracker;
