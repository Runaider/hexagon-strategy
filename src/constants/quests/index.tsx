const forestFireQuest = {
  image: "./quest_images/forest_fire.jpeg",
  details: [
    {
      text:
        "Thick smoke rises from the dense forest nearby, and the crackling of flames echoes through the trees.",
    },
    { text: "A wildfire has broken out." },
    {
      text: "Time is of the essence. How will you respond?",
    },
  ],

  actions: [
    {
      text: "Dispatch Firefighters",
      subtext: "Lose 5 Gold and 5 Food",
      price: { gold: 5, food: 5, wood: 0, stone: 0, _: 0 },
    },
    {
      text: "Evacuate Nearby Settlements",
      subtext: "City tile will be destroyed",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "City",
        },
      ],
    },
    {
      text: "Let Nature Take Its Course",
      subtext: "Some forest tiles will be destroyed",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "Forest",
        },
      ],
    },
  ],
} as QuestInstant;

const banditRaidQuest = {
  image: "./quest_images/bandit_raid.jpeg",
  details: [
    { text: "Bandits are raiding a nearby city!" },
    { text: "Choose how to handle them." },
  ],
  actions: [
    {
      text: "Pay them off",
      subtext: "Costs 10 gold to avoid destruction.",
      price: { gold: 10 },
      tileModifications: [],
    },
    {
      text: "Build defenses",
      subtext: "Costs 5 stone but secures the city.",
      price: { stone: 5 },
      tileModifications: [],
    },
    {
      text: "Ignore the raid",
      subtext: "Destroys 1 city tile.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "City",
        },
      ],
    },
  ],
} as QuestInstant;

const floodWarningQuest = {
  image: "./quest_images/flood_warning.jpeg",
  details: [
    { text: "Heavy rains are causing floods in the plains!" },
    { text: "Take preventive measures or face the consequences." },
  ],
  actions: [
    {
      text: "Divert the water",
      subtext: "Costs 7 stone to build channels.",
      price: { stone: 7 },
      tileModifications: [],
    },
    {
      text: "Abandon the plains",
      subtext: "Destroys 2 plains tiles.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 2,
          tileSectionType: "Plains",
        },
      ],
    },
  ],
} as QuestInstant;

const plaqueOutbreakQuest = {
  image: "./quest_images/plague_outbreak.jpeg",
  details: [
    { text: "A plague has broken out in the city!" },
    { text: "Act quickly to contain it." },
  ],
  actions: [
    {
      text: "Provide medicine",
      subtext: "Costs 5 grain and 3 gold.",
      price: { grain: 5, gold: 3 },
      tileModifications: [],
    },
    {
      text: "Quarantine the city",
      subtext: "Destroys 1 city tile but stops the spread.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "City",
        },
      ],
    },
  ],
} as QuestInstant;

const earthQuakeQuest = {
  image: "./quest_images/earthquake.jpeg",
  details: [
    { text: "An earthquake has struck the mountains!" },
    { text: "Reinforce the area or face further destruction." },
  ],
  actions: [
    {
      text: "Reinforce structures",
      subtext: "Costs 12 stone.",
      price: { stone: 12 },
      tileModifications: [],
    },
    {
      text: "Abandon the area",
      subtext: "Destroys 2 mountain tiles.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 2,
          tileSectionType: "Mountains",
        },
      ],
    },
  ],
} as QuestInstant;

const grainInfestationQuest = {
  image: "./quest_images/grain_infestation.jpeg",
  details: [
    { text: "A locust swarm has infested the plains!" },
    { text: "Protect your crops or lose them." },
  ],
  actions: [
    {
      text: "Use pesticides",
      subtext: "Costs 10 gold.",
      price: { gold: 10 },
      tileModifications: [],
    },
    {
      text: "Abandon the fields",
      subtext: "Destroys 2 plains tiles.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 2,
          tileSectionType: "Plains",
        },
      ],
    },
  ],
} as QuestInstant;

const huntingAccidentQuest = {
  image: "./quest_images/hunting_accident.jpeg",
  details: [
    { text: "A hunting accident has occurred in the forest!" },
    { text: "Decide how to respond." },
  ],
  actions: [
    {
      text: "Pay for medical aid",
      subtext: "Costs 6 gold.",
      price: { gold: 6 },
      tileModifications: [],
    },
    {
      text: "Close the hunting grounds",
      subtext: "Destroys 1 forest tile.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "Forest",
        },
      ],
    },
  ],
} as QuestInstant;

const goldMineCollapseQuest = {
  image: "./quest_images/gold_mine_collapse.jpeg",
  details: [
    { text: "A mine has collapsed in the mountains!" },
    { text: "Take action to save the workers." },
  ],
  actions: [
    {
      text: "Pay for repairs",
      subtext: "Costs 7 stone.",
      price: { stone: 7 },
      tileModifications: [],
    },
    {
      text: "Abandon the mine",
      subtext: "Destroys 1 mountain tile.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "Mountains",
        },
      ],
    },
  ],
} as QuestInstant;

const wildAnimalAttackQuest = {
  image: "./quest_images/wild_animals_attack.jpeg",
  details: [
    { text: "Wild animals are attacking the city outskirts!" },
    { text: "Choose how to handle the situation." },
  ],
  actions: [
    {
      text: "Hire hunters",
      subtext: "Costs 5 wood and 5 gold.",
      price: { wood: 5, gold: 5 },
      tileModifications: [],
    },
    {
      text: "Abandon the area",
      subtext: "Destroys 1 city tile.",
      tileModifications: [
        {
          actionType: "remove",
          amount: 1,
          tileSectionType: "City",
        },
      ],
    },
  ],
} as QuestInstant;

const festivalPreparationQuest = {
  image: "./quest_images/festival_preparation.jpeg",
  details: [
    { text: "A city is preparing for a festival!" },
    { text: "Contribute resources to gain goodwill." },
  ],
  actions: [
    {
      text: "Donate to the festival",
      subtext: "Costs 5 grain and 5 gold.",
      price: { grain: 5, gold: 5 },
      tileModifications: [],
    },
    {
      text: "Ignore the event",
      subtext: "No cost, but lose 5 points.",
      tileModifications: [],
    },
  ],
};

const allQuests = [
  forestFireQuest,
  banditRaidQuest,
  floodWarningQuest,
  plaqueOutbreakQuest,
  earthQuakeQuest,
  grainInfestationQuest,
  huntingAccidentQuest,
  goldMineCollapseQuest,
  wildAnimalAttackQuest,
  festivalPreparationQuest,
];

export {
  forestFireQuest,
  banditRaidQuest,
  floodWarningQuest,
  plaqueOutbreakQuest,
  earthQuakeQuest,
  grainInfestationQuest,
  huntingAccidentQuest,
  goldMineCollapseQuest,
  wildAnimalAttackQuest,
  festivalPreparationQuest,
  allQuests,
};
