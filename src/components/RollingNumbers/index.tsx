import React, { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { usePrevious } from "@mantine/hooks";

type Props = {
  value: number;
  delay?: number;
};

function RollingNumber({ value, delay }: Props) {
  const previousValue = usePrevious(value);
  const count = useMotionValue(value);

  useEffect(() => {
    const controls = animate(count, value, {
      delay: delay ?? 0,
      duration: delay ? Math.abs((previousValue ?? 0) - value) * 0.2 : 1,
      ease: "easeOut",
      onUpdate: (latest) => {
        count.set(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, count, delay, previousValue]);

  return (
    <motion.div
      key={value}
      className="inline-block"
      initial={{ scale: 1 }}
      animate={{
        scale:
          previousValue !== undefined &&
          (value > previousValue || value < previousValue)
            ? [1, 1.3, 1]
            : 1,

        color:
          (previousValue ?? 0) <= value
            ? ["#06a406", "#000000"]
            : ["#d00505", "#000000"],
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
        scale: {
          repeat: Math.abs((previousValue ?? 0) - value) - 1,
          duration: 0.1,
          delay: delay ?? 0,
        },
      }}
    >
      <motion.pre>{count}</motion.pre>
    </motion.div>
  );
}

export default RollingNumber;
