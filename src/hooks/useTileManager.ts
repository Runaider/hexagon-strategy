import { useAppConfig } from "@/contexts/appConfig";
import { Tile, TileSectionType } from "@/models/Tile";
import { getNearbyHexes } from "@/utils/nearbyHexes";
import { cloneDeep, shuffle } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import useCellValueStore from "@/dataStores/cellValues";

type Props = {
  allTiles: Tile[];
};

function UseTileManager({ allTiles }: Props) {
  const {
    config: { rows, cols },
  } = useAppConfig();
  // const [cellValues, setCellValues] = useState<{ [key: string]: Tile }>({});
  const cellValues = useCellValueStore((state) => state.values);
  const setCellValue = useCellValueStore((state) => state.setValue);
  const removeCellValue = useCellValueStore((state) => state.removeValue);
  const resetCellValues = useCellValueStore((state) => state.resetValues);

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
      const nearby = getNearbyHexes(row, col, rows!, cols!);
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

  const setCell = useCallback(
    (row: number, col: number, tile: Tile) => {
      // const newCellValues = { ...cellValues };
      // newCellValues[`${row},${col}`] = cloneDeep(tile);
      setCellValue(row, col, cloneDeep(tile));

      // return cloneDeep(newCellValues);
    },
    [setCellValue]
  );

  const removeCell = useCallback(
    (row: number, col: number) => {
      removeCellValue(row, col);
    },
    [removeCellValue]
  );

  const shuffleTiles = useCallback(() => {
    setUpcomingTiles(shuffle(upcomingTiles));
  }, [upcomingTiles]);

  const rotateUpcomingTile = useCallback(() => {
    setUpcomingTiles((prev) => {
      prev[nextTileIndex].rotate();

      const newUpcomingTiles = [...prev];
      return newUpcomingTiles;
    });
  }, [nextTileIndex]);

  const resetTileManager = useCallback(() => {
    resetCellValues();
    setNextTileIndex(0);
    setUpcomingTiles(shuffle([...allTiles]));
    setUnlockedCells({});
    setSectionsCounts({
      [TileSectionType.City]: 0,
      [TileSectionType.Forest]: 0,
      [TileSectionType.Mountains]: 0,
      [TileSectionType.Plains]: 0,
      [TileSectionType.Water]: 0,
    });
  }, [allTiles, resetCellValues]);

  // useEffect(() => {
  //   console.log("cell values changed", cloneDeep(cellValues));
  // }, [cellValues]);

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
      resetTileManager,
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
      resetTileManager,
    ]
  );
}

export default UseTileManager;
