import { Modal } from "@mantine/core";
import Container from "../Container";

type Props = {
  quest: QuestInstant;
  isVisible: boolean;
  onClose: () => void;
  onActionClick: (action: QuestInstantAction) => void;
};

function QuestModal({ quest, isVisible, onClose, onActionClick }: Props) {
  const _onActionClick = (action: QuestInstantAction) => {
    console.log("Action clicked", action);
    onActionClick(action);
    onClose();
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
      <div className="m-4 shadow-border">
        <Container>
          <div className="flex items-center justify-center h-[200px] overflow-hidden">
            <img src="./forest_fire.jpg" className="" />
          </div>
        </Container>
      </div>

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
        {quest.actions.map((action) => (
          <div
            key={action.text}
            className="mx-4 mt-2 transition-all  hover:scale-105 hover:shadow-filter-flat cursor-pointer"
            onClick={() => _onActionClick(action)}
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
