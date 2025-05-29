const TableRenderer = require("./TableRenderer.js");
const FairRandomGenerator = require("./FairRandomGenerator.js");
const readline = require("readline");

const fairRanGen = new FairRandomGenerator();
const tableRen = new TableRenderer();
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
      "let's determine who make the first move"
    );
    console.log(result);

    if (result.exit || result.help) return result;

    const firstPlayer = result.result === 0 ? "Computer" : "User";
    console.log(
      `I choose the [${this.dice[this.computerDiceIndex].toString()}] dice.`
    );
  }
  async userSelectDice() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log("Choose your dice:");

    while (true) {
      // Show available dice
      for (let i = 0; i < this.dice.length; i++) {
        if (i !== this.computerDiceIndex) {
          console.log(`${i} - ${this.dice[i].toString()}`);
        }
      }
      console.log("X - exit");
      console.log("? - help");

      const answer = await new Promise((resolve) => {
        rl.question("Your selection: ", resolve);
      });

      if (answer.toUpperCase() === "X") {
        rl.close();
        process.exit(0);
      }

      if (answer === "?") {
        rl.close();
        tableRen.generateProbabilityTable(this.dice);
        return this.userSelectDice();
      }

      const index = parseInt(answer);
      if (
        !isNaN(index) &&
        index >= 0 &&
        index < this.dice.length &&
        index !== this.computerDiceIndex
      ) {
        this.userDiceIndex = index;
        console.log(`You choose the [${this.dice[index].toString()}] dice.`);
        rl.close();
        return;
      }

      console.log("Invalid selection. Please try again.");
    }
  }
  async performComputerRoll() {
    console.log("It's time for my roll.");
    const faceIndex = await fairRanGen.generateFairRandom(
      0,
      5,
      "Add your number modulo 6."
    );
    const rollResult = this.dice[this.computerDiceIndex].getFace(faceIndex);
    console.log(`My roll result is ${rollResult}.`);
    return rollResult;
  }
  async runGame() {
    console.log("=== DICE GAME ===\n");
    const firstPlayer = await this.determinedFirstPlayer();
    if (firstPlayer.exit || firstPlayer.help) return;

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
      console.log(`It's a tie (${computerRoll} = ${userRoll})!`);
    }
  }
}

module.exports = GameBoard;
