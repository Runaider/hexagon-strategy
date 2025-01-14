import React, {
  useContext,
  useMemo,
  useRef,
  useState,
  createContext,
  memo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { isEqual, shuffle } from "lodash";
import { IconMinus, IconPlus } from "@tabler/icons-react";

// resourceIconAnimationContext
type Bubble = {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  delay: number;
  color: "green" | "red";
};

type ContextValues = {
  setStartRef: (ref: React.RefObject<HTMLElement>) => void;
  setEndWoodRef: (ref: React.RefObject<HTMLElement>) => void;
  setEndStoneRef: (ref: React.RefObject<HTMLElement>) => void;
  setEndFoodRef: (ref: React.RefObject<HTMLElement>) => void;
  setEndGoldRef: (ref: React.RefObject<HTMLElement>) => void;
  setScrollRef: (ref: React.RefObject<HTMLDivElement>) => void;
  triggerBubble: (
    element: HTMLDivElement,
    type: ResourceNames,
    count: number,
    color?: "green" | "red"
  ) => void;
};

const ResourceIconAnimationContext = createContext<ContextValues>(
  {} as ContextValues
);

const useResourceIconAnimationContext = () =>
  useContext(ResourceIconAnimationContext);

function ResourceIconAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const endWoodRef = useRef<HTMLElement | null>(null);
  const endStoneRef = useRef<HTMLElement | null>(null);
  const endFoodRef = useRef<HTMLElement | null>(null);
  const endGoldRef = useRef<HTMLElement | null>(null);
  const startRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const setEndWoodRef = (ref: React.RefObject<HTMLElement>) => {
    endWoodRef.current = ref.current;
  };
  const setEndStoneRef = (ref: React.RefObject<HTMLElement>) => {
    endStoneRef.current = ref.current;
  };
  const setEndFoodRef = (ref: React.RefObject<HTMLElement>) => {
    endFoodRef.current = ref.current;
  };
  const setEndGoldRef = (ref: React.RefObject<HTMLElement>) => {
    endGoldRef.current = ref.current;
  };

  const setStartRef = (ref: React.RefObject<HTMLElement>) => {
    startRef.current = ref.current;
  };

  const setScrollRef = (ref: React.RefObject<HTMLDivElement>) => {
    scrollRef.current = ref.current;
  };

  const triggerBubble = (
    element: HTMLDivElement,
    type: ResourceNames,
    count: number,
    color: "green" | "red" = "green"
  ) => {
    const startR = element || startRef?.current;
    let endRef;
    switch (type) {
      case "wood":
        endRef = endWoodRef;
        break;
      case "stone":
        endRef = endStoneRef;
        break;
      case "food":
        endRef = endFoodRef;
        break;
      case "gold":
        endRef = endGoldRef;
        break;
    }
    if (startR && endRef!.current) {
      const start = startR.getBoundingClientRect();
      const end = endRef!.current.getBoundingClientRect();

      for (let i = 0; i < Math.abs(count); i++) {
        setBubbles((prev) => [
          ...prev,
          {
            id: `${type}${Date.now() + i}`,
            start: {
              x: start.left + start.width / 2,
              y: start.top + start.height / 2,
            },
            end: { x: end.left + end.width / 2, y: end.top + end.height / 2 },
            delay: i * 0.1,
            color: color,
          },
        ]);
      }
    }
  };

  const onAnimationComplete = useCallback((id: string) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      setScrollRef,
      setEndWoodRef,
      setEndStoneRef,
      setEndFoodRef,
      setEndGoldRef,
      setStartRef,
      triggerBubble,
    }),
    []
  );

  return (
    <ResourceIconAnimationContext.Provider value={contextValue}>
      {children}

      {/* Floating Bubbles */}
      {bubbles.map((bubble) => {
        return (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onAnimationComplete={onAnimationComplete}
          />
        );
      })}
    </ResourceIconAnimationContext.Provider>
  );
}

const Bubble = memo(
  ({
    bubble,
    onAnimationComplete,
  }: {
    bubble: Bubble;
    onAnimationComplete: (id: string) => void;
    // setBubbles: React.SetStateAction<Bubble[]>;
  }) => {
    return (
      <motion.div
        key={bubble.id}
        initial={{ left: bubble.start.x, top: bubble.start.y }}
        animate={{
          left: [
            bubble.start.x,
            bubble.start.x + shuffle([-20, -15, -10, 10, 15, 20])[0],
            bubble.end.x,
          ],
          top: [
            bubble.start.y,
            bubble.start.y + shuffle([10, 15, 20])[0],
            bubble.end.y,
          ],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: bubble.delay,
          repeat: 0,
        }}
        className="flex items-center justify-center border-[1px] border-solid border-black"
        style={{
          position: "absolute",
          zIndex: 1000,
          width: "12px",
          height: "12px",
          background: bubble.color === "green" ? "#dfc89d" : "#b3453f",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
        onAnimationComplete={() => {
          onAnimationComplete(bubble.id);
        }}
      >
        {bubble.color === "green" ? (
          <IconPlus className="w-4 h-4" stroke={3} color="#3f3937" />
        ) : (
          <IconMinus className="w-4 h-4" stroke={3} color="#3f3937" />
        )}
      </motion.div>
    );
  },
  isEqual
);

export { useResourceIconAnimationContext, ResourceIconAnimationProvider };
