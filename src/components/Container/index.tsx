import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  bg?: "default" | "brown" | "green" | "gold";
};

function Container({ children, bg = "default" }: Props) {
  const getBgColor = () => {
    switch (bg) {
      case "brown":
        return "bg-[#4b2a03]";
      case "green":
        return "bg-[#184a03]";
      case "gold":
        return "bg-[#4f4200]";
      default:
        return "bg-[#343434]";
    }
  };
  return (
    <div className="flex items-center justify-center  clipped-corner-small  bg-[#dfc89d]">
      <div
        className={classNames(
          "flex items-center w-[calc(100%-8px)] h-[calc(100%-8px)]",
          "clipped-corner-small",
          getBgColor(),
          "text-[#dfc89d]",
          "font-semibold"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Container;
