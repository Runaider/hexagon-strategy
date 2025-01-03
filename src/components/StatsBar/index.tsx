import { useGameCoreContext } from "@/contexts/gameCoreContext";
import Container from "../Container";

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
    <>
      <Container bg="brown">
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
      </Container>
    </>
  );
}

export default StatsBar;
