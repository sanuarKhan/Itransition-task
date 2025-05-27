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
    process.exit(1);
  }
}

main();
