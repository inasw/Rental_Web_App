const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");
const houseValidationMiddleware = require("../middleware/houseMiddleware");

// Create a new house
router.post("/createhouses", houseController.createHouse);

// Get all houses
router.get("/houses", houseController.getAllHouses);

// Get a single house by ID
router.get("/houses/:id", houseController.getHouseById);

router.put(
  "/with/:id",
  houseValidationMiddleware,
  houseController.updateHouseWithPhotos
);
router.put(
  "/without/:id",
  houseValidationMiddleware,
  houseController.updateHouseWithPhotos
);

// Delete a house
router.delete("/houses/:id", houseController.deleteHouse);

// Search houses by location
router.get("/houses/search", houseController.searchHouses);

module.exports = router;
