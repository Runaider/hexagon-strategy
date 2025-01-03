const forestFireQuest = {
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
      subtext: "Lose 50 Gold and 10 Food",
      price: { gold: 50, food: 10, wood: 0, stone: 0, _: 0 },
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

export { forestFireQuest };
