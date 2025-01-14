import { Modal } from "@mantine/core";
import Container from "../Container";
import { useGameCoreContext } from "@/contexts/gameCoreContext";
import classNames from "classnames";
import { useResourceIconAnimationContext } from "@/contexts/resourceIconAnimationContext";
import { useRef } from "react";
import { useSoundContext } from "@/contexts/soundContext";

type Props = {
  quest: QuestInstant;
  isVisible: boolean;
  onClose: () => void;
  onActionClick: (action: QuestInstantAction) => void;
};

function QuestModal({ quest, isVisible, onClose, onActionClick }: Props) {
  const { playButtonSound } = useSoundContext();
  const { triggerBubble } = useResourceIconAnimationContext();
  const actionRef = useRef<{ [x: string]: HTMLDivElement | null }>({});
  const { canPriceBePaid } = useGameCoreContext();
  const _onActionClick = (action: QuestInstantAction, index: number) => {
    if (action.price && !canPriceBePaid?.(action.price)) return;
    if (action.price) {
      Object.entries(action.price).forEach(([key, value]) => {
        if (value) {
          triggerBubble(
            actionRef.current[index]!,
            key as ResourceNames,
            value,
            value > 0 ? "red" : "green"
          );
        }
      });
    }
    playButtonSound();
    onActionClick(action);
    setTimeout(() => onClose(), 500);
    // onClose();
  };

  if (!quest) return null;
  return (
    <Modal
      classNames={{
        content:
          "bg-background-primary text-text-primary font-bold clipped-corner-small ",
        body: "m-0 p-0",
      }}
      opened={isVisible}
      onClose={onClose}
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      {quest.image && (
        <div className="m-4 shadow-border">
          <Container>
            <div className="flex items-center justify-center h-[300px] overflow-hidden">
              <img src={quest.image} className="" />
            </div>
          </Container>
        </div>
      )}

      <div className="m-4 shadow-border">
        <Container bg="none">
          <div className="flex flex-col  justify-center h-max-[100vh-75%] overflow-hidden pt-1 pb-2">
            {quest.details.map((detail) => (
              <div
                key={detail.text}
                className="text-text-primary  font-bold px-2 pt-1"
              >
                {detail.text}
              </div>
            ))}
          </div>
        </Container>
      </div>
      <div className="mb-4">
        {quest.actions.map((action, index) => (
          <div
            key={action.text}
            ref={(el) => (actionRef.current[index] = el)}
            className={classNames(
              "mx-4 mt-2 transition-all ",
              !action.price || canPriceBePaid?.(action.price)
                ? "cursor-pointer hover:scale-105 hover:shadow-filter-flat "
                : "cursor-not-allowed opacity-60"
            )}
            onClick={() => _onActionClick(action, index)}
          >
            <div className="shadow-border">
              <Container bg="none" fullWidth>
                <div className=" text-text-primary font-bold p-0 w-full flex flex-col items-center justify-center">
                  <div className="">{action.text}</div>
                  <div className="border-b-[1px] border-text-primary my-1 opacity-30 w-[60%]" />
                  <div className=" italic text-sm font-medium">
                    {action.subtext}
                  </div>
                </div>
              </Container>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default QuestModal;
