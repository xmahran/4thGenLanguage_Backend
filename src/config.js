const crypto = require("crypto");

const privateKey = crypto.randomBytes(32).toString("hex");

module.exports = {
  privateKey: privateKey,
};
