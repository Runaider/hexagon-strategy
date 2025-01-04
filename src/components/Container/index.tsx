import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  bg?: "default" | "brown" | "green" | "gold" | "none";
  withBorder?: boolean;
  fullWidth?: boolean;
};

function Container({
  children,
  bg = "default",
  fullWidth,
  withBorder = true,
}: Props) {
  const getBgColor = () => {
    switch (bg) {
      case "brown":
        return "bg-[#4b2a03]";
      case "green":
        return "bg-[#184a03]";
      case "gold":
        return "bg-[#4f4200]";
      case "none":
        return "";
      default:
        return "bg-[#343434]";
    }
  };
  return (
    <div
      className={classNames(
        "flex items-center justify-center clipped-corner-small",
        withBorder && "bg-background-secondary",
        fullWidth && "w-full"
      )}
    >
      {/* <div className="shadow-border"></div> */}
      <div
        className={classNames(
          "flex items-center m-1",
          "clipped-corner-small",
          getBgColor(),
          "text-[#dfc89d]",
          "font-semibold",
          fullWidth && "w-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Container;
