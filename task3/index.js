const GameBoard = require("./GameBoard");
const Dice = require("./Dice");
const {
  EXIT_SUCCESS,
  EXIT_INVALID_ARGUMENT,
  MENU_EXIT,
  MENU_HELP,
} = require("./constant");

const TableRenderer = require("./TableRenderer");
const ProbabilityCalculator = require("./ProbabilityCalculator");
const FairRandomGenerator = require("./FairRandomGenerator");
const CryptoUtils = require("./cryptoUtiles");
const readline = require("readline-sync");
const {
  DiceParser,
  InvalidArgumentsError,
  InvalidDiceFormatError,
} = require("./DiceParser");

async function main() {
  const rl = readline;
  try {
    const args = process.argv.slice(2);
    const diceList = DiceParser.parseDiceString(args);

    const cryptoUtils = new CryptoUtils();

    const fairRandomGenerator = new FairRandomGenerator(cryptoUtils, rl);
    const probabilityCalculator = new ProbabilityCalculator();
    const tableRenderer = new TableRenderer();
    const gameBoard = new GameBoard(
      diceList,
      cryptoUtils,
      fairRandomGenerator,
      probabilityCalculator,
      tableRenderer,
      rl
    );
    await gameBoard.runGame();
  } catch (error) {
    if (
      error instanceof InvalidArgumentsError ||
      error instanceof InvalidDiceFormatError
    ) {
      console.error(`\nError: ${error.message}`);
      console.error("Usage: node index.js <dice1> <dice2> <dice3> ... <diceN>");
      console.error(
        "Example: node index.js 2,2,4,4,9,9 3,3,5,5,7,7 1,2,3,4,5,6"
      );
    } else {
      console.error(`\nAn unexpected error occurred:`);
      console.error(error.message);
    }
    process.exit(EXIT_INVALID_ARGUMENT);
  } finally {
    rl.close();
  }
}

main();
