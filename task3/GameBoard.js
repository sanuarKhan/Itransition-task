const TableRenderer = require("./TableRenderer.js");
const FairRandomGenerator = require("./FairRandomGenerator.js");
const readline = require("readline");

const fairRanGen = new FairRandomGenerator();
const tableRen = new TableRenderer();
class GameBoard {
  constructor(dice) {
    this.dice = dice;
    this.computerDiceIndex = -1;
    this.userDiceIndex = -1;
  }
  async play() {
    console.log("Let's determine who makes the first move.");

    // Determine first player
    const firstMoveResult = await fairRanGen.generateFairRandom(
      0,
      1,
      "Try to guess my selection."
    );
    const userGuess = firstMoveResult; // This comes from user input in generateFairRandom

    const computerFirst = firstMoveResult === 0;

    if (computerFirst) {
      console.log("I make the first move.");
      await this.computerSelectDice();
      await this.userSelectDice();
    } else {
      console.log("You make the first move.");
      await this.userSelectDice();
      await this.computerSelectDice();
    }

    // Perform rolls
    const computerRoll = await this.performComputerRoll();
    const userRoll = await this.performUserRoll();

    // Determine winner
    this.announceWinner(computerRoll, userRoll);
  }
  async computerSelectDice() {
    // Computer selects randomly from available dice
    const availableDice = this.dice
      .map((dice, index) => index)
      .filter((index) => index !== this.userDiceIndex);

    this.computerDiceIndex =
      availableDice[Math.floor(Math.random() * availableDice.length)];
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
  async performUserRoll() {
    console.log("It's time for your roll.");
    const faceIndex = await fairRanGen.generateFairRandom(
      0,
      5,
      "Add your number modulo 6."
    );
    const rollResult = this.dice[this.userDiceIndex].getFace(faceIndex);
    console.log(`Your roll result is ${rollResult}.`);
    return rollResult;
  }
  announceWinner(computerRoll, userRoll) {
    if (userRoll > computerRoll) {
      console.log(`You win (${userRoll} > ${computerRoll})!`);
    } else if (computerRoll > userRoll) {
      console.log(`I win (${computerRoll} > ${userRoll})!`);
    } else {
      console.log(`It's a tie (${computerRoll} = ${userRoll})!`);
    }
  }
}

module.exports = GameBoard;
