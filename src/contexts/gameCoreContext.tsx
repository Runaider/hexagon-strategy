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
import { allTiles, Tile_CASTLE, Tile_TOXIC } from "@/constants/hexTiles";
import UseTileManager from "@/hooks/useTileManager";
import useZoneTracker from "@/hooks/useZoneTracker";
import useTileCostTracker from "@/hooks/useTileCostTracker";
import GameOverScreen from "@/components/GameOverScreen";
import { calculateScoreFromGridData } from "@/utils/calculateScoreFromGridData";
import useToxicTileTracker from "@/hooks/useToxicTileTracker";
import { getNearbyHexes } from "@/utils/nearbyHexes";
import useEvents, { EVENT_TYPES } from "@/hooks/useEvents";
// import { getNearbyHexes } from "@/utils/nearbyHexes";
// import useCellValueStore from "src/dataStores/cellValues";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  currentTurn: number;
  score: number;
  scoreLog: string[];
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
  removeToxicTile: (row: number, col: number) => void;
  getToxicTile: (row: number, col: number) => ToxicTile | undefined;
  isTileToxic: (row: number, col: number) => boolean;
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
  onReset: () => void;
};

const GameCoreContext = createContext<ContextValues>({} as ContextValues);

const useGameCoreContext = () => useContext(GameCoreContext);

function GameCoreContextProvider({ children }: Props) {
  const {
    config: {
      rows,
      cols,
      perTurnResourceProduction,
      maxTurns,
      toxicTileProbability,
    },
  } = useAppConfig();

  const { on: onEvent } = useEvents();
  const [isFirstTilePlaced, setIsFirstTilePlaced] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreLog, setScoreLog] = useState([] as string[]);
  const [currentTurn, setCurrentTurn] = useState(0);

  const { zones, completedZones, setZones } = useZoneTracker({
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
    resetStats,
  } = useStatTracker({ rows: rows!, cols: cols! });

  const {
    activeResource,
    resourcePrice,
    setActiveResource,
    incrementResourceUsedTimes,
    resetTileCosts,
  } = useTileCostTracker(canPriceBePaid);

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
    resetTileManager,
  } = UseTileManager({ allTiles });

  const {
    toxicTiles,
    createToxicTile,
    isTileToxic,
    getToxicTile,
    removeTile: removeToxicTile,
  } = useToxicTileTracker({
    setCell,
    removeCell,
    canPriceBePaid,
    payPrice,
  });

  const onTurnChange = useCallback(() => {
    setCurrentTurn((prev) => prev + 1);
    if (perTurnResourceProduction) {
      gainResources();
    }
  }, [gainResources, perTurnResourceProduction]);

  const onTilePlace = useCallback(
    (row: number, col: number) => {
      if (!perTurnResourceProduction) {
        if (!canPriceBePaid(resourcePrice)) {
          return;
        }
      }

      setCell(row, col, nextTileToPlace);
      moveUpcomingTiles();
      unlockAdjacentHexes(row, col);

      if (perTurnResourceProduction) {
        updateResourceCounts(row, col, nextTileToPlace);
      } else {
        gainResourcesFromAdjacentTiles(row, col, nextTileToPlace);
        payPrice(resourcePrice);
        incrementResourceUsedTimes();
      }

      if (Math.random() < toxicTileProbability!) {
        const nearbyHexes = getNearbyHexes(row, col, rows!, cols!);
        for (const hex of nearbyHexes) {
          const freeHex = !cellValues[`${hex[0]},${hex[1]}`];
          if (freeHex) {
            const tile = createToxicTile(hex[0], hex[1], currentTurn);
            setCell(tile.row, tile.col, Tile_TOXIC);
            break;
          }
        }
      }

      setZones(row, col, nextTileToPlace);
      onTurnChange();
    },
    [
      canPriceBePaid,
      cellValues,
      cols,
      createToxicTile,
      currentTurn,
      gainResourcesFromAdjacentTiles,
      incrementResourceUsedTimes,
      moveUpcomingTiles,
      nextTileToPlace,
      onTurnChange,
      payPrice,
      perTurnResourceProduction,
      resourcePrice,
      rows,
      setCell,
      setZones,
      toxicTileProbability,
      unlockAdjacentHexes,
      updateResourceCounts,
    ]
  );

  const onTileRemove = useCallback(
    (row: number, col: number, tile: Tile) => {
      // const newCellValues = removeCell(row, col);
      // updateSectionCounts(tile);
      // setZones(row, col, tile, newCellValues);
      removeCell(row, col);
      updateSectionCounts(tile);
      setZones(row, col, tile);
    },
    [removeCell, setZones, updateSectionCounts]
  );

  const onReset = useCallback(() => {
    setCurrentTurn(0);
    setScore(0);
    setScoreLog([]);
    setIsGameOver(false);
    resetStats();
    resetTileCosts();
    resetTileManager();
  }, [resetStats, resetTileCosts, resetTileManager]);

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

  useEffect(() => {
    if (currentTurn == maxTurns && !isGameOver) {
      setIsGameOver(true);
      const { score, scoreLog } = calculateScoreFromGridData(
        zones,
        [],
        toxicTiles,
        completedZones
      );
      setScore(score);
      setScoreLog(scoreLog);
    }
  }, [
    completedZones,
    currentTurn,
    isGameOver,
    maxTurns,
    resources.gold,
    toxicTiles,
    zones,
  ]);

  useEffect(() => {
    if (isFirstTilePlaced && Object.keys(cellValues)?.length === 0) {
      setIsFirstTilePlaced(true);
      const centerRow = Math.floor(rows! / 2);
      const centerCol = Math.floor(cols! / 2);
      unlockAdjacentHexes(centerRow, centerCol);
      setCell(centerRow, centerCol, Tile_CASTLE);
    }
  }, [cellValues, cols, isFirstTilePlaced, rows, setCell, unlockAdjacentHexes]);

  // register event listeners
  useEffect(() => {
    const eventCleanup = onEvent(EVENT_TYPES.ZONE_COMPLETE, ({ zone }) => {
      console.log("Zone complete event received", zone);
    });

    return () => {
      eventCleanup();
    };
  }, [onEvent]);

  const contextValue = useMemo(
    () => ({
      currentTurn,
      nextTileToPlace,
      zones,
      score,
      scoreLog,
      isGameOver,

      cellValues,
      resources,
      resourcesPerTurn,
      tileResourceProduction,

      upcomingTiles,
      nextTileIndex,

      unlockedCells,

      tilePlaceResourcePrice: resourcePrice,
      removeToxicTile,
      getToxicTile,
      setTilePlaceActiveResource: setActiveResource,
      isTileToxic,
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
      onReset,
    }),
    [
      currentTurn,
      nextTileToPlace,
      zones,
      score,
      scoreLog,
      isGameOver,
      cellValues,
      resources,
      resourcesPerTurn,
      tileResourceProduction,
      upcomingTiles,
      nextTileIndex,
      unlockedCells,
      resourcePrice,
      removeToxicTile,
      getToxicTile,
      setActiveResource,
      isTileToxic,
      setCell,
      removeCell,
      canPriceBePaid,
      payPrice,
      onTilePlace,
      onTileRemove,
      shuffleTiles,
      setNextTileIndex,
      onTurnChange,
      rotateUpcomingTile,
      onReset,
    ]
  );

  return (
    <GameCoreContext.Provider value={contextValue}>
      {isGameOver && <GameOverScreen />}
      {children}
    </GameCoreContext.Provider>
  );
}
export { useGameCoreContext, GameCoreContextProvider };
