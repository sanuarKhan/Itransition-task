// game.js - Non-Transitive Dice Game
const crypto = require("crypto");
const readline = require("readline");
const Table = require("cli-table3");

// Cryptographic utilities for secure random generation and HMAC

// Fair random number generation protocol

// Probability calculator for win chances

// Table generator for displaying probabilities
class TableGenerator {
  static generateProbabilityTable(dice) {
    const probabilities = ProbabilityCalculator.calculateAllProbabilities(dice);

    // Create headers with proper formatting
    const headers = ["User dice v \\ Computer dice >"].concat(
      dice.map((d) => d.toString())
    );

    // Create table with enhanced styling
    const table = new Table({
      head: headers,
      style: {
        head: ["cyan", "bold"],
        border: ["white"],
        compact: false,
      },
      colWidths: headers.map((h) => Math.max(h.length + 2, 12)),
      wordWrap: true,
    });

    // Add rows with proper formatting
    for (let i = 0; i < dice.length; i++) {
      const row = [{ content: dice[i].toString(), hAlign: "center" }];
      for (let j = 0; j < dice.length; j++) {
        if (probabilities[i][j] === -1) {
          row.push({ content: "- (tie)", hAlign: "center", style: ["dim"] });
        } else {
          const prob = probabilities[i][j].toFixed(4);
          const color = prob > 0.5 ? "green" : prob < 0.5 ? "red" : "yellow";
          row.push({
            content: prob,
            hAlign: "center",
            style: [color],
          });
        }
      }
      table.push(row);
    }

    console.log("\n" + "=".repeat(60));
    console.log("PROBABILITY TABLE - Win chances for USER vs COMPUTER");
    console.log("=".repeat(60));
    console.log(
      "Green = User advantage (>50%), Red = Computer advantage (<50%)"
    );
    console.log(
      "Each cell shows probability that ROW player beats COLUMN player"
    );
    console.log("=".repeat(60));
    console.log(table.toString());
    console.log("=".repeat(60) + "\n");
  }
}

// Main game controller
class DiceGame {
  constructor(dice) {
    this.dice = dice;
    this.fairGenerator = new FairRandomGenerator();
    this.computerDiceIndex = -1;
    this.userDiceIndex = -1;
  }

  async play() {
    console.log("Let's determine who makes the first move.");

    // Determine first player
    const firstMoveResult = await this.fairGenerator.generateFairRandom(
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
        TableGenerator.generateProbabilityTable(this.dice);
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
    const faceIndex = await this.fairGenerator.generateFairRandom(
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
    const faceIndex = await this.fairGenerator.generateFairRandom(
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

// Main function
async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.length === 0) {
      console.log("Error: No dice configurations provided.");
      console.log(
        'Usage: node game.js "2,2,4,4,9,9" "6,8,1,1,8,6" "7,5,3,7,5,3"'
      );
      console.log("Each dice must have exactly 6 comma-separated integers.");
      process.exit(1);
    }

    const dice = DiceParser.parse(args);
    const game = new DiceGame(dice);
    await game.play();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(
      'Usage: node game.js "2,2,4,4,9,9" "6,8,1,1,8,6" "7,5,3,7,5,3"'
    );
    console.log("Requirements:");
    console.log("- At least 3 dice configurations required");
    console.log("- Each dice must have exactly 6 comma-separated integers");
    console.log("- All values must be integers");
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  Dice,
  DiceParser,
  CryptoUtils,
  FairRandomGenerator,
  ProbabilityCalculator,
  TableGenerator,
  DiceGame,
};

// Run if this is the main module
if (require.main === module) {
  main().catch(console.error);
}
