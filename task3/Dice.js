class Dice {
  constructor(faces) {
    if (!Array.isArray(faces)) {
      throw new Error("Faces must be an array");
    }
    this.faces = [...faces].sort((a, b) => a - b);
  }

  getFaceCount() {
    return this.faces.length;
  }

  getFaceValue(index) {
    if (index < 0 || index >= this.faces.length) {
      throw new Error(`Invalid face index: ${index}`);
    }
    return this.faces[index];
  }

  toString() {
    return `[${this.faces.join(",")}]`;
  }
}

module.exports = Dice;
