const express = require("express");
const {
  addStep,
  verifyHash,
  loadContract,
  addBuyer,
} = require("../controller/ContractController");
const router = express.Router();

router.post("/addstep", addStep);
router.post("/addbuyer", addBuyer);

router.post("/verify", verifyHash);
router.get("/loadcontract/:sellerID", loadContract);

module.exports = router;
