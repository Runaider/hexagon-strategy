import classNames from "classnames";

function StatsBar() {
  return (
    <div
      className={classNames(
        "flex justify-between items-center",
        "bg-[#4b251a]",
        "p-2",
        "border-[2px] border-[#d6ba96] rounded",
        "text-[#dfc89d] font-semibold"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="mr-1">123</div>
        <img className="w-7 h-7" src="./log.png" />
      </div>
      <div className="h-6 border-r-2 border-[#d6ba96] mx-4" />
      <div className="flex justify-between items-center">
        <div className="mr-1">123</div>
        <img className="w-7 h-7" src="./stone.png" />
      </div>
      <div className="h-6 border-r-2 border-[#d6ba96] mx-4" />
      <div className="flex justify-between items-center">
        <div className="mr-1">123</div>
        <img className="w-7 h-7" src="./food.png" />
      </div>
      <div className="h-6 border-r-2 border-[#d6ba96] mx-4" />
      <div className="flex justify-between items-center">
        <div className="mr-1">123</div>
        <img className="w-7 h-7" src="./money.png" />
      </div>
      {/* <div className="h-6 border-r-2 border-[#d6ba96] mx-2" /> */}
    </div>
  );
}

export default StatsBar;
