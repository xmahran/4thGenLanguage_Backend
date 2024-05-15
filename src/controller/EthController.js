const { Node, addNode } = require("../model/Node");
const { writeContract } = require("../service/ContractFileWriter");
const { deploy } = require("../service/EthDeployer");
const { generateSolidity } = require("../service/SolidityCodeGenerator");
const { compile } = require("../service/SolidityCompiler");
const { serializeDatabase } = require("./DatabaseController");
const { checkFilesLength, getHash, postToIPFS } = require("./IPFSController");

const createContract = async (req, res) => {
  const { values, username, steps, sellerID } = req.body;
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
    res.status(200).json({ hash: "test" });
  } catch (error) {
    res.status(500).json({
      errorMsg: "Error while creating a contract",
      error: error,
    });
    console.log(error);
  }
};

module.exports = { createContract };
