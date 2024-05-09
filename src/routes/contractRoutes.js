const express = require("express");
const { addStep, verifyHash } = require("../controller/ContractController");
const router = express.Router();

router.post("/addstep", addStep);
router.post("/verify", verifyHash);

module.exports = router;
