import { create } from "zustand";
import { persist } from "zustand/middleware";

type TutorialStore = {
  isTutorialComplete: boolean;
  setTutorialComplete: (isTutorialComplete: boolean) => void;
};

const useTutorialStore = create(
  persist<TutorialStore>(
    (set) => ({
      isTutorialComplete: false,
      setTutorialComplete: (isTutorialComplete: boolean) =>
        set({ isTutorialComplete }),
    }),
    {
      name: "tutorial-storage",
    }
  )
);

export default useTutorialStore;
