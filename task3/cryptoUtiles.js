const crypto = require("crypto");

class CryptoUtils {
  static generateSecureKey() {
    return crypto.randomBytes(32); // 256 bits
  }

  static generateSecureRandom(min, max) {
    const range = max - min + 1;
    const maxValid = Math.floor(0x100000000 / range) * range - 1;

    let randomValue;
    do {
      randomValue = crypto.randomBytes(4).readUInt32BE(0);
    } while (randomValue > maxValid);

    return min + (randomValue % range);
  }

  static calculateHMAC(key, message) {
    const hmac = crypto.createHmac("sha3-256", key);
    hmac.update(message.toString());
    return hmac.digest("hex").toUpperCase();
  }
}

module.exports = CryptoUtils;
