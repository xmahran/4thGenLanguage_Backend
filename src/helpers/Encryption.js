const bcrypt = require("bcrypt");

const encryptData = async (data) => {
  const saltRounds = 10;
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    console.error("Error hashing data:", error);
    throw error;
  }
};
const compareData = async (plainData, hashedData) => {
  try {
    const isMatch = await bcrypt.compare(plainData, hashedData);
    return isMatch;
  } catch (error) {
    console.error("Error comparing data:", error);
    throw error;
  }
};
module.exports = { encryptData, compareData };
