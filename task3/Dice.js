class Dice {
  constructor(faces) {
    if (!Array.isArray(faces) || faces.length !== 6) {
      throw new Error("Dice must have exactly 6 faces");
    }
    if (!faces.every((face) => Number.isInteger(face))) {
      throw new Error("All face values must be integers");
    }
    this.faces = faces;
  }

  getFace(index) {
    if (index < 0 || index >= 6) {
      throw new Error("Face index must be between 0 and 5");
    }
    return this.faces[index];
  }

  toString() {
    return this.faces.join(",");
  }
}
module.exports = Dice;
