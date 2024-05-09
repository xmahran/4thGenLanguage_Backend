const express = require("express");
const {
  updateVerificationStatus,
  listenToEvents,
} = require("../controller/OracleController");

const router = express.Router();

router.put("/updatestatus", updateVerificationStatus);
router.get("/listen", listenToEvents);

module.exports = router;
