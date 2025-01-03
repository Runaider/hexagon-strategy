import { useAppConfig } from "@/contexts/appConfig";
import { Tile, TileSectionType } from "@/models/Tile";
import { nearbyHexes } from "@/utils/nearbyHexes";
import { cloneDeep, shuffle } from "lodash";
import { useCallback, useMemo, useState } from "react";

type Props = {
  allTiles: Tile[];
};

function UseTileManager({ allTiles }: Props) {
  const {
    config: { rows, cols },
  } = useAppConfig();
  const [cellValues, setCellValues] = useState<{ [key: string]: Tile }>({});

  const [nextTileIndex, setNextTileIndex] = useState(0);
  const [upcomingTiles, setUpcomingTiles] = useState(shuffle([...allTiles]));
  const [unlockedCells, setUnlockedCells] = useState<{
    [key: string]: boolean;
  }>({});

  const [sectionsCounts, setSectionsCounts] = useState({
    [TileSectionType.City]: 0,
    [TileSectionType.Forest]: 0,
    [TileSectionType.Mountains]: 0,
    [TileSectionType.Plains]: 0,
    [TileSectionType.Water]: 0,
  });

  const unlockAdjacentHexes = useCallback(
    (row: number, col: number) => {
      const nearby = nearbyHexes(row, col, rows!, cols!);
      nearby.forEach(([nearbyRow, nearbyCol]) => {
        setUnlockedCells((prev) => ({
          ...prev,
          [`${nearbyRow},${nearbyCol}`]: true,
        }));
      });
    },
    [cols, rows]
  );

  const updateSectionCounts = useCallback(
    (tile: Tile) => {
      const newSectionCounts = { ...sectionsCounts };
      tile.sides.forEach((side) => {
        newSectionCounts[side.type as keyof typeof newSectionCounts] += 1;
      });
      setSectionsCounts(newSectionCounts);
    },
    [sectionsCounts]
  );

  const moveUpcomingTiles = useCallback(() => {
    const newTile = upcomingTiles[nextTileIndex];
    upcomingTiles.splice(nextTileIndex, 1);
    updateSectionCounts(newTile!);

    setUpcomingTiles([...(upcomingTiles ?? []), newTile!]);
  }, [nextTileIndex, upcomingTiles, updateSectionCounts]);

  const nextTileToPlace = useMemo(() => {
    return upcomingTiles[nextTileIndex];
  }, [nextTileIndex, upcomingTiles]);

  const setCell = useCallback((row: number, col: number, tile: Tile) => {
    let newCellValues = {} as {
      [key: string]: Tile;
    };
    setCellValues((prev) => {
      newCellValues = { ...prev };
      newCellValues[`${row},${col}`] = cloneDeep(tile);
      return newCellValues;
    });

    // if (tile.sides[0].type === TileSectionType.Toxic) {
    //   return;
    // }

    return newCellValues;

    // console.log("Setting cell", row, col, tile);
    //   updateResourceCounts(row, col, tile);

    //   setResources((prev) => {
    //     const newResources = { ...prev };
    //     Object.entries(tileResourceProduction).forEach(([, value]) => {
    //       // if (value.isLocked) {
    //       //   return;
    //       // }
    //       newResources.wood! += value?.wood || 0;
    //       newResources.stone! += value?.stone || 0;
    //       newResources.food! += value?.food || 0;
    //       newResources.gold! += value?.gold || 0;
    //     });
    //     return newResources;
    //   });
  }, []);

  const removeCell = useCallback((row: number, col: number) => {
    let newCellValues = {} as {
      [key: string]: Tile;
    };
    setCellValues((prev) => {
      newCellValues = { ...prev };
      delete newCellValues[`${row},${col}`];
      return newCellValues;
    });

    return newCellValues;

    //   setResources((prev) => {
    //     const newResources = { ...prev };
    //     const tileResource = tileResourceProduction[`${row},${col}`];
    //     if (tileResource) {
    //       newResources.wood! -= tileResource.wood || 0;
    //       newResources.stone! -= tileResource.stone || 0;
    //       newResources.food! -= tileResource.food || 0;
    //       newResources.gold! -= tileResource.gold || 0;
    //     }
    //     return newResources;
    //   });

    //   setTileResourceProduction((prev) => {
    //     const newTileResourceProduction = { ...prev };
    //     delete newTileResourceProduction[`${row},${col}`];
    //     return newTileResourceProduction;
    //   });
  }, []);

  const shuffleTiles = useCallback(() => {
    // if (!canPriceBePaid(actionPrices!.redrawUpcomingHexes)) {
    //   return;
    // }
    // payPrice(actionPrices!.redrawUpcomingHexes);
    setUpcomingTiles(shuffle(upcomingTiles));
  }, [upcomingTiles]);

  const rotateUpcomingTile = useCallback(() => {
    setUpcomingTiles((prev) => {
      prev[nextTileIndex].rotate();

      const newUpcomingTiles = [...prev];
      return newUpcomingTiles;
    });
  }, [nextTileIndex]);

  return useMemo(
    () => ({
      cellValues,
      nextTileToPlace,
      upcomingTiles,
      unlockedCells,
      nextTileIndex,
      setNextTileIndex,
      setUpcomingTiles,
      moveUpcomingTiles,
      unlockAdjacentHexes,
      updateSectionCounts,
      setCell,
      removeCell,
      shuffleTiles,
      rotateUpcomingTile,
    }),
    [
      cellValues,
      nextTileToPlace,
      upcomingTiles,
      unlockedCells,
      nextTileIndex,
      setNextTileIndex,
      setUpcomingTiles,
      moveUpcomingTiles,
      unlockAdjacentHexes,
      updateSectionCounts,
      setCell,
      removeCell,
      shuffleTiles,
      rotateUpcomingTile,
    ]
  );
}

export default UseTileManager;
