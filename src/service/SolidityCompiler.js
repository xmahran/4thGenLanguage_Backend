const path = require("path");
const fs = require("fs");
const solc = require("solc");

const compile = (contractName) => {
  try {
    const contractPath = path.resolve(
      __dirname,
      "..",
      "contracts",
      contractName
    );
    const source = fs.readFileSync(contractPath, "utf8");
    const input = {
      language: "Solidity",
      sources: {
        [contractName]: {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["evm", "bytecode", "abi"],
          },
        },
      },
    };

    let contractData = JSON.parse(solc.compile(JSON.stringify(input)))
      .contracts[contractName].BilateralSalesContract;
    const bytecode = contractData.evm.bytecode.object;
    const abi = contractData.abi;
    return { abi: abi, bytecode: bytecode };
  } catch (error) {
    console.error("Error compiling contract:", error);
    return null;
  }
};

module.exports = { compile };
