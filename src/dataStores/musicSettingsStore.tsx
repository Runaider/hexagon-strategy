import { create } from "zustand";
import { persist } from "zustand/middleware";

type MusicSettingsStore = {
  isMusicOn: boolean;
  setMusicOn: (isMusicOn: boolean) => void;
};

const useMusicSettingsStore = create(
  persist<MusicSettingsStore>(
    (set) => ({
      isMusicOn: true,
      setMusicOn: (isMusicOn: boolean) => set({ isMusicOn }),
      //    (isTutorialComplete: boolean) =>
      //     set({ isTutorialComplete }),
    }),
    {
      name: "music-settings-storage",
    }
  )
);

export default useMusicSettingsStore;
