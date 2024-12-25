const calculateScoreFromGridData = (
  zones: Zones
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
        `Adding score for ${Object.keys(zones).find(
          (key) => zones[key] === zone
        )} with ${hexes.hexes.length} hexes, ${zoneScore} points`
      );
    }
  }

  return { score, scoreLog };
};

export { calculateScoreFromGridData };
