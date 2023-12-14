const mongoose = require("mongoose");
const Restaurant = require("../model/Restaurant");
const User = require("../model/User");
const Staff = require("../model/Staff");

const createRestaurant = async (req, res) => {
  const { restaurantName, restaurantDescription } = req.body;
  try {
    const newRestaurant = await Restaurant.create({
      restaurantName: restaurantName,
      restaurantDescription: restaurantDescription,
      restaurantTable: [],
      chatbotSequence: [],
    });
    res.status(200).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const setStaffRestaurant = async (req, res) => {
  const { userId, restaurantId } = req.body;
  try {
    const newStaff = await Staff.create({
      userId: userId,
      restaurantId: restaurantId,
    });
    res.status(200).json(newStaff);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const getRestaurant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Staff.findOne({ userId: id });
  if (!json) {
    return res.status(500).json({ mssg: "error" });
  }
  return res.status(200).json(json);
};

const getRestaurantWithRestaurantId = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("error");
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Restaurant.findOne({ _id: id });
  if (!json) {
    console.log("nothing");
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const addTableToRestaurant = async (req, res) => {
  const { id } = req.params;
  const { tableName, tableQuantity, tableStatus } = req.body;
  const newTableObject = {
    tableName,
    tableQuantity,
    tableStatus,
  };
  console.log("new table object " + newTableObject);
  try {
    // Find the restaurant by ID and update the restaurantTable array
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      { $push: { restaurantTable: newTableObject } },
      { new: true } // Return the updated document
    );

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error adding table to restaurant:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateTable = async (req, res) => {
  const { id } = req.params;
  const { tableName, tableQuantity, tableStatus } = req.body;
  const updatedTable = {
    tableName,
    tableQuantity,
    tableStatus,
  };
  console.log("restaurant Id" + id);
  console.log("table name" + tableName);
  console.log("table Quantity" + tableQuantity);
  console.log("table Status" + tableStatus);

  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      {
        _id: id,
        "restaurantTable.tableName": tableName,
      },
      {
        $set: {
          "restaurantTable.$": updatedTable,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      console.log("Restaurant or table not found");
      return res.status(500).json({ mssg: "error" });
    }

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating table:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const removeTable = async (req, res) => {
  const { id } = req.params;
  const { tableName } = req.body;
  console.log("id: " + id);
  console.log("table Name: " + tableName);
  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      { $pull: { restaurantTable: { tableName: tableName } } },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      console.log("Restaurant not found");
      return res.status(500).json({ mssg: "Restaurant not found" });
    }

    console.log("Table removed successfully");
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error removing table:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

module.exports = {
  createRestaurant,
  setStaffRestaurant,
  getRestaurant,
  getRestaurantWithRestaurantId,
  addTableToRestaurant,
  updateTable,
  removeTable,
};
