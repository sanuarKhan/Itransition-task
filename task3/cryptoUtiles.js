const crypto = require("crypto");

class CryptoUtils {
<<<<<<< HEAD
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
=======
  generateSecureRandomBytes(lengthBytes) {
    return crypto.randomBytes(lengthBytes);
  }

  calculateHmac(keyBuffer, messageString) {
    const hmac = crypto.createHmac(HMAC_ALGORITHM, keyBuffer);
    hmac.update(messageString);
    return hmac.digest("hex");
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
  }
}

module.exports = CryptoUtils;
