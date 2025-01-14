import { Modal } from "@mantine/core";
import Container from "../Container";
import { useState } from "react";
import Button from "../Button";
import { motion } from "framer-motion";

type Props = {
  isVisible: boolean;
  onFinish: () => void;
  onSkip: () => void;
};

const TutorialSteps = [
  {
    image: "./tutorial/tutorial_step_0.gif",
    title: "Tutorial",
    details: [
      {
        text: "Welcome to WorldPatch!",
      },
      {
        text: "The goal of the game is to patch a shattered world. ",
      },
      {
        text:
          "Each turn, you will place a hexagon tile to connect regions and earn resources.",
      },
      {
        text: "Can you achieve the highest score in 25 turns?",
      },
    ],
  },
  {
    image: "./tutorial/tutorial_step_1.gif",
    title: "Placing a Tile",
    details: [
      {
        text:
          "To place a patch (hexagon), you must pay 1 resource of your choice.",
      },
      {
        text:
          "The more often you use one resource, the higher its cost will grow.",
      },
      {
        text: "Tiles can be rotated by pressing R on your keyboard",
      },
      {
        text: "Choose your resources wisely!",
      },
    ],
  },
  {
    image: "./tutorial/tutorial_step_2.gif",
    title: "Earning Resources",
    details: [
      {
        text:
          "Resources are earned when you connect hex sides of the same region type:",
      },
      {
        text: "- Forests → Wood",
      },
      {
        text: "- Mountains → Stone",
      },
      {
        text: "- Cities → Gold",
      },
      {
        text: "- Plains → Food",
      },
      {
        text: "Large connected regions give a greater score!",
      },
      {
        text:
          "For enclosed regions, you will earn bonus points at the end of the game.",
      },
    ],
  },
  {
    image: "./tutorial/tutorial_step_3.png",
    title: "Quests and Events",
    details: [
      {
        text: "Occasionally, quests will appear. Quests may:",
      },
      {
        text: "- Reward resources for completing tasks.",
      },
      {
        text: "- Require resources to avoid penalties.",
      },
      {
        text: "- Destroy tiles if ignored.",
      },
      {
        text:
          "Balance your resource consumption to handle these events effectively!",
      },
    ],
  },
  {
    image: "./tutorial/tutorial_step_4.gif",
    title: "Corrupt Hexes",
    details: [
      {
        text:
          "Sometimes, a Corrupt Hex will spawn, blocking your tile placement.",
      },
      {
        text: "- Pay resources to destroy it.",
      },
      {
        text:
          "- If not removed, it will cause a point penalty at the end of the game.",
      },
    ],
  },
  {
    image: "./tutorial/tutorial_step_5.gif",
    title: "Choosing Resources",
    details: [
      {
        text:
          "You can select which resource to spend by clicking the resource boxes at the top of the screen.",
      },
      {
        text:
          "Be mindful of rising costs and switch resources to maintain balance!",
      },
    ],
  },
  {
    image: "./tutorial/tutorial_step_6.png",
    title: "Ending the Game and Scoring",
    details: [
      {
        text: "The game lasts for 25 turns or until no tiles can be purchased.",
      },
      {
        text: "Your final score is based on:",
      },
      {
        text: "- The size of connected regions.",
      },
      {
        text: "- Bonus points for enclosed regions.",
      },
      {
        text: "- Penalties for remaining corrupt hexes.",
      },
      {
        text: "Aim for the highest score!",
      },
    ],
  },
];

function TutorialModal({ isVisible, onSkip, onFinish }: Props) {
  const [tutorialStep, setTutorialStep] = useState(0);

  return (
    <Modal
      classNames={{
        content:
          "bg-background-primary text-text-primary clipped-corner-small ",
        body: "m-0 p-0 ",
      }}
      opened={isVisible}
      onClose={onSkip}
      centered
      withCloseButton={false}
      // height="auto"
      // size={650}
    >
      <div className="m-4 shadow-border">
        <Container bg="none">
          <div className="text-text-primary text-xl font-extrabold px-2 pt-1">
            {TutorialSteps[tutorialStep].title}
          </div>
        </Container>
      </div>
      {TutorialSteps[tutorialStep].image && (
        <div className="m-4 shadow-border">
          <Container>
            <div className="flex items-center justify-center h-[370px] overflow-hidden">
              <img src={TutorialSteps[tutorialStep].image} className="" />
            </div>
          </Container>
        </div>
      )}

      <div className="m-4 shadow-border">
        <Container bg="none">
          <div className="flex flex-col  justify-center h-max-[100vh-75%] overflow-hidden pt-1 pb-2">
            {TutorialSteps[tutorialStep].details.map((detail) => (
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
      <div className="m-4 shadow-border flex justify-between">
        <Button onClick={onSkip} size="large">
          SKIP TUTORIAL
        </Button>
        <motion.div
          animate={{
            x: [0, -10, 10, -15, 15, -10, 10, 0],
            y: [0, -5, 5, -10, 10, -5, 5, 0],
            rotate: [0, -2, 2, -5, 5, -2, 2, 0],
            transition: { duration: 0.6, delay: 5 },
          }}
        >
          <Button
            onClick={() => {
              if (tutorialStep === TutorialSteps.length - 1) {
                onFinish();
              } else {
                setTutorialStep(tutorialStep + 1);
              }
            }}
            size="large"
          >
            {tutorialStep === 0 && "START TUTORIAL"}
            {tutorialStep > 0 &&
              tutorialStep < TutorialSteps.length - 1 &&
              "CONTINUE"}
            {tutorialStep === TutorialSteps.length - 1 && "FINISH TUTORIAL"}
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

export default TutorialModal;
