const express = require("express");
const {
  updateVerificationStatus,
  listenToEvents,
  login,
  registerOracle,
} = require("../controller/OracleController");

const router = express.Router();

router.put("/updatestatus", updateVerificationStatus);
router.get("/listen", listenToEvents);
router.post("/login", login);
router.post("/register", registerOracle);

module.exports = router;
