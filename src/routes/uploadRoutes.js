const express = require("express");
const {
  uploadImageToIpfs,
  upload,
  verifyHash,
} = require("../service/ipfsUpload");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadImageToIpfs);
router.post("/verify", verifyHash);

module.exports = router;
