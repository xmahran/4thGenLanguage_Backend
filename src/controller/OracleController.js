require("dotenv").config();
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const { Web3 } = require("web3");
const { contractABI, contractAddress, bytecode, JWT } = require("../constants");
const web3 = new Web3(INFURA_API_KEY);
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("../config");
const {
  getHash,
  checkFilesLength,
  postToIPFS,
  getAllFilesFromIPFS,
} = require("./IPFSController");
const { encryptData, compareData } = require("../helpers/Encryption");
const { addNode, Node } = require("../model/Node");
const { serializeDatabase } = require("./DatabaseController");
const { query, emailQuery } = require("../model/Query");

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
      node = new Node(userID, "oracle", name, prevHash, content);
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
const listenToEvents = async (req, res) => {
  try {
    const deployedContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
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

const updateVerificationStatus = async (req, res) => {
  const { hash, updatedMetadata } = req.body;
  try {
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

module.exports = {
  updateVerificationStatus,
  listenToEvents,
  registerOracle,
  login,
};
