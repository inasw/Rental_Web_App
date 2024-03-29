const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");
// const houseValidationMiddleware = require("../middleware/houseMiddleware");
const { protect, restrict } = require("../middleware/authMiddleware");
const { uploadFileMiddleware } = require("../middleware/multer");
// Create a new house
router.post(
  "/createhouses",
  protect,
  uploadFileMiddleware,
  houseController.createHouse
);

// Get all houses
router.get("/houses", houseController.getAllHouses);

// Get a single house by ID
router.get("/houses/:id", houseController.getHouseById);

router.patch(
  "/with/:id",
  protect,
  uploadFileMiddleware,

  houseController.updateHouseWithPhotos
);

// Delete a house
router.delete("/houses/:id", protect, houseController.deleteHouse);

// Search houses by location
router.get("/housess", houseController.searchHouses);

module.exports = router;
