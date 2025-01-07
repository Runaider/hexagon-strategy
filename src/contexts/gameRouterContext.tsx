import React, {
  useContext,
  useMemo,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useGameCoreContext } from "./gameCoreContext";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  menu?: JSX.Element;
  game?: JSX.Element;
  leaderboard?: JSX.Element;
};

type ContextValues = {};

const GameRouterContext = createContext<ContextValues>({} as ContextValues);

const useGameRouterContext = () => useContext(GameRouterContext);

function GameRouterProvider({ menu, game, leaderboard }: Props) {
  const [startPressed, setStartPressed] = useState(true);
  const onStartPress = useCallback(() => {
    setStartPressed(true);
  }, [setStartPressed]);
  useEffect(() => {}, []);

  const contextValue = useMemo(() => ({ onStartPress }), [onStartPress]);

  return (
    <GameRouterContext.Provider value={contextValue}>
      {startPressed ? game : menu}
    </GameRouterContext.Provider>
  );
}
export { useGameRouterContext, GameRouterProvider };
