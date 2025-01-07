import classNames from "classnames";
import Button from "../Button";
import { useGameRouterContext } from "@/contexts/gameRouterContext";

function StartScreen() {
  const { onStartPress } = useGameRouterContext();
  return (
    <div
      className={classNames(
        "w-screen h-screen flex items-center justify-center bg-[radial-gradient(circle,_#9b8283,_#242424)]"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-[86px] text-background-secondary font-bold shadow-filter-flat">
          WorldPatch
        </div>
        <div className="mb-10" />
        <Button size="xlarge" elevated padded onClick={onStartPress}>
          START
        </Button>
      </div>
      {/* bg-radial-[at_25%_25%] from-background-primary to-[#242424] to-75% */}
      {/* <div
        className={classNames(
          "absolute w-screen h-screen  z-10",
          "flex items-center justify-center"
        )}
      >
        <div className="shadow-filter-flat">
          <div className=" w-[400px] h-[400px] bg-background-primary text-text-primary font-bold clipped-corner-small ">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="text-4xl">Hexagon TD</div>
              <div className="text-2xl">by Rafal</div>
              <div className="text-xl">Click to start</div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="absolute bg-black opacity-30 w-screen h-screen z-0"></div> */}
    </div>
  );
}

export default StartScreen;
