import { useSoundContext } from "@/contexts/soundContext";
import { IconBombFilled, IconVolume, IconVolumeOff } from "@tabler/icons-react";

function MusicToggle() {
  const { isMusicOn, toggleMusic } = useSoundContext();
  return (
    <div
      className="cursor-pointer hover:scale-125 transition-all p-2 rounded-full bg-background-primary"
      onClick={toggleMusic}
    >
      {isMusicOn ? (
        <IconVolume className=" w-6 h-6" stroke={2.5} color="white" />
      ) : (
        <IconVolumeOff className=" w-6 h-6 " stroke={2.5} color="white" />
      )}
    </div>
  );
}

export default MusicToggle;
