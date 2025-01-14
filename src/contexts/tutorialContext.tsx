import React, {
  useContext,
  useMemo,
  createContext,
  useEffect,
  useCallback,
} from "react";

import { useDisclosure } from "@mantine/hooks";
import useTutorialStore from "@/dataStores/tutorial";
import TutorialModal from "@/components/TutorialModal";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {};

const TutorialContext = createContext<ContextValues>({} as ContextValues);

const useTutorialContext = () => useContext(TutorialContext);

function TutorialContextProvider({ children }: Props) {
  const isTutorialComplete = useTutorialStore(
    (state) => state.isTutorialComplete
  );
  const setTutorialComplete = useTutorialStore(
    (state) => state.setTutorialComplete
  );
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure();
  const contextValue = useMemo(() => ({}), []);

  const onComplete = useCallback(() => {
    setTutorialComplete(true);
    closeModal();
  }, [closeModal, setTutorialComplete]);

  useEffect(() => {
    if (!isTutorialComplete) {
      setTimeout(() => {
        openModal();
      }, 1200);
    }
  }, [isTutorialComplete, openModal]);

  return (
    <TutorialContext.Provider value={contextValue}>
      <TutorialModal
        isVisible={isModalOpen}
        onFinish={onComplete}
        onSkip={onComplete}
      />
      {children}
    </TutorialContext.Provider>
  );
}
export { useTutorialContext, TutorialContextProvider };
