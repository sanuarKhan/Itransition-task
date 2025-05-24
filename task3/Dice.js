class Dice {
  constructor(faces) {
    if (!Array.isArray(faces)) {
      throw new Error("Faces must be an array");
    }
    if (!faces.every((face) => Number.isInteger(face))) {
      throw new Error("All faces must be integers");
    }
    this.faces = faces;
  }
  getFaceCount() {
    return this.faces.length;
  }
  getFaceValue(index) {
    return this.faces[index];
  }
  toString() {
    return `${this.faces.join(", ")}`;
  }
}

module.exports = Dice;
