import { useMemo } from "react";
import { Tile } from "../../models/Tile";
import Hexagon from "../Hexagon";
import HexagonTile from "../HexagonTile";
import { useGameCoreContext } from "@/contexts/gameCoreContext";
// import RollingNumber from "../RollingNumbers";
import ResourceIcon from "../ResourceIcon";

type Props = {
  previewTile: Tile;
  hexSize: number;
  isHighlighted: boolean;
  row: number;
  col: number;
  onClick: () => void;
};

function HexagonTilePreview({
  previewTile,
  hexSize,
  isHighlighted,
  row,
  col,
  onClick,
}: Props) {
  const { getNewTileResourceProduction } = useGameCoreContext();
  const resourceProduction = useMemo(
    () =>
      Object.entries(
        getNewTileResourceProduction(row, col, previewTile)
      ).reduce(
        (acc, [key, value]) => {
          console.log("key", key, "value", value);
          Object.entries(value).forEach(([key, value]) => {
            // @ts-ignore
            if (acc[key] !== undefined) {
              // @ts-ignore
              acc[key] += value;
            }
          });
          return acc;
        },
        { food: 0, gold: 0, stone: 0, wood: 0 }
      ),
    [col, getNewTileResourceProduction, previewTile, row, previewTile.rotation] // do not forget to account for tile rotation
  );
  // console.log("resourceProduction", resourceProduction);
  // const [isHoveredOver, setIsHoveredOver] = useState(false);
  return (
    <div
    // onMouseOver={() => setIsHoveredOver(true)}
    // onMouseOut={() => setIsHoveredOver(false)}
    >
      {isHighlighted ? (
        <>
          <HexagonTile
            tile={previewTile}
            hexSize={hexSize}
            muted={false}
            onClick={onClick}
          />
          <div className="absolute w-[86px] h-[100px] top-0 flex flex-col items-center justify-center pointer-events-none opacity-85">
            {!!resourceProduction.food && (
              <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
                +{resourceProduction.food!}
                <span className="ml-1">
                  <ResourceIcon resource={"food"} size="small" />
                </span>
              </div>
            )}
            {!!resourceProduction.gold && (
              <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
                +{resourceProduction.gold!}
                <span className="ml-1">
                  <ResourceIcon resource={"gold"} size="small" />
                </span>
              </div>
            )}
            {!!resourceProduction.stone && (
              <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
                +{resourceProduction.stone!}
                <span className="ml-1">
                  <ResourceIcon resource={"stone"} size="small" />
                </span>
              </div>
            )}
            {!!resourceProduction.wood && (
              <div className="bg-background-secondary rounded-md flex text-text-primary items-center px-1 mb-1 font-bold">
                +{resourceProduction.wood!}
                <span className="ml-1">
                  <ResourceIcon resource={"wood"} size="small" />
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <Hexagon size={hexSize} muted onClick={onClick} />
        </div>
      )}
    </div>
  );
}

export default HexagonTilePreview;
