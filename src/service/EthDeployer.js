const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");

const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
const provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);

const web3 = new Web3(provider);

const deploy = async (contractABI, bytecode, username, steps, values) => {
  console.log(
    "Attempting to deploy from account",
    "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173"
  );
  const seller = {
    ethAddress: values.sellerEthereumAddress,
    identityProofType: values.sellerIdentityType,
    identityProofImg: values.sellerIdentityProofAddress,
    identityProofImgHash: values.sellerImageHash,
    identityProofOracle: values.sellerAddressOracle,
    identityProofOracleHash: values.sellerHashOracle,
    verified: false,
  };

  const item = {
    itemProofImg: values.itemAddress,
    itemProofImgHash: values.itemHash,
    imgOracle: values.itemAddressOracle,
    imgOracleHash: values.itemHashOracle,
    verified: false,
  };

  const contractName = `${username}Contract`;
  const contractType = `${values.contractType}`;
  const amount = parseInt(values.price);
  const transferDate = values.transferDate;
  const penalty = parseInt(values.penalty);

  const result = await new web3.eth.Contract(contractABI)
    .deploy({
      data: bytecode,
      arguments: [
        contractName,
        contractType,
        seller,
        item,
        steps,
        amount,
        transferDate,
        penalty,
      ],
    })
    .send({
      from: "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173",
      gas: "3000000",
    });

  let contractAddress = result.options.address;
  console.log("Contract deployed to", result.options.address); //trace it in CURR_NETWORK.etherscan.io
  provider.engine.stop();
  return contractAddress;
};

module.exports = { deploy };
