const express = require("express");
const {
  registerSeller,
  getAllSellers,
  upload,
  uploadIdentityPhotos,
  login,
  getSellerByID,
  getAllIdentites,
  checkIdentityVerification,
} = require("../controller/SellerController");

const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", login);
router.get("/getAllSellers", getAllSellers);
router.get("/getseller/:sellerID", getSellerByID);
router.get("/identities", getAllIdentites);
router.get("/checkverification", checkIdentityVerification);

router.post("/uploadIdentity", upload.single("file"), uploadIdentityPhotos);

module.exports = router;
