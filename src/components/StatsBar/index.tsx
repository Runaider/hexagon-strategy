import { useGameCoreContext } from "@/contexts/gameCoreContext";
import RollingNumber from "../RollingNumbers";

function StatsBar() {
  const {
    resources: { wood, stone, food, gold: money },
    resourcesPerTurn: {
      wood: woodPerTurn,
      stone: stonePerTurn,
      food: foodPerTurn,
      gold: moneyPerTurn,
    },
  } = useGameCoreContext();
  return (
    <div className="w-screen h-10 bg-background-primary">
      <div className="absolute top-3 flex  shadow-filter-flat px-10">
        <div className="relative">
          <div className="p-2 bg-background-secondary  clipped-corner-medium">
            <div className="flex justify-between items-center min-w-[60px]">
              <div className="mr-1 font-bold text-lg">
                <RollingNumber value={wood ?? 0} />
              </div>
              <img className="w-7 h-7 mr-2" src="./log.png" />
            </div>
          </div>{" "}
          <div className="absolute z-20 right-[-15px] bottom-[-15px] px-2 clipped-corner-medium bg-background-primary">
            +{woodPerTurn}
          </div>
        </div>
        {/*  */}
        <div className=" mx-2" />
        {/*  */}
        <div className="relative">
          <div className="p-2 bg-background-secondary clipped-corner-medium">
            <div className="flex justify-between items-center min-w-[70px]">
              <div className="mr-2 font-bold text-lg">
                <RollingNumber value={stone ?? 0} />
              </div>
              <img className="w-7 h-7 mr-2" src="./stone.png" />
            </div>
          </div>
          <div className="absolute z-20 right-[-15px] bottom-[-15px] px-2 clipped-corner-medium bg-background-primary">
            +{stonePerTurn}
          </div>
        </div>
        {/*  */}
        <div className=" mx-2" />
        {/*  */}
        <div className="relative">
          <div className="p-2 bg-background-secondary clipped-corner-medium">
            <div className="flex justify-between items-center min-w-[70px]">
              <div className="mr-1 font-bold text-lg">
                <RollingNumber value={food ?? 0} />
              </div>
              <img className="w-7 h-7 mr-2" src="./food.png" />
            </div>
          </div>
          <div className="absolute z-20 right-[-15px] bottom-[-15px] px-2 clipped-corner-medium bg-background-primary">
            +{foodPerTurn}
          </div>
        </div>
        {/*  */}
        <div className=" mx-2" />
        {/*  */}

        <div className="relative">
          <div className=" p-2 bg-background-secondary clipped-corner-medium">
            <div className="flex justify-between items-center min-w-[70px] ">
              <div className="mr-1 font-bold text-lg">
                <RollingNumber value={money ?? 0} />
              </div>

              <img className="w-7 h-7 mr-2" src="./money.png" />
            </div>
          </div>
          <div className="absolute z-20 right-[-15px] bottom-[-15px] px-2 clipped-corner-medium bg-background-primary">
            +{moneyPerTurn}
          </div>
        </div>
      </div>
      {/* <Container bg="brown">
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-1 font-bold text-lg">
            {wood ?? 0} +{woodPerTurn}
          </div>
          <img className="w-7 h-7" src="./log.png" />
        </div>
      </Container>
      <div className=" mx-2" />

      <Container>
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-2 font-bold text-lg">
            {stone ?? 0} +{stonePerTurn}
          </div>
          <img className="w-7 h-7" src="./stone.png" />
        </div>
      </Container>
      <div className=" mx-2" />

      <Container bg="green">
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-1 font-bold text-lg">
            {food ?? 0} +{foodPerTurn}
          </div>
          <img className="w-7 h-7" src="./food.png" />
        </div>
      </Container>
      <div className=" mx-2" />

      <Container bg="gold">
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-1 font-bold text-lg">
            {money ?? 0} +{moneyPerTurn}
          </div>
          <img className="w-7 h-7 " src="./money.png" />
        </div>
      </Container> */}
    </div>
  );
}

export default StatsBar;
