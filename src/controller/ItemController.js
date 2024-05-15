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
  const {
    sellerID,
    itemName,
    itemDescription,
    itemPrice,
    itemLocation,
    itemImgHash,
  } = req.body;
  const itemState = new Map();
  const photos = req.files.map((file) => file.buffer);
  let content = [
    {
      sellerID: sellerID,
      itemName: itemName,
      itemDescription: itemDescription,
      itemLocation: itemLocation,
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
    let itemPhotos = [];
    for (const photo of photos) {
      let itemImgHash = await uploadPhotosToIPFS(
        photo,
        itemSellerName,
        "product"
      );
      itemPhotos.push(itemImgHash);
    }

    content[0].itemImgHash = itemPhotos;

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
    console.error(error);
    return res.status(500).json({
      errorMsg: "Error while adding an item",
      error: error,
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
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};
const getItemByID = async (req, res) => {
  const { itemID } = req.params;
  try {
    const itemHash = await getHash(`item${itemID}`);
    const item = await getFileByHash(itemHash);
    let currItem = item.get(parseInt(itemID)).content[0];

    let finalResponse = {
      id: itemID,
      sellerID: currItem.sellerID,
      itemName: currItem.itemName,
      itemDescription: currItem.itemDescription,
      itemPrice: currItem.itemPrice,
      itemImgHash: currItem.itemImgHash,
      itemLocation: currItem.itemLocation,
    };
    res.status(200).json({ currItem: finalResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMsg: "Error getting item info",
      error: error,
    });
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
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
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
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
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
    console.log(error);
    res.status(500).json({ errorMsg: "Error fetching data", error: error });
  }
};

module.exports = {
  postItem,
  upload,
  getSellerItems,
  getAllItems,
  checkItemVerification,
  getAllItemsOracle,
  getItemByID,
};
