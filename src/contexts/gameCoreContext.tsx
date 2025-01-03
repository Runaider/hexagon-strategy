import useStatTracker from "@/hooks/useStatTracker";
import { Tile } from "@/models/Tile";
import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useCallback,
} from "react";
import { useAppConfig } from "./appConfig";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  currentTurn: number;
  score: number;
  isGameOver: boolean;

  cellValues: {
    [key: string]: Tile;
  };
  resources: ResourceProduction;
  tileResourceProduction: {
    [key: string]: ResourceProduction;
  };

  setCell: (row: number, col: number, tile: Tile) => void;
  removeCell: (row: number, col: number) => void;
  canPriceBePaid: (price: ResourceProduction) => boolean;
  payPrice: (price: ResourceProduction) => void;

  setScore: (newScore: number) => void;
  setIsGameOver: (isOver: boolean) => void;
  onTurnChange: () => void;
};

const GameCoreContext = createContext<ContextValues>({} as ContextValues);

const useGameCoreContext = () => useContext(GameCoreContext);

function GameCoreContextProvider({ children }: Props) {
  const {
    config: { rows, cols },
  } = useAppConfig();
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const {
    cellValues,
    resources,
    tileResourceProduction,
    setCell,
    removeCell,
    canPriceBePaid,
    payPrice,
  } = useStatTracker({ rows, cols });

  const onTurnChange = useCallback(() => {
    setCurrentTurn((prev) => prev + 1);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentTurn,
      score,
      isGameOver,

      cellValues,
      resources,
      tileResourceProduction,

      setCell,
      removeCell,
      canPriceBePaid,
      payPrice,

      setScore,
      setIsGameOver,
      onTurnChange,
    }),
    [
      canPriceBePaid,
      cellValues,
      currentTurn,
      isGameOver,
      onTurnChange,
      payPrice,
      removeCell,
      resources,
      score,
      setCell,
      tileResourceProduction,
    ]
  );

  return (
    <GameCoreContext.Provider value={contextValue}>
      {children}
    </GameCoreContext.Provider>
  );
}
export { useGameCoreContext, GameCoreContextProvider };
