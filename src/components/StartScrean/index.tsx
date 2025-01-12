import classNames from "classnames";
import Button from "../Button";
import { useGameRouterContext } from "@/contexts/gameRouterContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { set } from "lodash";

function StartScreen() {
  const { onStartPress } = useGameRouterContext();
  const [uiState, setUiState] = useState("open");
  const [translateYValues, setTranslateYValues] = useState<string[]>([]);

  useEffect(() => {
    const vh = window.innerHeight / 100;
    setTranslateYValues([
      "0px",
      `${50 * vh - 20}px`,
      `${50 * vh - 50}px`,
      `${50 * vh - 40}px`,
    ]);
  }, []);
  return (
    <div
      className={classNames(
        "w-screen h-screen relative flex items-center justify-center"
      )}
    >
      <motion.div
        className="absolute w-screen h-[50vh] top-0 bg-background-primary"
        animate={uiState}
        initial="open"
        // initial={{ translateY: "0px" }}
        variants={{
          open: { translateY: "0px" },
          closed: {
            translateY: translateYValues.map((v) => `-${v}`),
            // translateY: [
            //   "0px",
            //   "calc(-50vh + 40px)",
            //   "calc(-50vh + 55px)",
            //   "calc(-50vh + 50px)",
            // ],
          },
        }}
        transition={{
          // delay: 0.5,
          duration: 0.5,
          ease: "easeInOut",
          times: [0, 0.6, 0.8, 1], // Keyframe timings
        }}
      />
      <motion.div
        className="absolute w-screen h-[50vh] bottom-0 bg-background-primary"
        animate={uiState}
        initial={{ translateY: "0px" }}
        variants={{
          open: { translateY: "0px" },
          closed: { translateY: translateYValues },
        }}
        transition={{
          // delay: 0.5,
          duration: 0.5,
          ease: "easeInOut",
          times: [0, 0.6, 0.8, 1], // Keyframe timings
        }}
      />
      <motion.div
        className="absolute w-screen h-screen bg-[radial-gradient(circle,_#00000000,_#242424)]"
        animate={uiState}
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute flex flex-col items-center justify-center">
        <motion.div
          className="text-[86px] text-background-secondary font-bold shadow-filter-flat"
          animate={uiState}
          variants={{
            open: { opacity: 1 },
            closed: { opacity: 0 },
          }}
          transition={{ duration: 1 }}
        >
          WorldPatch
        </motion.div>
        <div className="mb-10" />
        <motion.div
          animate={uiState}
          variants={{
            open: { opacity: 1 },
            closed: { opacity: 0 },
          }}
        >
          <Button
            size="xlarge"
            elevated
            padded
            onClick={() => {
              // onStartPress()
              setUiState("closed");
              setTimeout(() => {
                onStartPress();
              }, 1100);
            }}
          >
            START
          </Button>
        </motion.div>
      </div>
      {/* bg-radial-[at_25%_25%] from-background-primary to-[#242424] to-75% */}
      {/* <div
        className={classNames(
          "absolute w-screen h-screen  z-10",
          "flex items-center justify-center"
        )}
      >
        <div className="shadow-filter-flat">
          <div className=" w-[400px] h-[400px] bg-background-primary text-text-primary font-bold clipped-corner-small ">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="text-4xl">Hexagon TD</div>
              <div className="text-2xl">by Rafal</div>
              <div className="text-xl">Click to start</div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="absolute bg-black opacity-30 w-screen h-screen z-0"></div> */}
    </div>
  );
}

export default StartScreen;
