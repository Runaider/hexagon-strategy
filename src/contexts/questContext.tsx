import React, {
  useContext,
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useGameCoreContext } from "./gameCoreContext";
import QuestModal from "@/components/QuestModal";
import { useDisclosure } from "@mantine/hooks";
import { allQuests } from "@/constants/quests";
import { cloneDeep, shuffle } from "lodash";
import { useAppConfig } from "./appConfig";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {};

const QuestContext = createContext<ContextValues>({} as ContextValues);

const useQuestContext = () => useContext(QuestContext);

function QuestContextProvider({ children }: Props) {
  const [questsShown, setQuestsShown] = useState(0);
  const quests = useMemo(() => shuffle(cloneDeep(allQuests)), []);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [
    isQuestWindowOpened,
    { open: showQuest, close: hideQuest },
  ] = useDisclosure(false);
  const {
    cellValues,
    currentTurn,
    removeCell,
    payPrice,
  } = useGameCoreContext();
  const {
    config: { maxQuestsPerGame, questProbability },
  } = useAppConfig();

  const onQuestActionClick = useCallback(
    (action: QuestInstantAction) => {
      //   handleActionPrice
      if (action.price) {
        payPrice(action.price);
      }

      if (action.tileModifications) {
        action.tileModifications.forEach((mod) => {
          if (mod.actionType === "remove") {
            let tileToRemoveAmount = mod.amount;

            const tileTypeToRemove = mod.tileSectionType;
            for (const key in cellValues) {
              const tile = cellValues[key];
              const tileWithSideToRemove = tile.sides.find(
                (side) => side.type === tileTypeToRemove
              );
              if (tileWithSideToRemove) {
                // key format `${rowIndex},${colIndex}`
                removeCell(+key.split(",")[0], +key.split(",")[1]);

                tileToRemoveAmount--;
                if (tileToRemoveAmount === 0) {
                  break;
                }
              }
            }
          }
        });
      }
    },
    [cellValues, payPrice, removeCell]
  );

  useEffect(() => {
    if (currentTurn > 5 && questsShown < maxQuestsPerGame!) {
      if (Math.random() < questProbability) {
        setCurrentQuest(quests.pop());
        showQuest();
        setQuestsShown((prev) => prev + 1);
      }
    }
  }, [
    currentTurn,
    maxQuestsPerGame,
    questProbability,
    quests,
    questsShown,
    showQuest,
  ]);

  const contextValue = useMemo(() => ({}), []);

  return (
    <QuestContext.Provider value={contextValue}>
      <QuestModal
        isVisible={isQuestWindowOpened}
        onClose={hideQuest}
        quest={currentQuest}
        onActionClick={onQuestActionClick}
      />
      {children}
    </QuestContext.Provider>
  );
}
export { useQuestContext, QuestContextProvider };
