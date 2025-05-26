const crypto = require("crypto");
const { HMAC_ALGORITHM } = require("./constant");

class CryptoUtils {
  generateSecureRandomBytes(lengthBytes) {
    return crypto.randomBytes(lengthBytes);
  }

  calculateHmac(keyBuffer, messageString) {
    const hmac = crypto.createHmac(HMAC_ALGORITHM, keyBuffer);
    hmac.update(messageString);
    return hmac.digest("hex");
  }
}

module.exports = CryptoUtils;
