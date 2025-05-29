<<<<<<< HEAD
const crypto = require("crypto");
const readline = require("readline");
const Table = require("cli-table3");
const Dice = require("./Dice.js");
const DiceParser = require("./DiceParser.js");
const CryptoUtils = require("./CryptoUtiles");
const FairRandomGenerator = require("./FairRandomGenerator.js");
const ProbabilityCalculator = require("./ProbabilityCalculator.js");
const TableRenderer = require("./TableRenderer.js");
const GameBoard = require("./GameBoard.js");
=======
const readline = require("readline");
const {
  DiceParser,
  InvalidArgumentsError,
  InvalidDiceFormatError,
} = require("./DiceParser");
const CryptoUtils = require("./cryptoUtiles");
const FairRandomGenerator = require("./FairRandomGenerator");
const GameBoard = require("./GameBoard");
const ProbabilityCalculator = require("./ProbabilityCalculator");
const TableRenderer = require("./TableRenderer");
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836

// Main function
async function main() {
<<<<<<< HEAD
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
    const game = new GameBoard(dice);
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
=======
  try {
    const args = process.argv.slice(2);
    const diceList = DiceParser.parseDiceString(args);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const cryptoUtils = new CryptoUtils();
    const fairRandomGenerator = new FairRandomGenerator(cryptoUtils, rl);
    const gameBoard = new GameBoard(
      diceList,
      cryptoUtils,
      fairRandomGenerator,
      ProbabilityCalculator,
      TableRenderer,
      rl
    );

    await gameBoard.runGame();
  } catch (error) {
    if (
      error instanceof InvalidArgumentsError ||
      error instanceof InvalidDiceFormatError
    ) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unexpected error occurred:", error);
    }
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
    process.exit(1);
  }
}

main();
