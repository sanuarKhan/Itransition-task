const Table = require("cli-table3");
<<<<<<< HEAD
const ProbabilityCalculator = require("./ProbabilityCalculator.js");

const probability = new ProbabilityCalculator();
=======
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836

class TableRenderer {
  async generateProbabilityTable(dice) {
    const probabilities = probability.calculateAllProbabilities(dice);

<<<<<<< HEAD
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
=======
    const headers = ["user dice"];
    diceList.forEach((_, i) => headers.push(`Computer ${i + 1}`));
    const displayTable = new Table({ head: headers });

    diceList.forEach((userDice, userIndex) => {
      const row = [userDice.toString()];

      diceList.forEach((computerDice, computerIndex) => {
        const [userWin, compWin, tie] =
          probabilityCalculator.calculateProbability(userDice, computerDice);

        if (userIndex === computerIndex) {
          row.push(`- (${tie})`);
        } else {
          row.push(`${userWin}`);
        }
      });
      displayTable.push(row);
    });
    console.log(displayTable.toString());
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
  }
}

module.exports = TableRenderer;
