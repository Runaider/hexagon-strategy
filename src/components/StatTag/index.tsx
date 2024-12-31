import classNames from "classnames";

type Props = {
  content?: JSX.Element;
  icon?: JSX.Element;
};

function StatTag({ content, icon }: Props) {
  return (
    <div className="flex relative justify-center items-center rounded-lg shadow-custom-flat">
      <div className="absolute z-50 right-[-16px] rounded-full shadow-custom-flat">
        <div className="w-10 h-10 bg-[#f4f7f5] rounded-full shadow-custom-inner-highlight">
          {icon}
        </div>
      </div>
      <div
        className={classNames(
          "flex justify-center items-center h-8 min-w-14 pl-2 pr-8",
          //   "bg-gradient-to-b from-[#6c3206] to-[#b2540a]",
          "shadow-custom-inner-highlight",
          "bg-[#ec8f19]",
          "rounded-lg",
          "text-white font-bold text-base"
        )}
      >
        {content}
      </div>
    </div>
  );
}

export default StatTag;
