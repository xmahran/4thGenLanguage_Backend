const express = require("express");
const {
  updateVerificationStatus,
  listenToEvents,
  login,
  registerOracle,
  getOracleByID,
  getIdentityUser,
  verifySteps,
  getOracleByEthAddress,
} = require("../controller/OracleController");

const router = express.Router();

router.put("/updatestatus", updateVerificationStatus);
router.get("/listen/:contractID", listenToEvents);
router.get("/getoracle/:oracleID", getOracleByID);
router.get("/getoraclebyeth/:ethAddress", getOracleByEthAddress);
router.get("/getidentity/:username", getIdentityUser);
router.post("/verifysteps", verifySteps);
router.post("/login", login);
router.post("/register", registerOracle);

module.exports = router;
