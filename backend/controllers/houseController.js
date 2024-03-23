// house.controller.js
const House = require("../model/houseModel");
const Joi = require("joi");

// Create a new house
const createHouse = async (req, res) => {
  try {
    const {
      user,
      location,
      type,
      category,
      price,
      description,
      availability,
      photos,
      rating,
    } = req.body;

    // Create a new house record
    const house = new House({
      user,
      location,
      type,
      category,
      price,
      description,
      availability,
      photos,
      rating,
    });

    // Save the house record to the database
    await house.save();

    res.status(201).json({ message: "House created successfully", house });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all houses
const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();
    res.json({ houses });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single house by ID
const getHouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await House.findById(id);
    // Check the houseId value
    console.log(id);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    res.json({ house });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a house
const updateHouseWithPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user,
      location,
      type,
      category,
      price,
      description,
      availability,
      photos,
      rating,
    } = req.body;

    // Find the house by ID and update its details
    const house = await House.findByIdAndUpdate(
      id,
      {
        user,
        location,
        type,
        category,
        price,
        description,
        availability,
        photos,
        rating,
      },
      { new: true }
    );

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    res.json({ message: "House updated successfully", house });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateHouseWithoutPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user,
      location,
      type,
      category,
      price,
      description,
      availability,
      rating,
    } = req.body;

    // Find the house by ID and update its details
    const house = await House.findByIdAndUpdate(
      id,
      {
        user,
        location,
        type,
        category,
        price,
        description,
        availability,
        rating,
      },
      { new: true }
    );

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    res.json({ message: "House updated successfully", house });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a house
const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await House.findByIdAndDelete(id);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }
    res.json({ message: "House deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search houses by location
const searchHouses = async (req, res) => {
  try {
    const { location } = req.query;
    const houses = await House.find({ location });
    res.json({ houses });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createHouse,
  getAllHouses,
  getHouseById,
  updateHouseWithoutPhotos,
  updateHouseWithPhotos,
  deleteHouse,
  searchHouses,
};
