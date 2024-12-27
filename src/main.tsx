import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GameBoard from "@/components/Board";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <GameBoard rows={25} cols={25} hexSize={50} />
  // </StrictMode>
);
