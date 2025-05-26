const Table = require("cli-table3");

class TableRenderer {
  static displayProbabilityTable(diceList, probabilityCalculator) {
    console.log("\n=== Probability Table ===");

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
  }
}

module.exports = TableRenderer;
