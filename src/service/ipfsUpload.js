const multer = require("multer");
const upload = multer();
const FormData = require("form-data");
const HDWalletProvider = require("@truffle/hdwallet-provider"); //for depolying it
const MNEMONIC =
  "access race say lottery denial afford beauty smooth reunion frequent cushion endorse"; // it generates many accounts not only my account
const INFRA_API_KEY =
  "https://sepolia.infura.io/v3/5581b1757aa8490e877b92ddf8a1b66b";
provider = new HDWalletProvider(MNEMONIC, INFRA_API_KEY);
const { Web3 } = require("web3");
const { contractABI, contractAddress, bytecode, JWT } = require("../constants");
const web3 = new Web3(provider);
const axios = require("axios");

const uploadImageToIpfs = async (req, res) => {
  try {
    const imageFile = req.file.buffer;
    const formData = new FormData();

    formData.append("file", imageFile, { filename: req.file.originalname });

    const pinataMetadata = JSON.stringify({
      name: req.file.originalname,
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    const data = await response.data;
    res.status(200).json({ ipfsHash: data.IpfsHash });
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    res.status(500).json({ error: "Failed to upload image to IPFS" });
  }
};
//deployment
// const verifyHash = async (req, res) => {
//   try {
//     const { hash } = req.body;
//     const deployedContract = await new web3.eth.Contract(contractABI)
//       .deploy({
//         data: bytecode,
//         arguments: [
//           "testC",
//           "type",
//           [
//             "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173",
//             "government_social_card",
//             "https://ipfs.io/ipfs/QmWX8H2mgTTt6ufvausCNmeUdpuE3FM6hpx1hNLkVqcJ1y?filename=identity.png",
//             "",
//             "0xb1be0fc64a5eb38b939dc7041475ea774b2c0173",
//             "QmWX8H2mgTTt6ufvausCNmeUdpuE3FM6hpx1hNLkVqcJ1y",
//           ],
//         ],
//       })
//       .send({
//         gas: "3000000",
//         from: "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173",
//       });
//     let oldHash = await deployedContract.methods.buyer().call();

//     console.log("old: ", oldHash.identityProofImgHash);
//     await deployedContracty.methods
//       .uploadBuyerIdentity(hash)
//       .send({ from: "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173" });
//     let newHash = await deployedContract.methods.buyer().call();

//     console.log("new: ", newHash.identityProofImgHash);
//   } catch (error) {
//     console.log("error", error);
//   }
// };
const verifyHash = async (req, res) => {
  try {
    const { hash } = req.body;
    const deployedContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    let oldHash = await deployedContract.methods.buyer().call();

    console.log("old: ", oldHash.identityProofImgHash);
    await deployedContract.methods
      .uploadBuyerIdentity(hash)
      .send({ from: "0xB1Be0fC64A5eB38B939dC7041475Ea774b2c0173" }); //my account address , can be replaced by buyer/seller address
    let newHash = await deployedContract.methods.buyer().call();

    console.log("new: ", newHash.identityProofImgHash);
    res.status(200).json("Verified");
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { upload, uploadImageToIpfs, verifyHash };
