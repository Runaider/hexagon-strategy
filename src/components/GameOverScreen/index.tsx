import Button from "../Button";
import Container from "../Container";
import { useGameCoreContext } from "@/contexts/gameCoreContext";

function GameOverScreen() {
  const { score, scoreLog, onReset } = useGameCoreContext();

  return (
    <div>
      <div className="absolute w-screen h-screen bg-black top-0 z-30 opacity-70"></div>
      <div className="absolute w-screen h-screen flex items-center justify-center top-0 z-30">
        <div className="flex flex-col items-center bg-background-primary text-text-primary font-bold clipped-corner-small w-full max-w-[400px] p-4">
          <div className="text-5xl font-extrabold text-center shadow-filter-flat text-white">
            Game Over
          </div>
          <div></div>
          <div className="m-4 shadow-border w-full">
            <Container bg="none">
              <div className="flex flex-col  h-max-[100vh-75%] overflow-hidden pt-1 pb-2">
                <div className="flex justify-center text-lg text-text-primary font-bold px-2 pt-1">
                  Score: <span className="font-extrabold">{score}</span>
                </div>
                {scoreLog.map((log, index) => (
                  <div
                    className="text-text-primary font-bold px-2 pt-1 ml-2"
                    key={`$log-${index}`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="border-b-[1px] border-text-primary my-1 opacity-30 w-[60%]" />
          <div className="flex justify-center mx-4 mt-4 px-10 w-full">
            <Button onClick={onReset} size="large" fullWidth>
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOverScreen;
