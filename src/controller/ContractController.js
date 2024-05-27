const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);

const { Web3 } = require("web3");
const {
  getAllFilesFromIPFS,
  getHash,
  getFileByHash,
  postToIPFS,
  deleteFileFromIPFS,
} = require("./IPFSController");
const { sellerIDQuery, query, itemIDQuery } = require("../model/Query");
const { Node, addNode } = require("../model/Node");
const { serializeDatabase } = require("./DatabaseController");
const { awardOracle } = require("./EthController");
const web3 = new Web3(provider);

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
      errorMsg: "Failed to load Ethereum contract",
      error: error.response.data,
    });
  }
};

const getContractValuesByID = async (contractID) => {
  let contractValuesHash;
  let contractValues;
  try {
    contractValuesHash = await getHash(`values${contractID}`);
    contractValues = await getFileByHash(contractValuesHash);
    const valuesArray = Array.from(contractValues)
      .reverse()
      .map((val) => val[1]);
    let contract = valuesArray[0];
    return contract;
  } catch (error) {}
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
const getEthAddress = async (req, res) => {
  const { contractID } = req.params;
  try {
    const { abi, contractAddress } = await getContractByID(contractID);
    const deployedContract = new web3.eth.Contract(abi, contractAddress);
    const item = await deployedContract.methods.item().call();
    const seller = await deployedContract.methods.seller().call();
    res.status(200).json({
      item: { oracleAddress: item.imgOracle },
      seller: { oracleAddress: seller.identityProofOracle },
    });
  } catch (error) {
    res.status(500).json({
      errorMsg: "Failed to load Ethereum contract",
      error: error.response.data,
    });
  }
};
const getContractSteps = async (req, res) => {
  const { abi, contractAddress } = req.body;
  const deployedContract = new web3.eth.Contract(abi, contractAddress);

  try {
    const steps = await deployedContract.methods.getContractSteps().call();
  } catch (error) {
    res.status(500).json({
      errorMsg: "Failed to load contract steps",
      error: error,
    });
  }
};
const getAllContracts = async (req, res) => {
  try {
    const data = await getAllFilesFromIPFS("contract");
    const contracts = Array.from(data)
      .reverse()
      .map((val) => val[1]);
    let finalContracts = [];
    for (const contract of contracts) {
      finalContracts.push({
        id: contract.id,
        name: contract.name,
        abi: contract.content[0].abi,
        bytecode: contract.content[0].bytecode,
        sellerID: contract.content[0].sellerID,
      });
    }
    res.status(200).json({ contracts: finalContracts }); //2d array to access it-> usersArray[0][1].name for ex, gets first element
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Failed to load contracts",
      error: error,
    });
  }
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

// const addStep = async (req, res) => {
//   const { stepProcess, party, ethAddress } = req.body;
//   try {
//     let result = await deployedContract.methods
//       .addStep(stepProcess, party)
//       .send({ from: ethAddress, gas: 3000000 });
//     res.status(200).json("Success");
//   } catch (error) {
//     console.error("Error adding step:", error.response.data);
//     res.status(500).json({
//       errorMsg: "Failed to add step to Ethereum contract",
//       error: error.response.data,
//     });
//   }
// };
const getContractByID = async (contractID) => {
  try {
    const contractHash = await getHash(`contract${contractID}`);
    const contract = await getFileByHash(contractHash);
    let { abi, contractAddress } = contract.get(parseInt(contractID))
      .content[0];
    return { abi: abi, contractAddress: contractAddress };
  } catch (error) {
    console.log(error);
  }
};
const completeSteps = async (req, res) => {
  const { contractID, stepsNo } = req.body;
  try {
    const oldValues = await getContractValuesByID(contractID);
    let contractName = oldValues.content[0].contractName;
    let values = oldValues.content[0].values;
    let newSteps = [];
    for (let i = 0; i < oldValues.content[0].steps.length; i++) {
      for (const no of stepsNo) {
        oldValues.content[0].steps[no].status = "COMPLETED";
      }
      newSteps.push(oldValues.content[0].steps[i]);
    }
    let valuesState = new Map();
    let tempNode = new Node(contractID, `values`, `values${contractID}`, null, [
      {
        contractName: contractName,
        values: values,
        steps: newSteps,
        contractID: contractID,
      },
    ]);
    let valuesNode = addNode(valuesState, tempNode);
    const jsonValues = serializeDatabase(valuesNode);
    await postToIPFS(jsonValues, "data.json", `values${contractID}`);
    res.status(200).json("Updated step");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Failed to complete steps",
      error: error,
    });
  }
};

const getContractByTypeID = async (type, id) => {
  try {
    const contracts = await getAllFilesFromIPFS("contract");
    let currContract;
    if (type === "item") currContract = query(contracts, itemIDQuery(id));
    if (type === "seller") currContract = query(contracts, sellerIDQuery(id));
    if (currContract[0]) {
      return currContract[0].content[0];
    } else return null;
  } catch (error) {}
};
const verifyHash = async (req, res) => {
  const {
    oracleAddress,
    oracleVerificationHash,
    type,
    itemID,
    sellerID,
    stake,
  } = req.body;
  try {
    let contractData;
    let deployedContract;
    let result;
    if (type === "seller") {
      contractData = await getContractByTypeID("seller", sellerID);
      deployedContract = new web3.eth.Contract(
        contractData.abi,
        contractData.contractAddress
      );
      result = await deployedContract.methods
        .verifySellerIdentity(oracleAddress, oracleVerificationHash)
        .send({ from: oracleAddress, gas: 3000000 });
    } else if (type === "item") {
      contractData = await getContractByTypeID("item", itemID);
      deployedContract = new web3.eth.Contract(
        contractData.abi,
        contractData.contractAddress
      );
      result = await deployedContract.methods
        .verifyItem(oracleAddress, oracleVerificationHash)
        .send({ from: oracleAddress, gas: 3000000 });
    }
    await awardOracle(oracleAddress, stake);
    res.status(200).json("Success");
  } catch (error) {
    console.error("Error while verifying", error);
    res.status(500).json({
      errorMsg: "Failed to verify",
      error: error,
    });
  }
};

module.exports = {
  verifyHash,
  loadContract,
  completeSteps,
  getContractSteps,
  getContractByID,
  getEthAddress,
  getContractValuesByID,
  getContractIDBySellerID,
  getContractByTypeID,
  addBuyer,
  getAllContracts,
};
