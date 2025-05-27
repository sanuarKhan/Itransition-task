class ProbabilityCalculator {
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
  }
}

module.exports = ProbabilityCalculator;
