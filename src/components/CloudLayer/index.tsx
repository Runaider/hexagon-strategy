import { motion } from "framer-motion";
import HexagonClouds from "../HexagonClouds";
import { shuffle } from "lodash";
import { memo } from "react";

type Props = {
  rows: number;
  cols: number;
  xOffset: number;
  yOffset: number;
  hexSize: number;
};

const CloudLayer = memo(function CloudLayer({
  rows,
  cols,
  xOffset,
  yOffset,
  hexSize,
}: Props) {
  return (
    <div className="absolute w-full h-full z-0">
      {Array.from({ length: rows! }, (_, rowIndex) => {
        const row = Array.from({ length: cols! }, (_, colIndex) => {
          const x = colIndex * xOffset + (rowIndex % 2 === 1 ? xOffset / 2 : 0);
          const y = rowIndex * yOffset;
          return (
            <div
              key={`te${rowIndex}-${colIndex}`}
              className={` z-0 opacity-1 `}
              style={{
                height: `100px`,
                width: `86px`,
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {Math.random() < 0.05 ? (
                <motion.div
                  key="box"
                  initial={{ opacity: 1, y: 0 }}
                  // animate={{ opacity: 1, y: 0 }} // Animate to
                  exit={{
                    opacity: 0,
                    y: rowIndex < hexSize! / 2 ? -20 : 20,
                    x: colIndex < hexSize! / 2 ? 20 : -20,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ position: "absolute" }}
                  // Exit animation
                >
                  <HexagonClouds
                    scale={shuffle([0.5, 0.75, 1, 1.25])[0]}
                    delay={
                      shuffle([1000, 3000, 6000, 9000, 12000, 15000, 18000])[0]
                    }
                    speed={shuffle([40, 30, 20])[0]}
                    hexSize={hexSize!}
                  />
                </motion.div>
              ) : (
                <></>
              )}
            </div>
          );
        });
        return row;
      })}
    </div>
  );
});

export default CloudLayer;
