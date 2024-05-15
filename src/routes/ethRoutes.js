const express = require("express");
const { createContract } = require("../controller/EthController");
const router = express.Router();

router.post("/createcontract", createContract);

module.exports = router;
