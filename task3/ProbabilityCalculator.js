class ProbabilityCalculator {
<<<<<<< HEAD
  async calculateWinProbability(dice1, dice2) {
    let wins = 0;
    let total = 0;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (dice1.getFace(i) > dice2.getFace(j)) {
          wins++;
        }
        total++;
      }
    }

    return (wins / total).toFixed(4);
  }

  async calculateAllProbabilities(dice) {
    const probabilities = [];
    for (let i = 0; i < dice.length; i++) {
      const row = [];
      for (let j = 0; j < dice.length; j++) {
        if (i === j) {
          row.push(-1); // Same dice
        } else {
          row.push(this.calculateWinProbability(dice[i], dice[j]));
        }
      }
      probabilities.push(row);
    }
    return probabilities;
=======
  static calculateProbability(die1, die2) {
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
    const total = die1.getFaceCount() * die2.getFaceCount();
    return [
      (dieWins / total).toFixed(4),
      (die2Wins / total).toFixed(4),
      (ties / total).toFixed(4),
    ];
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
  }
}

module.exports = ProbabilityCalculator;
