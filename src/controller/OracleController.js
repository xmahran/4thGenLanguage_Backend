require("dotenv").config();
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const { Web3 } = require("web3");
const { contractABI, contractAddress, bytecode, JWT } = require("../constants");
const web3 = new Web3(INFURA_API_KEY);
const axios = require("axios");

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
    console.error("Error updating metadata:", error.response.data);
    res.status(500).json("ERROR");
  }
};

module.exports = { updateVerificationStatus, listenToEvents };
