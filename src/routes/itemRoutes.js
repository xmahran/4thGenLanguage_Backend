const express = require("express");
const {
  postItem,
  upload,
  getSellerItems,
  getAllItems,
  checkItemVerification,
  getAllItemsOracle,
  getItemByID,
} = require("../controller/ItemController");

const router = express.Router();

router.post("/additem", upload.array("file"), postItem);
router.get("/selleritems/:sellerID", getSellerItems);
router.get("/item/:itemID", getItemByID);

router.get("/items", getAllItems);
router.get("/itemsfororacle", getAllItemsOracle);
router.get("/checkcontract/:itemID", checkItemVerification);
router.get("/items", checkItemVerification);
router.get("/checkitemverification", checkItemVerification);

module.exports = router;
