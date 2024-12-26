import { useCallback, useEffect, useMemo, useState } from "react";

type Quest = {
  id: string;
  title: string;
  criteria: {
    type: "poses" | "gather" | "build";
    target: ResourceNames;
    amount: number;
  };
  description: string;
  reward: number;
  completed: boolean;
};

const useQuests = (resources: ResourceProduction, zones: Zones) => {
  const [questRewards, setQuestRewards] = useState<number>(0);
  const [quests, setQuests] = useState<Quest[]>([]);

  const addQuest = useCallback((quest: Quest) => {
    setQuests((prevQuests) => [...prevQuests, quest]);
  }, []);

  const addRandomQuest = useCallback(() => {
    const quest: Quest = {
      id: Math.random().toString(),
      title: "Poses 10 wood",
      criteria: {
        type: "poses",
        target: "wood",
        amount: 10,
      },
      description: "Poses 10 wood",
      reward: 100,
      completed: false,
    };

    addQuest(quest);
  }, [addQuest]);

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
            setQuestRewards((prev) => prev + quest.reward);
            return { ...quest, completed: true };
          }
        }

        return quest;
      })
    );
  }, [resources]);

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
