require("dotenv").config();
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);

const { contractABI, contractAddress, bytecode, JWT } = require("../constants");
const web3 = new Web3(provider);
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("../config");
const {
  getHash,
  checkFilesLength,
  postToIPFS,
  getAllFilesFromIPFS,
  getFileByHash,
} = require("./IPFSController");
const { encryptData, compareData } = require("../helpers/Encryption");
const { addNode, Node } = require("../model/Node");
const { serializeDatabase } = require("./DatabaseController");
const {
  query,
  emailQuery,
  usernameQuery,
  ethAddressQuery,
} = require("../model/Query");
const { getContractValuesByID } = require("./ContractController");
const { awardOracle } = require("./EthController");

const registerOracle = async (req, res) => {
  let oracleID;
  let prevHash;
  let node;
  let name;
  const content = req.body;
  const registerState = new Map();
  try {
    const hashedPassword = await encryptData(content[0].password);

    content[0].password = hashedPassword;
    const numOfUsers = await checkFilesLength("oracle");

    oracleID = numOfUsers + 1; // Increment to get the next available user and to start with 1....
    name = `oracle${oracleID}`;
    if (numOfUsers === 0) {
      node = new Node(1, "oracle", name, null, content);
    } else {
      prevHash = await getHash(`oracle${numOfUsers}`);
      if (prevHash == []) {
        res
          .status(500)
          .json({ errorMsg: "Unexpected error while getting previous hashes" });
      }
      node = new Node(oracleID, "oracle", name, prevHash, content);
    }
    let registerNode = addNode(registerState, node);
    const json = serializeDatabase(registerNode);
    const hash = await postToIPFS(json, "data.json", name);
    res.status(200).json({ ipfsHash: hash });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error while registering as a oracle",
      error: error,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const allOracles = await getAllFilesFromIPFS("oracle");
    if (allOracles === 0) {
      res.status(200).json("Failed");
    } else {
      const validEmail = query(allOracles, emailQuery(email));
      if (validEmail.length > 0) {
        let userHashedPassword = validEmail[0].content[0].password;
        const validPassword = await compareData(password, userHashedPassword);
        if (validPassword) {
          const token = jwt.sign(
            { userID: validEmail[0].id, userNode: validEmail[0].content[0] },
            config.privateKey,
            {
              expiresIn: "1h",
            }
          );
          res.status(200).json({
            token: token,
          });
        } else {
          res.status(200).json("Failed");
        }
      } else {
        res.status(200).json("Failed");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error logging as a oracle",
      error: error,
    });
  }
};

