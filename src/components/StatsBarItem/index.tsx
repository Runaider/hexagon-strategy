import classNames from "classnames";
import ResourceIcon from "../ResourceIcon";
import RollingNumber from "../RollingNumbers";
import { Tooltip } from "@mantine/core";

type Props = {
  amount: number;
  amountPerTurn: number;
  resource: ResourceNames;
  showPerTurn?: boolean;
  isActive?: boolean;
  onClick?: () => void;
};

function StatsBarItem({
  amount,
  amountPerTurn,
  resource,
  showPerTurn,
  isActive,
  onClick,
}: Props) {
  return (
    <Tooltip
      label="Use for tile placement"
      transitionProps={{ transition: "fade", duration: 400, enterDelay: 300 }}
    >
      <div
        className={classNames(
          "relative cursor-pointer transform duration-200",
          isActive && "scale-125 mt-2"
        )}
        onClick={onClick}
      >
        <div className="p-2 bg-background-secondary  clipped-corner-medium">
          <div className="flex justify-between items-center min-w-[60px]">
            <div className="mr-1 font-bold text-lg">
              <RollingNumber value={amount} />
            </div>
            <ResourceIcon resource={resource} />
          </div>
        </div>
        {showPerTurn && (
          <div className="absolute z-20 right-[-15px] bottom-[-15px] px-2 clipped-corner-medium bg-background-primary">
            +{amountPerTurn}
          </div>
        )}
      </div>
    </Tooltip>
  );
}

export default StatsBarItem;
