import { useCallback, useEffect, useMemo, useState } from "react";

const generatePosesQuest = (
  currentResources: ResourceProduction,
  tileResourceProduction: { [key: string]: ResourceProduction }
) => {
  const expectedTurnsToComplete = 4;
  const minimalAmount = 5;

  const resourceNames = Object.keys(currentResources) as ResourceNames[];
  const randomResourceName =
    resourceNames[Math.floor(Math.random() * (resourceNames.length - 1))];
  const resourceProduction = Object.values(tileResourceProduction).reduce(
    (acc, val) => acc + (val[randomResourceName] || 0),
    0
  );
  const amountBasedOnResources =
    (currentResources[randomResourceName] || 0) +
      (resourceProduction || 0) * expectedTurnsToComplete || minimalAmount;

  const quest: Quest = {
    id: Math.random().toString(),
    title: `Poses ${amountBasedOnResources} ${randomResourceName}`,
    criteria: {
      type: "poses",
      target: randomResourceName,
      amount: amountBasedOnResources,
    },
    description: `Poses ${amountBasedOnResources} ${randomResourceName}`,
    reward: 100,
    completed: false,
  };
  return quest;
};

const useQuests = (
  resources: ResourceProduction,
  tileResourceProduction: { [key: string]: ResourceProduction },
  zones: Zones,
  onQuestComplete: (questId: string) => void
) => {
  const [quests, setQuests] = useState<Quest[]>([]);

  const addQuest = useCallback((quest: Quest) => {
    setQuests((prevQuests) => [...prevQuests, quest]);
  }, []);

  const addRandomQuest = useCallback(() => {
    const quest = generatePosesQuest(resources, tileResourceProduction);

    addQuest(quest);
    return quest;
  }, [addQuest, resources, tileResourceProduction]);

  const checkQuests = useCallback(() => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (quest.completed) {
          return quest;
        }

        if (quest.criteria.type === "poses") {
          const resourceCount =
            resources[quest.criteria.target as ResourceNames];
          if ((resourceCount ?? 0) >= quest.criteria.amount) {
            onQuestComplete(quest.id);

            return { ...quest, completed: true };
          }
        }

        return quest;
      })
    );
  }, [onQuestComplete, resources]);

  useEffect(() => {
    checkQuests();
  }, [resources, checkQuests]);

  return useMemo(
    () => ({
      quests,
      addRandomQuest,
    }),
    [quests, addRandomQuest]
  );
};

export default useQuests;
