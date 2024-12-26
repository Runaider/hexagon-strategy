import { useCallback, useEffect, useMemo, useState } from "react";

const generatePosesQuest = (
  currentResources: ResourceProduction,
  tileResourceProduction: ResourceProduction
) => {
  const expectedTurnsToComplete = 4;
  const minimalAmount = 5;

  const resourceNames = Object.keys(currentResources) as ResourceNames[];
  const randomResourceName =
    resourceNames[Math.floor(Math.random() * (resourceNames.length - 1))];
  const amountBasedOnResources =
    (currentResources[randomResourceName] || 0) +
      (tileResourceProduction[randomResourceName] || 1) *
        expectedTurnsToComplete || minimalAmount;

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
  tileResourceProduction: ResourceProduction,
  zones: Zones,
  onQuestComplete: (questId: string) => void
) => {
  // const [questRewards, setQuestRewards] = useState<number>(0);
  const [quests, setQuests] = useState<Quest[]>([]);

  const addQuest = useCallback((quest: Quest) => {
    setQuests((prevQuests) => [...prevQuests, quest]);
  }, []);

  const addRandomQuest = useCallback(() => {
    // const quest: Quest = {
    //   id: Math.random().toString(),
    //   title: "Poses 10 wood",
    //   criteria: {
    //     type: "poses",
    //     target: "wood",
    //     amount: 10,
    //   },
    //   description: "Poses 10 wood",
    //   reward: 100,
    //   completed: false,
    // };

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
            // setQuestRewards((prev) => prev + quest.reward);
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
      // questRewards,
      addRandomQuest,
    }),
    [quests, addRandomQuest]
  );
};

export default useQuests;
