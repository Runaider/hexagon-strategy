import { createRoot } from "react-dom/client";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { AppConfigProvider } from "./contexts/appConfig";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import { GameCoreContextProvider } from "./contexts/gameCoreContext";
import { QuestContextProvider } from "./contexts/questContext";
import GameLayout from "./components/GameLayout";
import { GameRouterProvider } from "./contexts/gameRouterContext";
import StartScreen from "./components/StartScrean";

Amplify.configure(outputs);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <MantineProvider defaultColorScheme="dark">
    <AppConfigProvider>
      <GameCoreContextProvider>
        <GameRouterProvider
          menu={<StartScreen />}
          game={
            <QuestContextProvider>
              <GameLayout />
            </QuestContextProvider>
          }
          leaderboard={<></>}
        ></GameRouterProvider>
      </GameCoreContextProvider>
    </AppConfigProvider>
  </MantineProvider>
  // </StrictMode>
);
