import React, { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { usePrevious } from "@mantine/hooks";

type Props = {
  value: number;
};

function RollingNumber({ value }: Props) {
  const previousValue = usePrevious(value);
  const count = useMotionValue(value);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        count.set(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, count]);

  return (
    <motion.div
      key={value}
      className="inline-block"
      initial={{ scale: 1 }}
      animate={{
        scale: [1.3, 1],
        color:
          (previousValue ?? 0) <= value
            ? ["#06a406", "#000000"]
            : ["#d00505", "#000000"],
      }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.pre>{count}</motion.pre>
    </motion.div>
  );
}

export default RollingNumber;
