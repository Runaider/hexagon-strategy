import classNames from "classnames";
import { IconBombFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import ResourceIcon from "../ResourceIcon";

type Props = {
  toxicTile: ToxicTile;
  onClick?: () => void;
};

function HexagonTileToxicOverlay({ toxicTile, onClick }: Props) {
  return (
    <div
      className={classNames(
        "absolute top-0 bottom-0 left-0 right-0 z-10",
        " text-white text-xs font-medium",
        "flex row justify-center items-center w-full",
        "opacity-50 hover:opacity-100",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div>
        <motion.div whileHover={{ scale: 1.2 }}>
          <div>
            {Object.entries(toxicTile?.priceToDestroy)?.map(
              ([resource, amount], index) => (
                <div
                  key={resource}
                  className="relative flex flex-col items-center mb-1 bg-gray-500 rounded-md py-1 px-2"
                >
                  <div className="flex items-center">
                    {amount}
                    <span className="ml-[1px]" />x
                    <span className="ml-[2px]" />
                    <ResourceIcon
                      resource={resource as ResourceNames}
                      size="small"
                    />
                  </div>
                  {index ==
                    Object.keys(toxicTile.priceToDestroy).length - 1 && (
                    <IconBombFilled
                      className=" w-6 h-6 absolute -bottom-6"
                      stroke={1.5}
                      color="white"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HexagonTileToxicOverlay;
