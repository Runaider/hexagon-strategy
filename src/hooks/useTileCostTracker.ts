import { shuffle } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

const PRICE_INCREASE_EVERY = 5;

function useTileCostTracker(
  canPriceBePaid: (price: { [key in ResourceNames]: number }) => boolean
) {
  const [activeResource, setActiveResource] = useState<ResourceNames>("wood");
  const [resourceUsedTimes, setResourceUsedTimes] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    gold: 0,
  } as { [key in ResourceNames]: number });
  //   const { canPriceBePaid } = useGameCoreContext();

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

  const findResourceWitchCanPay = useCallback(() => {
    let resourceToUse: ResourceNames | null = null;
    shuffle(["wood", "stone", "food", "gold"]).forEach((resource) => {
      if (canPriceBePaid({ [resource]: resourcePrice[resource] })) {
        resourceToUse = resource as ResourceNames;
      }
    });

    return resourceToUse;
  }, [canPriceBePaid, resourcePrice]);

  useEffect(() => {
    if (!canPriceBePaid(resourcePrice)) {
      const resource = findResourceWitchCanPay();
      if (resource) {
        setActiveResource(resource);
      } else {
        alert("You don't have enough resources to pay for this tile");
      }
    }
  }, [canPriceBePaid, findResourceWitchCanPay, resourcePrice]);

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
