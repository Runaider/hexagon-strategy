const calculateScoreFromGridData = (
  zones: Zones,
  quests: Quest[],
  toxicTiles: ToxicTile[],
  completedZones: Zones
): {
  score: number;
  scoreLog: string[];
} => {
  let score = 0;
  const scoreLog = [];

  for (const [zoneGroupName, zoneGroup] of Object.entries(zones)) {
    for (const zone of zoneGroup) {
      const zoneScore = zone.hexes.length * (10 + zone.hexes.length);
      score += zoneScore;
      scoreLog.push(
        `+${zoneScore} for ${Object.keys(zones).find(
          (key) => zones[key] === zoneGroup
        )} with ${zone.hexes.length} hexes`
      );

      for (const [completedZoneGroupName, completedZoneGroup] of Object.entries(
        completedZones
      )) {
        for (const completedZone of completedZoneGroup) {
          if (zone.hexes.length === completedZone.hexes.length) {
            if (
              zone.hexes.every((hex) =>
                completedZone.hexes.some(
                  (completedHex) =>
                    completedHex.row === hex.row && completedHex.col === hex.col
                )
              )
            ) {
              const bonusScore = zoneScore;
              score += bonusScore;
              scoreLog.push(
                `\u00A0\u00A0\u00A0\u00A0+${bonusScore} bonus for completing zone`
              );
            }
          }
        }
      }
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

  for (const toxicTile of toxicTiles) {
    score -= 100;
    scoreLog.push(
      `- ${100} for toxic tile at ${toxicTile.row}, ${toxicTile.col}`
    );
  }

  // for (const zone of Object.values(completedZones)) {
  //   for (const hexes of zone) {
  //     const zoneScore = hexes.hexes.length * (10 + hexes.hexes.length);
  //     score += zoneScore;
  //     scoreLog.push(
  //       `+${zoneScore} for ${Object.keys(completedZones).find(
  //         (key) => completedZones[key] === zone
  //       )} with ${hexes.hexes.length} hexes`
  //     );
  //   }
  // }

  return { score, scoreLog };
};

export { calculateScoreFromGridData };
