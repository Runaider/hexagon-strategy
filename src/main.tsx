import { createRoot } from "react-dom/client";
import GameBoard from "@/components/Board";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { AppConfigProvider } from "./contexts/appConfig";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import { GameCoreContextProvider } from "./contexts/gameCoreContext";
import { QuestContextProvider } from "./contexts/questContext";

Amplify.configure(outputs);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <MantineProvider defaultColorScheme="dark">
    <AppConfigProvider>
      <GameCoreContextProvider>
        <QuestContextProvider>
          <GameBoard />
        </QuestContextProvider>
      </GameCoreContextProvider>
    </AppConfigProvider>
  </MantineProvider>
  // </StrictMode>
);
