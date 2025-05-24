class ProbabilityCalculator {
  static calculateWinProbability(die1, die2) {
    let dieWins = 0,
      die2Wins = 0,
      ties = 0;
    for (const face1 of die1.faces) {
      for (const face2 of die2.faces) {
        if (face1 > face2) dieWins++;
        else if (face1 < face2) die2Wins++;
        else ties++;
      }
    }
    total = dei1.getFaceCount() * die2.getFaceCount();
    return [
      (dieWins / total).toFixed(4),
      (die2Wins / total).toFixed(4),
      (ties / total).toFixed(4),
    ];
  }
}

module.exports = ProbabilityCalculator;
