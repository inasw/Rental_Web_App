const express = require("express");
const router = express.Router();
const {
  submitReport,
  getAllReportsForHouse,
 
} = require("../controllers/reportController");

router.post("/", submitReport);
router.get("/:houseId", getAllReportsForHouse);

module.exports = router;
