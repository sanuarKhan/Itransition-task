class Dice {
  constructor(faces) {
    if (!Array.isArray(faces) || faces.length !== 6) {
      throw new Error("Dice must have exactly 6 faces");
    }
<<<<<<< HEAD
    if (!faces.every((face) => Number.isInteger(face))) {
      throw new Error("All face values must be integers");
    }
    this.faces = faces;
  }

  getFace(index) {
    if (index < 0 || index >= 6) {
      throw new Error("Face index must be between 0 and 5");
=======
    this.faces = [...faces].sort((a, b) => a - b);
  }

  getFaceCount() {
    return this.faces.length;
  }

  getFaceValue(index) {
    if (index < 0 || index >= this.faces.length) {
      throw new Error(`Invalid face index: ${index}`);
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
    }
    return this.faces[index];
  }

  toString() {
<<<<<<< HEAD
    return this.faces.join(",");
=======
    return `[${this.faces.join(",")}]`;
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
  }
}
module.exports = Dice;
