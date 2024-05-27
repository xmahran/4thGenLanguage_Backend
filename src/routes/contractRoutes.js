const express = require("express");
const {
  verifyHash,
  loadContract,
  addBuyer,
  getAllContracts,
  completeSteps,
  getEthAddress,
} = require("../controller/ContractController");
const router = express.Router();

router.post("/addbuyer", addBuyer);
router.post("/completesteps", completeSteps);

router.post("/verify", verifyHash);
router.get("/loadcontract/:sellerID", loadContract);
router.get("/getethaddress/:contractID", getEthAddress);

router.get("/getcontracts", getAllContracts);

module.exports = router;
