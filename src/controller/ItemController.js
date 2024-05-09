const multer = require("multer");
const upload = multer();
const { serializeDatabase } = require("./DatabaseController");
const {
  uploadPhotosToIPFS,
  getHash,
  getFileByHash,
  checkFilesLength,
  postToIPFS,
  getAllFilesFromIPFS,
  getAllPhotosFromIPFS,
  checkFileVerification,
} = require("./IPFSController");
const { Node, addNode } = require("../model/Node");

const postItem = async (req, res) => {
  let name;
  let itemID;
  let prevHash;
  let node;
  const { sellerID, itemName, itemDescription, itemPrice, itemImgHash } =
    req.body;
  const itemState = new Map();
  const photo = req.file.buffer;
  let content = [
    {
      sellerID: sellerID,
      itemName: itemName,
      itemDescription: itemDescription,
      itemPrice: itemPrice,
      itemImgHash: itemImgHash,
    },
  ];

  try {
    const numOfItems = await checkFilesLength("item");
    const itemSellerHash = await getHash(`seller${sellerID}`);
    const itemSellerNode = await getFileByHash(itemSellerHash);

    let itemSellerName = itemSellerNode.get(parseInt(sellerID)).content[0]
      .username;
    let itemImgHash = await uploadPhotosToIPFS(
      photo,
      itemSellerName,
      "product"
    );

    content[0].itemImgHash = itemImgHash;

    itemID = numOfItems + 1;
    name = `item${itemID}`;

    if (numOfItems === 0) {
      node = new Node(1, "item", name, null, content);
    } else {
      prevHash = await getHash(`item${numOfItems}`);
      node = new Node(itemID, "item", name, prevHash, content);
    }
    let itemNode = addNode(itemState, node);

    const json = serializeDatabase(itemNode);
    const hash = await postToIPFS(json, "data.json", name);

    res.status(200).json({
      hash: hash,
      item: {
        id: numOfItems === 0 ? 1 : itemID,
        sellerID: sellerID,
        itemName: content[0].itemName,
        itemDescription: content[0].itemDescription,
        itemPrice: content[0].itemPrice,
        itemImgHash: content[0].itemImgHash,
      },
    });
  } catch (error) {
    console.error(error.response.data);
    return res.status(500).json({
      errorMsg: "Error while adding an item",
      error: error.response.data,
    });
  }
};

const getSellerItems = async (req, res) => {
  const { sellerID } = req.params;
  try {
    let currSellerItems = [];
    const data = await getAllFilesFromIPFS(`item`);
    if (data === 0) {
      res.status(200).json({ currSellerItems: [] });
    } else {
      data.forEach((value) => {
        if (value.content[0].sellerID === sellerID) {
          currSellerItems.push(value);
        }
      });
      res.status(200).json({ currSellerItems });
    }
  } catch (error) {
    console.log(error.response.data);
    res
      .status(500)
      .json({ errorMsg: "Error fetching data", error: error.response.data });
  }
};
const getAllItems = async (req, res) => {
  try {
    const itemsState = await getAllFilesFromIPFS("item");
    if (itemsState === 0) {
      res.status(200).json([]);
    } else {
      const itemsArray2D = Array.from(itemsState).reverse();
      const itemsArray = itemsArray2D.map((item) => item[1]);

      res.status(200).json({ items: itemsArray });
    }
  } catch {
    console.log(error.response.data);
    res
      .status(500)
      .json({ errorMsg: "Error fetching data", error: error.response.data });
  }
};
const getAllItemsOracle = async (req, res) => {
  try {
    const itemsState = await getAllFilesFromIPFS("item");
    if (itemsState === 0) {
      res.status(200).json([]);
    } else {
      const itemsArray2D = Array.from(itemsState).reverse();
      const itemsArray = itemsArray2D.map((item) => item[1]);
      let finalItemsArray = [];
      for (const item of itemsArray) {
        const bool = await checkFileVerification(item.content[0].itemImgHash);
        if (!bool) {
          finalItemsArray.push(item);
        }
      }
      res.status(200).json({ items: finalItemsArray });
    }
  } catch {
    console.log(error.response.data);
    res
      .status(500)
      .json({ errorMsg: "Error fetching data", error: error.response.data });
  }
};

const checkItemVerification = async (req, res) => {
  const { username } = req.body;
  try {
    const allIdentities = await getAllPhotosFromIPFS(`${username}product`);
    for (const identityFile of allIdentities) {
      if (identityFile.metadata.keyvalues === null) {
        res.status(200).json({ verified: false });
      }
    }
    res.status(200).json({ verified: true });
  } catch (error) {
    console.log(error.response.data);
    res
      .status(500)
      .json({ errorMsg: "Error fetching data", error: error.response.data });
  }
};

module.exports = {
  postItem,
  upload,
  getSellerItems,
  getAllItems,
  checkItemVerification,
  getAllItemsOracle,
};
