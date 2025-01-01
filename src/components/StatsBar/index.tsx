import Container from "../Container";

type Props = {
  wood?: number;
  stone?: number;
  food?: number;
  money?: number;
};

function StatsBar({ wood, stone, food, money }: Props) {
  return (
    <>
      <Container bg="brown">
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-1 font-bold text-lg">{wood ?? 0}</div>
          <img className="w-7 h-7" src="./log.png" />
        </div>
      </Container>
      <div className=" mx-2" />

      <Container>
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-2 font-bold text-lg">{stone ?? 0}</div>
          <img className="w-7 h-7" src="./stone.png" />
        </div>
      </Container>
      <div className=" mx-2" />

      <Container bg="green">
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-1 font-bold text-lg">{food ?? 0}</div>
          <img className="w-7 h-7" src="./food.png" />
        </div>
      </Container>
      <div className=" mx-2" />

      <Container bg="gold">
        <div className="flex justify-between items-center px-4 py-2 min-w-[100px]">
          <div className="mr-1 font-bold text-lg">{money ?? 0}</div>
          <img className="w-7 h-7 " src="./money.png" />
        </div>
      </Container>
    </>
  );
}

export default StatsBar;
