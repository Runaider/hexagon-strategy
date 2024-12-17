import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GameBoard from "./components/Board/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameBoard rows={100} cols={100} hexSize={30} />
  </StrictMode>
);
