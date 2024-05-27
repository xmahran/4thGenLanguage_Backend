const { Node, addNode } = require("../model/Node");
const { writeContract } = require("../service/ContractFileWriter");
const { deploy } = require("../service/EthDeployer");
const { generateSolidity } = require("../service/SolidityCodeGenerator");
const { compile } = require("../service/SolidityCompiler");
const { serializeDatabase } = require("./DatabaseController");
const { checkFilesLength, getHash, postToIPFS } = require("./IPFSController");
const { Web3 } = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
const INFURA_API_KEY = process.env.INFURA_API_KEY;
provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);
const web3 = new Web3(provider);

const createContract = async (req, res) => {
  const { values, username, steps, sellerID, itemID } = req.body;
  const contractState = new Map();

  try {
    let code = generateSolidity();
    writeContract(code, `${username}contract`);
    const { abi, bytecode } = compile(`${username}contract.sol`);
    let contractAddress = await deploy(abi, bytecode, username, steps, values);
    //post to IPFS
    const numOfContracts = await checkFilesLength("contract");
    let prevHash;
    let node;
    let contractID = numOfContracts + 1;
    let contractName = `${username}contract${contractID}`;
    if (numOfContracts === 0) {
      node = new Node(1, "contract", contractName, null, [
        {
          sellerID: sellerID,
          contractAddress: contractAddress,
          abi: abi,
          itemID: itemID,
          bytecode: bytecode,
        },
      ]);
    } else {
      prevHash = await getHash(`contract${numOfContracts}`);
      node = new Node(contractID, "contract", contractName, null, [
        {
          contractAddress: contractAddress,
          abi: abi,
          bytecode: bytecode,
          itemID: itemID,
          sellerID: sellerID,
        },
      ]);
    }
    let contractNode = addNode(contractState, node);
    const json = serializeDatabase(contractNode);

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
    const hash = await postToIPFS(json, "data.json", `contract${contractID}`);
    res.status(200).json({ hash: hash });
  } catch (error) {
    res.status(500).json({
      errorMsg: "Error while creating a contract",
      error: error,
    });
    console.log(error);
  }
};

const awardOracle = async (oracleAddress, price) => {
  try {
    const tx = {
      from: "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173",
      to: oracleAddress,
      value: web3.utils.toWei(price.toString(), "ether"),
      gas: 21000,
    };

    const receipt = await web3.eth.sendTransaction(tx);
    return "sent";
  } catch (error) {}
};

module.exports = { createContract, awardOracle };
