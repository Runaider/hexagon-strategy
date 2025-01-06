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
    config: { rows, cols },
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
  } = useStatTracker({ rows: rows!, cols: cols! });

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
    gainResources();
  }, [gainResources]);

  const onTilePlace = useCallback(
    (row: number, col: number) => {
      const newCellValues = setCell(row, col, nextTileToPlace);
      moveUpcomingTiles();
      unlockAdjacentHexes(row, col);
      updateResourceCounts(row, col, nextTileToPlace, newCellValues);
      setZones(row, col, nextTileToPlace, newCellValues);
      onTurnChange();
    },
    [
      moveUpcomingTiles,
      nextTileToPlace,
      onTurnChange,
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
