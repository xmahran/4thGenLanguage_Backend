const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);

const { Web3 } = require("web3");
const { contractABI, contractAddress, bytecode } = require("../constants");
const {
  getAllFilesFromIPFS,
  getHash,
  getFileByHash,
  postToIPFS,
  deleteFileFromIPFS,
} = require("./IPFSController");
const { sellerIDQuery, query } = require("../model/Query");
const { Node, addNode } = require("../model/Node");
const { serializeDatabase } = require("./DatabaseController");
const web3 = new Web3(provider);
const deployedContract = new web3.eth.Contract(contractABI, contractAddress);

const loadContract = async (req, res) => {
  const { sellerID } = req.params;
  let contractValuesHash;
  let contractValues;
  try {
    let currContractID = await getContractIDBySellerID(parseInt(sellerID));
    if (!currContractID) {
      res.status(500).json((contract = []));
    } else {
      contractValuesHash = await getHash(`values${currContractID}`);
      contractValues = await getFileByHash(contractValuesHash);
      const valuesArray = Array.from(contractValues)
        .reverse()
        .map((val) => val[1]);
      let contract = valuesArray[0];
      res.status(200).json((contract = contract));
    }
  } catch (error) {
    res.status(500).json({
      errorMsg: "Failed to add step to Ethereum contract",
      error: error.response.data,
    });
  }
};

const getContractIDBySellerID = async (sellerID) => {
  try {
    const contracts = await getAllFilesFromIPFS("contract");
    const currContract = query(contracts, sellerIDQuery(sellerID));
    if (currContract[0]) {
      return currContract[0].id;
    } else return null;
  } catch (error) {}
};

const addBuyer = async (req, res) => {
  const { values, steps, contractID, contractName } = req.body;
  try {
    let deleteFile = await deleteFileFromIPFS(`value${contractID}`);
    const hashContract = await getHash(`contract${contractID}`);
    const currContract = await getFileByHash(hashContract);
    let abi = currContract.get(parseInt(contractID)).content[0].abi;
    let contractAddress = currContract.get(parseInt(contractID)).content[0]
      .contractAddress;

    const deployedContract = new web3.eth.Contract(abi, contractAddress);
    let result = await deployedContract.methods
      .addBuyer(
        values.buyerEthereumAddress,
        values.buyerIdentityType,
        values.buyerIdentityProofAddress,
        values.buyerImageHash,
        "0xA835252C70976c5D8f577F5A4D5f793B7d5CB837",
        "dneifni",
        true
      )
      .send({
        from: "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173",
        gas: 3000000,
      });

    let valuesState = new Map();
    let tempNode = new Node(contractID, `values`, `values${contractID}`, null, [
      {
        contractName: contractName,
        values: values,
        steps: steps,
        contractID: contractID,
      },
    ]);
    let valuesNode = addNode(valuesState, tempNode);
    const jsonValues = serializeDatabase(valuesNode);
    await postToIPFS(jsonValues, "data.json", `values${contractID}`);
    res.status(200).json("DONE");
  } catch (error) {
    res.status(500).json({
      errorMsg: "Failed to add step to Ethereum contract",
      error: error.response.data,
    });
  }
};

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

module.exports = { addStep, verifyHash, loadContract, addBuyer };
