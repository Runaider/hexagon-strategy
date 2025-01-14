import useMusicSettingsStore from "@/dataStores/musicSettingsStore";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

type Props = {
  children?: JSX.Element;
};

type ContextValues = {
  isMusicOn: boolean;
  toggleMusic: () => void;
  playGameMusic: () => void;
  stopGameMusic: () => void;
  playTileDestroySound: () => void;
  playTilePlacementSound: () => void;
  playStatChangeSound: () => void;
  playButtonSound: () => void;
};

const SoundContext = createContext<ContextValues>({} as ContextValues);

const useSoundContext = () => useContext(SoundContext);

function SoundContextProvider({ children }: Props) {
  const isMusicOn = useMusicSettingsStore((state) => state.isMusicOn);
  const setMusicOn = useMusicSettingsStore((state) => state.setMusicOn);
  const [gameMusic] = useState(new Audio("./music/game_music_1.mp3"));
  const [tilePlacementSound] = useState(new Audio("./music/tile_place_4.mp3"));
  const [tileDestroySound] = useState(new Audio("./music/tile_destroy.mp3"));

  //   const [statChangeSound] = useState(new Audio("./music/stat_change_1.mp3"));

  const playGameMusic = useCallback(() => {
    gameMusic.play();
  }, [gameMusic]);

  const stopGameMusic = useCallback(() => {
    gameMusic.pause();
    gameMusic.currentTime = 0;
  }, [gameMusic]);

  const playTilePlacementSound = useCallback(() => {
    tilePlacementSound.currentTime = 0.2;
    tilePlacementSound.volume = 0.8;
    tilePlacementSound.play();
  }, [tilePlacementSound]);

  const playTileDestroySound = useCallback(() => {
    tileDestroySound.currentTime = 0.2;
    tileDestroySound.volume = 0.1;

    tileDestroySound.play();
  }, [tileDestroySound]);

  const playStatChangeSound = useCallback(() => {
    // statChangeSound.currentTime = 0.2;
    // statChangeSound.play();
    // console.log("stat change sound");
    const soundInstance = new Audio("./music/stat_change_1.mp3");
    soundInstance.play();
    console.log("stat change sound");
  }, []);

  const playButtonSound = useCallback(() => {
    const soundInstance = new Audio("./music/tile_place_3.mp3");
    soundInstance.currentTime = 0.275;
    soundInstance.play();
  }, []);

  const toggleMusic = useCallback(() => {
    if (isMusicOn) {
      stopGameMusic();
    } else {
      playGameMusic();
    }
    setMusicOn(!isMusicOn);
  }, [isMusicOn, playGameMusic, stopGameMusic, setMusicOn]);

  const contextValue = useMemo(
    () => ({
      isMusicOn,
      toggleMusic,
      playGameMusic,
      stopGameMusic,
      playTileDestroySound,
      playTilePlacementSound,
      playStatChangeSound,
      playButtonSound,
    }),
    [
      isMusicOn,
      toggleMusic,
      playGameMusic,
      stopGameMusic,
      playTileDestroySound,
      playTilePlacementSound,
      playStatChangeSound,
      playButtonSound,
    ]
  );

  useEffect(() => {
    gameMusic.loop = true;
  }, [gameMusic]);

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
}
export { useSoundContext, SoundContextProvider };
