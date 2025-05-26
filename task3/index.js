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

async function main() {
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
    process.exit(1);
  }
}

main();
