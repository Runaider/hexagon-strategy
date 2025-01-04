import GameBoard from "../Board";
import StatsBar from "../StatsBar";
import UpcomingTiles from "../UpcomingTiles";

function GameLayout() {
  return (
    <div>
      {/* Stats */}
      <div
        className="fixed rounded-md flex text-md text-black"
        style={{ top: "0", left: "50%", transform: "translateX(-50%)" }}
      >
        <StatsBar />
      </div>

      {/* Game Board */}
      <GameBoard />
      {/* Upcoming Tiles */}
      <div
        className="fixed  flex items-center justify-center"
        style={{ bottom: "0", left: "50%", transform: "translateX(-50%)" }}
      >
        <UpcomingTiles />
      </div>
    </div>
  );
}

export default GameLayout;
