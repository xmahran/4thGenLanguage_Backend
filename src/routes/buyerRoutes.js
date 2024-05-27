const express = require("express");
const {
  registerBuyer,
  getAllBuyers,
  getBuyerByID,
  login,
  getAllIdentites,
  checkIdentityVerification,
  upload,
  uploadIdentityPhotos,
  checkValidation,
  addComplain,
  getAllComplains,
} = require("../controller/BuyerController");

const router = express.Router();

router.post("/register", registerBuyer);
router.post("/addcomplain", addComplain);

router.post("/login", login);
router.get("/getAllSellers", getAllBuyers);
router.get("/getbuyer/:buyerID", getBuyerByID);
router.get("/identities", getAllIdentites);
router.get("/checkverification", checkIdentityVerification);
router.get("/getcomplaints", getAllComplains);

router.get("/checkvalidity/:buyerID", checkValidation);

router.post("/uploadIdentity", upload.single("file"), uploadIdentityPhotos);

module.exports = router;
