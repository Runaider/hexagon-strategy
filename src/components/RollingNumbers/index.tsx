import React, { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { usePrevious } from "@mantine/hooks";

type Props = {
  value: number;
};

function RollingNumber({ value }: Props) {
  const previousValue = usePrevious(value || 0);

  // Reference for motion.div to control text content
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (previousValue === value) return;
    const controlNumbers = animate(previousValue, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (currentValue) => {
        if (ref.current) {
          ref.current.textContent = Math.round(currentValue).toString();
        }
      },
    });

    return () => controlNumbers.stop();
  }, [previousValue, value]);

  return (
    <motion.div
      ref={ref}
      key={value} // Dynamically trigger animation by changing the key
      className="inline-block"
      initial={{ scale: 1 }}
      animate={{ scale: [1.3, 1], color: ["#22c55e", "#000000"] }} // Scale and color animation
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {value}
    </motion.div>
  );
}

export default RollingNumber;
