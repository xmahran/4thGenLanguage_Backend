const fs = require("fs");
const path = require("path");
const writeContract = (args, contractName) => {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "contracts",
      `${contractName}.sol`
    );
    fs.writeFileSync(filePath, args);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { writeContract };
