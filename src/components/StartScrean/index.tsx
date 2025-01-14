import classNames from "classnames";
import Button from "../Button";
import { useGameRouterContext } from "@/contexts/gameRouterContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/contexts/soundContext";

function StartScreen() {
  const { onStartPress } = useGameRouterContext();
  const [uiState, setUiState] = useState("open");
  const [translateYValues, setTranslateYValues] = useState<string[]>([]);
  const { isMusicOn, playGameMusic } = useSoundContext();

  const onStart = () => {
    if (isMusicOn) {
      playGameMusic();
    }
    setUiState("closed");
    setTimeout(() => {
      onStartPress();
    }, 600);
  };

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
        variants={{
          open: { translateY: "0px" },
          closed: {
            translateY: translateYValues.map((v) => `-${v}`),
          },
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          times: [0, 0.6, 0.8, 1],
        }}
      />
      <motion.div
        className="absolute  w-screen h-[50vh] bottom-0 bg-background-primary"
        animate={uiState}
        initial={{ translateY: "0px" }}
        variants={{
          open: { translateY: "0px" },
          closed: { translateY: translateYValues },
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          times: [0, 0.6, 0.8, 1],
        }}
      />
      <motion.div
        className="absolute z-[300] w-screen h-screen bg-[radial-gradient(circle,_#00000000,_#242424)]"
        animate={uiState}
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute z-[300] flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-[86px] text-background-secondary font-bold shadow-filter-flat"
            animate={uiState}
            variants={{
              open: { opacity: 1 },
              closed: { opacity: 0 },
            }}
            transition={{ duration: 0.5 }}
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
            <Button size="xlarge" elevated padded onClick={onStart}>
              START
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default StartScreen;
