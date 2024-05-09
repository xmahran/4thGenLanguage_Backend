const express = require("express");
const {
  postItem,
  upload,
  getSellerItems,
  getAllItems,
  checkItemVerification,
  getAllItemsOracle,
} = require("../controller/ItemController");

const router = express.Router();

router.post("/additem", upload.single("file"), postItem);
router.get("/selleritems/:sellerID", getSellerItems);
router.get("/items", getAllItems);
router.get("/itemsfororacle", getAllItemsOracle);

router.get("/items", checkItemVerification);
router.get("/checkitemverification", checkItemVerification);

module.exports = router;
