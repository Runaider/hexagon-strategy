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
        " font-bold",
        "flex row justify-center items-center w-full",
        "opacity-50 hover:opacity-100",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="absolute w-[86px] h-[100px] top-0 flex flex-col items-center justify-center pointer-events-none opacity-85 pt-3">
        <IconBombFilled
          className=" w-6 h-6 -mt-6 -mb-1"
          stroke={1.5}
          color="#dfc89d"
        />
        {!!toxicTile?.priceToDestroy.food && (
          <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
            -{toxicTile?.priceToDestroy.food!}
            <span className="ml-1">
              <ResourceIcon resource={"food"} size="small" />
            </span>
          </div>
        )}
        {!!toxicTile?.priceToDestroy.gold && (
          <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
            -{toxicTile?.priceToDestroy.gold!}
            <span className="ml-1">
              <ResourceIcon resource={"gold"} size="small" />
            </span>
          </div>
        )}
        {!!toxicTile?.priceToDestroy.stone && (
          <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
            -{toxicTile?.priceToDestroy.stone!}
            <span className="ml-1">
              <ResourceIcon resource={"stone"} size="small" />
            </span>
          </div>
        )}
        {!!toxicTile?.priceToDestroy.wood && (
          <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
            -{toxicTile?.priceToDestroy.wood!}
            <span className="ml-1">
              <ResourceIcon resource={"wood"} size="small" />
            </span>
          </div>
        )}
      </div>
      <div>
        {/* <motion.div whileHover={{ scale: 1.2 }}>
          
          </div>
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
        </motion.div> */}
      </div>
    </div>
  );
}

export default HexagonTileToxicOverlay;