const getOracleByID = async (req, res) => {
  const { oracleID } = req.params;
  try {
    const oracleHash = await getHash(`oracle${oracleID}`);
    const oracle = await getFileByHash(oracleHash);
    let currOracle = oracle.get(parseInt(oracleID)).content[0];
    let finalResponse = {
      id: parseInt(oracleID),
      username: currOracle.username,
      email: currOracle.email,
      ethAddress: currOracle.ethAddress,
      fullName: currOracle.fullName,
      scope: currOracle.scope,
      stake: currOracle.stake,
      identityPhotosHash: currOracle.identityPhotosHash,
      password: currOracle.password,
      role: "oracle",
    };
    res.status(200).json({ currOracle: finalResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error getting seller info",
      error: error,
    });
  }
};
const getIdentityUser = async (req, res) => {
  const { username } = req.params;
  try {
    const allSellers = await getAllFilesFromIPFS("seller");
    const allBuyers = await getAllFilesFromIPFS("buyer");
    const currSeller = query(allSellers, usernameQuery(username));
    const currBuyer = query(allBuyers, usernameQuery(username));
    let currUser;
    if (currSeller.length > 0) {
      let content = currSeller[0].content[0];
      currUser = {
        id: currSeller[0].id,
        username: content.username,
        email: content.email,
        ethAddress: content.ethAddress,
        fullName: content.fullName,
        stake: content.stake,
        identityPhotosHash: content.identityPhotosHash,
        password: content.password,
        role: "seller",
      };
    }
    if (currBuyer.length > 0) {
      let content = currBuyer[0].content[0];
      currUser = {
        id: currBuyer[0].id,
        username: content.username,
        email: content.email,
        ethAddress: content.ethAddress,
        fullName: content.fullName,
        identityPhotosHash: content.identityPhotosHash,
        password: content.password,
        role: "buyer",
      };
    }
    res.status(200).json({ currUser: currUser });
  } catch (error) {
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};
const getContractByID = async (contractID) => {
  try {
    const contractHash = await getHash(`contract${contractID}`);
    const contractNode = await getFileByHash(contractHash);
    let currContract = contractNode.get(parseInt(contractID)).content[0];
    return {
      abi: currContract.abi,
      contractAddress: currContract.contractAddress,
    };
  } catch (error) {
    console.log(error);
  }
};
const listenToEvents = async (req, res) => {
  const { contractID } = req.params;
  try {
    const { abi, contractAddress } = await getContractByID(contractID);
    const deployedContract = new web3.eth.Contract(abi, contractAddress);
    let events = [];
    // const eventSubscription = deployedContract.events
    //   .allEvents({ fromBlock: 0, toBlock: "latest" })
    //   .on("data", (event) => {
    //     let returnValues = event.returnValues;
    //     const propertyNames = Object.keys(returnValues);
    //     let names = getArgsNames(propertyNames, returnValues.__length__);
    //     let values = getArgsValues(returnValues);
    //     let eventName = event.event;
    //     events.push({
    //       eventName: eventName,
    //       argsNames: names,
    //       argsValues: values,
    //     });
    //     // let currEvent = {
    //     //   eventName: eventName,
    //     //   argsNames: names,
    //     //   argsValues: values,
    //     // };
    //   });

    const result = await deployedContract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    if (result && result.length > 0) {
      for (const event of result) {
        let returnValues = event.returnValues;
        const propertyNames = Object.keys(returnValues);
        let names = getArgsNames(propertyNames, returnValues.__length__);
        let values = getArgsValues(returnValues);
        let eventName = event.event;
        events.push({
          eventName: eventName,
          argsNames: names,
          argsValues: values,
        });
      }
    }

    res.status(200).json({ events: events });

    //and we can subscribe to 1 event->
    // deployedContract.events
    //   .TestOracle({ fromBlock: 0 })
    //   .on("data", (event) => console.log(event));
    // later, if you want to stop listening to events, you can unsubscribe
    // eventSubscription.unsubscribe();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};
const getArgsNames = (args, index) => {
  let names = [];
  for (let i = index + 1; i < index * 2 + 1; i++) {
    names.push(args[i]);
  }
  return names;
};
const getArgsValues = (args) => {
  let values = [];
  for (let i = 0; i < args.__length__; i++) {
    values.push(args[i]);
  }
  return values;
};
const verifySteps = async (req, res) => {
  const { contractID, stepsNo, oracleAddress, stake } = req.body;
  try {
    const { abi, contractAddress } = await getContractByID(contractID);
    const deployedContract = new web3.eth.Contract(abi, contractAddress);
    for (const no of stepsNo) {
      let result = await deployedContract.methods
        .stepCompleted(parseInt(no))
        .send({
          from: oracleAddress,
          gas: 2000000,
        });
    }
    const oldValues = await getContractValuesByID(contractID);
    let contractName = oldValues.content[0].contractName;
    let values = oldValues.content[0].values;
    let newSteps = [];
    for (let i = 0; i < oldValues.content[0].steps.length; i++) {
      for (const no of stepsNo) {
        oldValues.content[0].steps[no].status = "VERIFIED";
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
    await awardOracle(oracleAddress, stake);
    await postToIPFS(jsonValues, "data.json", `values${contractID}`);
    res.status(200).json("Verified step");
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMsg: "Error verifying data", error: error });
  }
};

const updateVerificationStatus = async (req, res) => {
  const { id, updatedMetadata, type } = req.body;
  try {
    const hash = await getHash(`${type}${id}`);
    const data = {
      ipfsPinHash: hash,
      keyvalues: updatedMetadata,
    };
    await axios.put(`https://api.pinata.cloud/pinning/hashMetadata`, data, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    res.status(200).json("DONE");
  } catch (error) {
    console.error("Error updating metadata:", error);
    res.status(500).json("ERROR");
  }
};

const getOracleByEthAddress = async (req, res) => {
  const { ethAddress } = req.params;
  try {
    let oracle = await getOracleIDByAddress(ethAddress);
    let currOracle = oracle.content[0];

    let finalResponse = {
      id: parseInt(oracle.id),
      username: currOracle.username,
      email: currOracle.email,
      ethAddress: currOracle.ethAddress,
      fullName: currOracle.fullName,
      scope: currOracle.scope,
      stake: currOracle.stake,
      identityPhotosHash: currOracle.identityPhotosHash,
      password: currOracle.password,
      role: "oracle",
    };
    res.status(200).json({ currOracle: finalResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error getting oracle info",
      error: error,
    });
  }
};
const getOracleIDByAddress = async (ethAddress) => {
  try {
    const oracleState = await getAllFilesFromIPFS("oracle");
    const currOracle = query(oracleState, ethAddressQuery(ethAddress));
    if (currOracle[0]) {
      return currOracle[0];
    } else {
      return {};
    }
  } catch (error) {}
};

module.exports = {
  updateVerificationStatus,
  listenToEvents,
  getIdentityUser,
  registerOracle,
  verifySteps,
  login,
  getOracleByID,
  getOracleByEthAddress,
};
