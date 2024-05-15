const multer = require("multer");
const upload = multer();
const { serializeDatabase } = require("./DatabaseController");
const { addNode, Node } = require("../model/Node");
const config = require("../config");
const jwt = require("jsonwebtoken");
const {
  getHash,
  checkFilesLength,
  postToIPFS,
  getAllFilesFromIPFS,
  uploadPhotosToIPFS,
  getFileByHash,
  getHashArray,
  getAllPhotosFromIPFS,
} = require("./IPFSController");
const { encryptData, compareData } = require("../helpers/Encryption");
const { query, emailQuery } = require("../model/Query");

const registerBuyer = async (req, res) => {
  let userID;
  let prevHash;
  let node;
  let name;
  const content = req.body;
  const registerState = new Map();
  try {
    const hashedPassword = await encryptData(content[0].password);

    content[0].password = hashedPassword;
    const numOfUsers = await checkFilesLength("buyer");

    userID = numOfUsers + 1; // Increment to get the next available user and to start with 1....
    name = `buyer${userID}`;
    if (numOfUsers === 0) {
      node = new Node(1, "buyer", name, null, content);
    } else {
      prevHash = await getHash(`buyer${numOfUsers}`);
      if (prevHash == []) {
        res
          .status(500)
          .json({ errorMsg: "Unexpected error while getting previous hashes" });
      }
      node = new Node(userID, "buyer", name, prevHash, content);
    }
    let registerNode = addNode(registerState, node);
    const json = serializeDatabase(registerNode);
    const hash = await postToIPFS(json, "data.json", name);
    res.status(200).json({ ipfsHash: hash });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error while registering as a buyer",
      error: error,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const allBuyers = await getAllFilesFromIPFS("buyer");
    if (allBuyers === 0) {
      res.status(200).json("Failed");
    } else {
      const validEmail = query(allBuyers, emailQuery(email));
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
      errorMsg: "Error logging as a buyer",
      error: error,
    });
  }
};

const getBuyerByID = async (req, res) => {
  const { buyerID } = req.params;
  try {
    const buyerHash = await getHash(`buyer${buyerID}`);
    const buyer = await getFileByHash(buyerHash);
    let currBuyer = buyer.get(parseInt(buyerID)).content[0];
    let finalResponse = {
      id: parseInt(buyerID),
      username: currBuyer.username,
      email: currBuyer.email,
      ethAddress: currBuyer.ethAddress,
      identityPhotosHash: currBuyer.identityPhotosHash,
      fullName: currBuyer.fullName,
      password: currBuyer.password,
      role: "buyer",
    };
    res.status(200).json({ currBuyer: finalResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error getting buyer info",
      error: error,
    });
  }
};
const getAllBuyers = async (req, res) => {
  try {
    const data = await getAllFilesFromIPFS("buyer");
    if (data === 0) {
      res.status(200).json([]);
    } else {
      const usersArray = Array.from(data).reverse();
      res.status(200).json(usersArray); //2d array to access it-> usersArray[0][1].name for ex, gets first element
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};

const getAllIdentites = async (req, res) => {
  try {
    const data = await getHashArray("identity");
    if (data === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json({ identities: data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};
const uploadIdentityPhotos = async (req, res) => {
  const photo = req.file.buffer;
  const username = req.body.username;
  try {
    const hash = await uploadPhotosToIPFS(photo, username, "identity");
    res.status(200).json({ ipfsHash: hash });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};

const checkIdentityVerification = async (req, res) => {
  const { username } = req.body;
  try {
    const allIdentities = await getAllPhotosFromIPFS(`${username}identity`);
    for (const identityFile of allIdentities) {
      if (identityFile.metadata.keyvalues === null) {
        res.status(200).json({ verified: false });
      }
    }
    res.status(200).json({ verified: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};

const getContractBySellerID = async (req, res) => {
  const { sellerID } = req.body;
  try {
    const data = await getAllFilesFromIPFS("contract");
    if (data === 0) {
      res.status(200).json([]);
    } else {
    }
  } catch (error) {
    res.status(500).json({ errorMsg: "Error fetching contract", error: error });
  }
};

module.exports = {
  registerBuyer,
  getAllBuyers,
  upload,
  login,
  uploadIdentityPhotos,
  getBuyerByID,
  getAllIdentites,
  checkIdentityVerification,
};
