const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);

const { Web3 } = require("web3");
const { contractABI, contractAddress, bytecode } = require("../constants");
const web3 = new Web3(provider);
const deployedContract = new web3.eth.Contract(contractABI, contractAddress);

const addStep = async (req, res) => {
  const { stepProcess, party, ethAddress } = req.body;
  try {
    let result = await deployedContract.methods
      .addStep(stepProcess, party)
      .send({ from: ethAddress, gas: 3000000 });
    console.log("Transaction result:", result);
    res.status(200).json("Success");
  } catch (error) {
    console.error("Error adding step:", error.response.data);
    res.status(500).json({
      errorMsg: "Failed to add step to Ethereum contract",
      error: error.response.data,
    });
  }
};
const verifyHash = async (req, res) => {
  const { oracleAddress, oracleVerificationHash, type } = req.body;
  try {
    let result;
    if (type === "buyer") {
      result = await deployedContract.methods
        .verifyBuyerIdentity(oracleAddress, oracleVerificationHash)
        .send({ from: ethAddress, gas: 3000000 });
    } else if (type === "seller") {
      result = await deployedContract.methods
        .verifySellerIdentity(oracleAddress, oracleVerificationHash)
        .send({ from: oracleAddress, gas: 3000000 });
    } else if (type === "item") {
      result = await deployedContract.methods
        .verifyItem(oracleAddress, oracleVerificationHash)
        .send({ from: oracleAddress, gas: 3000000 });
    }
    console.log("Transaction result:", result);

    res.status(200).json("Success");
  } catch (error) {
    console.error("Error while verifying", error.response.data);
    res.status(500).json({
      errorMsg: "Failed to verify",
      error: error.response.data,
    });
  }
};

module.exports = { addStep, verifyHash };
