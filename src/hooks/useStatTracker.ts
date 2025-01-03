import { Tile, TileSectionType } from "@/models/Tile";
import { getHexConnectedToSide } from "@/utils/nearbyHexes";
import { useCallback, useMemo, useState } from "react";

type Props = {
  rows: number;
  cols: number;
};

const Resources: {
  [TileSectionType.Forest]: ResourceNames;
  [TileSectionType.Mountains]: ResourceNames;
  [TileSectionType.Plains]: ResourceNames;
  [TileSectionType.City]: ResourceNames;
} = {
  [TileSectionType.Forest]: "wood",
  [TileSectionType.Mountains]: "stone",
  [TileSectionType.Plains]: "food",
  [TileSectionType.City]: "gold",
};

const useScoreTracker = ({ rows, cols }: Props) => {
  // const [cellValues, setCellValues] = useState<{ [key: string]: Tile }>({});

  const [resources, setResources] = useState<ResourceProduction>({
    wood: 10,
    stone: 10,
    food: 10,
    gold: 10,
  });

  const [tileResourceProduction, setTileResourceProduction] = useState<{
    [key: string]: ResourceProduction;
  }>({});

  const resourcesPerTurn = useMemo(() => {
    const resourceCounts = {
      wood: 0,
      stone: 0,
      food: 0,
      gold: 0,
    };
    for (const [key, value] of Object.entries(tileResourceProduction)) {
      console.log("key", key);
      console.log("value", value);
      // if (value.isLocked) {
      //   continue;
      // }
      resourceCounts.wood += value.wood || 0;
      resourceCounts.stone += value.stone || 0;
      resourceCounts.food += value.food || 0;
      resourceCounts.gold += value.gold || 0;
    }
    return resourceCounts;
  }, [tileResourceProduction]);

  console.log("tileResourceProduction", tileResourceProduction);

  const updateResourceCounts = useCallback(
    (
      newTileRow: number,
      newTileCol: number,
      newTile: Tile,
      cellValues: { [key: string]: Tile }
    ) => {
      console.log("Updating resource counts");
      console.log("newTileRow", newTileRow);
      console.log("newTileCol", newTileCol);
      console.log("newTile", newTile);
      console.log("cellValues", cellValues);
      console.log("====================================");

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

        // if (
        //   !(
        //     connectedSide.type in
        //     [
        //       TileSectionType.Forest,
        //       TileSectionType.Mountains,
        //       TileSectionType.Plains,
        //       TileSectionType.City,
        //     ]
        //   )
        // ) {
        //   return;
        // }
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
    [cols, rows, tileResourceProduction]
  );

  const gainResources = useCallback(() => {
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
  }, [tileResourceProduction]);

  // const

  // const setCell = useCallback(
  //   (row: number, col: number, tile: Tile) => {
  //     setCellValues((prev) => {
  //       const newCellValues = { ...prev };
  //       newCellValues[`${row},${col}`] = cloneDeep(tile);
  //       return newCellValues;
  //     });

  //     if (tile.sides[0].type === TileSectionType.Toxic) {
  //       return;
  //     }
  //     // console.log("Setting cell", row, col, tile);
  //     updateResourceCounts(row, col, tile);

  //     setResources((prev) => {
  //       const newResources = { ...prev };
  //       Object.entries(tileResourceProduction).forEach(([, value]) => {
  //         // if (value.isLocked) {
  //         //   return;
  //         // }
  //         newResources.wood! += value?.wood || 0;
  //         newResources.stone! += value?.stone || 0;
  //         newResources.food! += value?.food || 0;
  //         newResources.gold! += value?.gold || 0;
  //       });
  //       return newResources;
  //     });
  //   },
  //   [tileResourceProduction, updateResourceCounts]
  // );

  // const removeCell = useCallback(
  //   (row: number, col: number) => {
  //     setCellValues((prev) => {
  //       const newCellValues = { ...prev };
  //       delete newCellValues[`${row},${col}`];
  //       return newCellValues;
  //     });

  //     setResources((prev) => {
  //       const newResources = { ...prev };
  //       const tileResource = tileResourceProduction[`${row},${col}`];
  //       if (tileResource) {
  //         newResources.wood! -= tileResource.wood || 0;
  //         newResources.stone! -= tileResource.stone || 0;
  //         newResources.food! -= tileResource.food || 0;
  //         newResources.gold! -= tileResource.gold || 0;
  //       }
  //       return newResources;
  //     });

  //     setTileResourceProduction((prev) => {
  //       const newTileResourceProduction = { ...prev };
  //       delete newTileResourceProduction[`${row},${col}`];
  //       return newTileResourceProduction;
  //     });
  //   },
  //   [tileResourceProduction]
  // );

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
      
      resources,
      resourcesPerTurn,
      tileResourceProduction,
      payPrice,
      canPriceBePaid,
      updateResourceCounts,
      gainResources,
    }),
    [
      resources,
      resourcesPerTurn,
      tileResourceProduction,
      payPrice,
      canPriceBePaid,
      updateResourceCounts,
      gainResources,
    ]
  );
};

export default useScoreTracker;
