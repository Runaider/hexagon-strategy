import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GameBoard from "./components/Board/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameBoard rows={40} cols={40} hexSize={40} />
  </StrictMode>
);
