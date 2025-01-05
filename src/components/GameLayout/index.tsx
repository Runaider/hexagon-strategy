import GameBoard from "../Board";
import StatsBar from "../StatsBar";
import UpcomingTiles from "../UpcomingTiles";

function GameLayout() {
  return (
    <div>
      {/* Stats */}
      <div
        className="fixed rounded-md flex text-md text-black z-10"
        style={{ top: "0", left: "50%", transform: "translateX(-50%)" }}
      >
        <StatsBar />
      </div>

      {/* Game Board */}
      <div className="fixed top-[40px] w-screen h-[calc(100vh-80px)] overflow-auto">
        <GameBoard />
      </div>
      {/* Upcoming Tiles */}
      <div
        className="fixed  flex items-center justify-center z-10 "
        style={{ bottom: "0", left: "50%", transform: "translateX(-50%)" }}
      >
        <UpcomingTiles />
      </div>
    </div>
  );
}

export default GameLayout;
