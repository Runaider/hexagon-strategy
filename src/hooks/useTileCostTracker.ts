import { useCallback, useMemo, useState } from "react";

const PRICE_INCREASE_EVERY = 5;

function useTileCostTracker() {
  const [activeResource, setActiveResource] = useState<ResourceNames>("wood");
  const [resourceUsedTimes, setResourceUsedTimes] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    gold: 0,
  } as { [key in ResourceNames]: number });

  const resourcePrice = useMemo(() => {
    return {
      [activeResource]:
        1 +
        Math.floor(resourceUsedTimes[activeResource] / PRICE_INCREASE_EVERY),
    };
  }, [activeResource, resourceUsedTimes]);

  const incrementResourceUsedTimes = useCallback(() => {
    setResourceUsedTimes((prev) => ({
      ...prev,
      [activeResource]: prev[activeResource] + 1,
    }));
  }, [activeResource]);

  const resetTileCosts = useCallback(() => {
    setResourceUsedTimes({
      wood: 0,
      stone: 0,
      food: 0,
      gold: 0,
    });
  }, []);

  return useMemo(
    () => ({
      activeResource,
      resourcePrice,
      setActiveResource,
      incrementResourceUsedTimes,
      resetTileCosts,
    }),
    [activeResource, incrementResourceUsedTimes, resetTileCosts, resourcePrice]
  );
}

export default useTileCostTracker;
