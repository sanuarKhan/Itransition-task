class GameBoard {
  constructor(
    diceList,
    cryptoUtils,
    fairRandomGenerator,
    probabilityCalculator,
    tableRenderer,
    rl
  ) {
    this.diceList = diceList;
    this.cryptoUtils = cryptoUtils;
    this.fairRandomGenerator = fairRandomGenerator;
    this.probabilityCalculator = probabilityCalculator;
    this.tableRenderer = tableRenderer;
    this.rl = rl;
  }
  async determinedFirstPlayer() {
    const result = await this.fairRandomGenerator.generateFairRandomNumber(
      2,
      "Let's determine who makes the first move"
    );
    if (result.exit || result.help) return result;

    const firstPlayer = result.result === 0 ? "computer" : "user";
    console.log(
      `${
        firstPlayer === "computer" ? "Computer" : "You"
      } will make the first move.`
    );
    return firstPlayer;
  }
  async selectDice(playerType, availableDice, previouslySelectedDice = null) {
    const rl = this.rl;
    while (true) {
      console.log(
        `\n${playerType === "user" ? "Your" : "Computer's"} dice selection:`
      );
      availableDice.forEach((dice, i) => {
        if (dice === previouslySelectedDice) return;
        console.log(`${i}: ${dice.toString()}`);
      });
      console.log("X - exit, ? - help");
      if (playerType === "computer") {
        const selected = availableDice.find(
          (dice) => dice !== previouslySelectedDice
        );
        console.log(`computer selects: ${selected.toString()}`);
        rl.close();
        return selected;
      }
      const input = await new Promise((resolve) =>
        rl.question("your move: ", resolve)
      );
      const trimmed = input.trim();
      if (trimmed.toUpperCase() === "X") {
        rl.close();
        return { exit: true };
      }
      if (trimmed === "?") {
        this.tableRenderer.displayProbabilityTable(
          this.diceList,
          this.probabilityCalculator
        );
        continue;
      }
      const index = parseInt(trimmed);
      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < availableDice.length
      ) {
        const selected = availableDice[index];
        if (selected === previouslySelectedDice) {
          console.log("That dice was already selected. Choose another one.");
          continue;
        }
        rl.close();
        return selected;
      }
      console.log("Invalid input. Try again.");
    }
  }
  async playTurn(playerType, playerDice, opponentDice) {
    const rollResult = await this.fairRandomGenerator.generateFairRandomNumber(
      playerDice.getFaceCount(),
      `It is time for ${playerType === "user" ? "your" : "computer's"} roll.`
    );
    if (rollResult.exit || rollResult.help) return rollResult;
    const rollValue = playerDice.getFaceValue(rollResult.result);
    console.log(
      `${playerType === "user" ? "You" : "Computer"} rolled: ${rollValue}`
    );
    return rollValue;
  }
  async runGame() {
    console.log("=== DICE GAME ===\n");
    const firstPlayerResult = await this.determinedFirstPlayer();
    if (firstPlayerResult.exit || firstPlayerResult.help) return;

    const firstPlayer = firstPlayerResult;
    const selectedDice1 = await this.selectDice(firstPlayer, this.diceList);
    if (selectedDice1.exit) return;

    const secondPlayer = firstPlayer === "user" ? "computer" : "user";
    const selectedDice2 = await this.selectDice(
      secondPlayer,
      this.diceList,
      selectedDice1
    );
    if (selectedDice2.exit) return;

    console.log(
      `\n${
        firstPlayer === "user" ? "You" : "Computer"
      } : ${selectedDice1.toString()}`
    );
    console.log(
      `${
        secondPlayer === "user" ? "You" : "Computer"
      } : ${selectedDice2.toString()}\n`
    );

    const player1Roll = await this.playTurn(
      firstPlayer,
      selectedDice1,
      selectedDice2
    );
    if (player1Roll.exit || player1Roll.help) return;

    const player2Roll = await this.playTurn(
      secondPlayer,
      selectedDice2,
      selectedDice1
    );
    if (player2Roll.exit || player2Roll.help) return;

    console.log("\n=== RESULTS ===\n");
    if (player1Roll > player2Roll) {
      console.log(
        `${
          firstPlayer === "user" ? "You" : "Computer"
        } win! 🎉 (${player1Roll} > ${player2Roll})`
      );
    } else if (player1Roll < player2Roll) {
      console.log(
        `${
          secondPlayer === "user" ? "You" : "Computer"
        } win! 🎉 (${player2Roll} > ${player1Roll})`
      );
    } else {
      console.log(`It's a tie! 🤝 (${player1Roll} = ${player2Roll})`);
    }
  }
}

module.exports = GameBoard;
