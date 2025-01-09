import { Schema } from "amplify/data/resource";
import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
} from "react";
import { generateClient } from "aws-amplify/data";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  config: Schema["AppConfig"]["type"];
};

const client = generateClient<Schema>();

const defaultConfig = {
  rows: 25,
  cols: 25,
  hexSize: 50,
  toxicTileProbability: 0.1,
  maxTurns: 20,
  previewTileCount: 3,
  perTurnResourceProduction: false,
  actionPrices: {
    rotate: {
      wood: 0,
      stone: 1,
      food: 0,
      gold: 1,
    },
    changeUpcomingHex: {
      wood: 1,
      stone: 0,
      food: 1,
      gold: 0,
    },
    redrawUpcomingHexes: {
      wood: 1,
      stone: 1,
      food: 1,
      gold: 1,
    },
  },
};

const AppConfigContext = createContext<ContextValues>({} as ContextValues);

const useAppConfig = () => useContext(AppConfigContext);

function AppConfigProvider({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<Schema["AppConfig"]["type"]>(
    // @ts-ignore
    defaultConfig
  );

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.AppConfig.list();
    console.error(errors);
    setLoading(false);
    if (errors?.length ?? 0 > 0) {
      return;
    }
    if (items.length === 0) {
      return;
    }
    setConfig(items[0]);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const contextValue = useMemo(() => ({ config, loading }), [config, loading]);

  return (
    <AppConfigContext.Provider value={contextValue}>
      {loading ? <div>Loading...</div> : children}
    </AppConfigContext.Provider>
  );
}
export { useAppConfig, AppConfigProvider };
