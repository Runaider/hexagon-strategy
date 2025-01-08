const calculateScoreFromGridData = (
  zones: Zones,
  quests: Quest[]
): {
  score: number;
  scoreLog: string[];
} => {
  let score = 0;
  const scoreLog = [];

  for (const zone of Object.values(zones)) {
    for (const hexes of zone) {
      const zoneScore = hexes.hexes.length * (10 + hexes.hexes.length);
      score += zoneScore;
      scoreLog.push(
        `+${zoneScore} for ${Object.keys(zones).find(
          (key) => zones[key] === zone
        )} with ${hexes.hexes.length} hexes`
      );
    }
  }

  for (const quest of quests) {
    if (quest.completed) {
      score += quest.reward;
      scoreLog.push(
        `Adding score for quest "${quest.title}", ${quest.reward} points`
      );
    }
  }

  return { score, scoreLog };
};

export { calculateScoreFromGridData };
