import { Tile, TileSectionType } from "@/models/Tile";
import { getHexConnectedToSide } from "@/utils/nearbyHexes";
import { useCallback, useMemo, useState } from "react";
import useCellValueStore from "@/dataStores/cellValues";

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
  const cellValues = useCellValueStore((state) => state.values);
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
      resourceCounts.wood += value.wood || 0;
      resourceCounts.stone += value.stone || 0;
      resourceCounts.food += value.food || 0;
      resourceCounts.gold += value.gold || 0;
    }
    return resourceCounts;
  }, [tileResourceProduction]);

  const updateResourceCounts = useCallback(
    (
      newTileRow: number,
      newTileCol: number,
      newTile: Tile
      // cellValues: { [key: string]: Tile }
    ) => {
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
        if (
          !(
            connectedSide.type == TileSectionType.Mountains ||
            connectedSide.type == TileSectionType.Forest ||
            connectedSide.type == TileSectionType.Plains ||
            connectedSide.type == TileSectionType.City
          )
        ) {
          // debugger;s
          return;
        }

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

  const gainResourcesFromAdjacentTiles = useCallback(
    (newTileRow: number, newTileCol: number, newTile: Tile) => {
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
          setResources((prev) => {
            const newResources = { ...prev };
            newResources[Resources[side.type as keyof typeof Resources]]! += 1;

            return newResources;
          });
        }
      });
    },
    [cellValues, cols, rows]
  );

  const canPriceBePaid = useCallback(
    (price: ResourceProduction) => {
      for (const [key, value] of Object.entries(price)) {
        if ((resources[key as ResourceNames] || 0) < (value ?? 0)) {
          return false;
        }
      }
      return true;
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

  const resetStats = useCallback(() => {
    setResources({
      wood: 10,
      stone: 10,
      food: 10,
      gold: 10,
    });
    setTileResourceProduction({});
  }, []);

  return useMemo(
    () => ({
      resources,
      resourcesPerTurn,
      tileResourceProduction,
      payPrice,
      canPriceBePaid,
      updateResourceCounts,
      gainResources,
      gainResourcesFromAdjacentTiles,
      resetStats,
    }),
    [
      resources,
      resourcesPerTurn,
      tileResourceProduction,
      payPrice,
      canPriceBePaid,
      updateResourceCounts,
      gainResources,
      gainResourcesFromAdjacentTiles,
      resetStats,
    ]
  );
};

export default useScoreTracker;
