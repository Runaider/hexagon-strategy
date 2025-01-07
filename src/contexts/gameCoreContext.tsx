import useStatTracker from "@/hooks/useStatTracker";
import { Tile } from "@/models/Tile";
import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAppConfig } from "./appConfig";
import { allTiles, Tile_CASTLE } from "@/constants/hexTiles";
import UseTileManager from "@/hooks/useTileManager";
import useZoneTracker from "@/hooks/useZoneTracker";
import useTileCostTracker from "@/hooks/useTileCostTracker";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  currentTurn: number;
  score: number;
  isGameOver: boolean;

  zones: Zones;

  cellValues: {
    [key: string]: Tile;
  };
  resources: ResourceProduction;
  resourcesPerTurn: ResourceProduction;
  tileResourceProduction: {
    [key: string]: ResourceProduction;
  };

  upcomingTiles: Tile[];
  nextTileIndex: number;
  unlockedCells: {
    [key: string]: boolean;
  };
  nextTileToPlace: Tile;

  tilePlaceResourcePrice: ResourceProduction;
  setTilePlaceActiveResource: (resource: ResourceNames) => void;

  setNextTileIndex: (index: number) => void;

  setCell: (row: number, col: number, tile: Tile) => void;
  removeCell: (row: number, col: number) => void;
  canPriceBePaid: (price: ResourceProduction) => boolean;
  payPrice: (price: ResourceProduction) => void;

  setScore: (newScore: number) => void;
  setIsGameOver: (isOver: boolean) => void;
  onTurnChange: () => void;

  onTilePlace: (row: number, col: number) => void;
  onTileRemove: (row: number, col: number, tile: Tile) => void;
  rotateUpcomingTile: () => void;

  shuffleTiles: () => void;
};

const GameCoreContext = createContext<ContextValues>({} as ContextValues);

const useGameCoreContext = () => useContext(GameCoreContext);

function GameCoreContextProvider({ children }: Props) {
  const {
    config: { rows, cols, perTurnResourceProduction },
  } = useAppConfig();

  const [isFirstTilePlaced, setIsFirstTilePlaced] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);

  const { zones, setZones } = useZoneTracker({
    rows: rows!,
    cols: cols!,
  });

  const {
    resources,
    tileResourceProduction,
    resourcesPerTurn,

    canPriceBePaid,
    payPrice,
    updateResourceCounts,
    gainResources,
    gainResourcesFromAdjacentTiles,
  } = useStatTracker({ rows: rows!, cols: cols! });

  const {
    activeResource,
    resourcePrice,
    setActiveResource,
    incrementResourceUsedTimes,
  } = useTileCostTracker();

  const {
    nextTileToPlace,
    nextTileIndex,
    cellValues,
    upcomingTiles,
    unlockedCells,
    setNextTileIndex,
    setCell,
    removeCell,
    moveUpcomingTiles,
    unlockAdjacentHexes,
    updateSectionCounts,
    shuffleTiles,
    rotateUpcomingTile,
  } = UseTileManager({ allTiles });

  const onTurnChange = useCallback(() => {
    setCurrentTurn((prev) => prev + 1);
    if (perTurnResourceProduction) {
      gainResources();
    }
  }, [gainResources, perTurnResourceProduction]);

  const onTilePlace = useCallback(
    (row: number, col: number) => {
      if (!perTurnResourceProduction) {
        console.log(
          "Placing tile",
          canPriceBePaid(resourcePrice),
          resourcePrice
        );
        if (!canPriceBePaid(resourcePrice)) {
          return;
        }
      }

      const newCellValues = setCell(row, col, nextTileToPlace);
      moveUpcomingTiles();
      unlockAdjacentHexes(row, col);

      if (perTurnResourceProduction) {
        updateResourceCounts(row, col, nextTileToPlace, newCellValues);
      } else {
        gainResourcesFromAdjacentTiles(
          row,
          col,
          nextTileToPlace,
          newCellValues
        );
        payPrice(resourcePrice);
        incrementResourceUsedTimes();
      }

      setZones(row, col, nextTileToPlace, newCellValues);
      onTurnChange();
    },
    [
      canPriceBePaid,
      gainResourcesFromAdjacentTiles,
      incrementResourceUsedTimes,
      moveUpcomingTiles,
      nextTileToPlace,
      onTurnChange,
      payPrice,
      perTurnResourceProduction,
      resourcePrice,
      setCell,
      setZones,
      unlockAdjacentHexes,
      updateResourceCounts,
    ]
  );

  const onTileRemove = useCallback(
    (row: number, col: number, tile: Tile) => {
      const newCellValues = removeCell(row, col);
      updateSectionCounts(tile);
      setZones(row, col, tile, newCellValues);
    },
    [removeCell, setZones, updateSectionCounts]
  );

  useEffect(() => {
    if (isFirstTilePlaced) {
      return;
    }
    setIsFirstTilePlaced(true);
    const centerRow = Math.floor(rows! / 2);
    const centerCol = Math.floor(cols! / 2);
    unlockAdjacentHexes(centerRow, centerCol);
    setCell(centerRow, centerCol, Tile_CASTLE);
  }, [cols, rows, isFirstTilePlaced, setCell, unlockAdjacentHexes]);

  const contextValue = useMemo(
    () => ({
      currentTurn,
      nextTileToPlace,
      zones,
      score,
      isGameOver,

      cellValues,
      resources,
      resourcesPerTurn,
      tileResourceProduction,

      upcomingTiles,
      nextTileIndex,

      unlockedCells,

      tilePlaceResourcePrice: resourcePrice,
      setTilePlaceActiveResource: setActiveResource,

      setCell,
      removeCell,
      canPriceBePaid,
      payPrice,
      onTilePlace,
      onTileRemove,
      shuffleTiles,
      setNextTileIndex,
      setScore,
      setIsGameOver,
      onTurnChange,
      rotateUpcomingTile,
    }),
    [
      currentTurn,
      nextTileToPlace,
      zones,
      score,
      isGameOver,

      cellValues,
      resources,
      resourcesPerTurn,
      tileResourceProduction,

      upcomingTiles,
      nextTileIndex,

      unlockedCells,

      resourcePrice,
      setActiveResource,

      setCell,
      removeCell,
      canPriceBePaid,
      payPrice,
      onTilePlace,
      onTileRemove,
      shuffleTiles,
      setNextTileIndex,
      setScore,
      setIsGameOver,
      onTurnChange,
      rotateUpcomingTile,
    ]
  );

  return (
    <GameCoreContext.Provider value={contextValue}>
      {children}
    </GameCoreContext.Provider>
  );
}
export { useGameCoreContext, GameCoreContextProvider };
