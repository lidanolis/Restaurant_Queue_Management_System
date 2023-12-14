const mongoose = require("mongoose");
const Restaurant = require("../model/Restaurant");
const User = require("../model/User");
const Staff = require("../model/Staff");
const Book = require("../model/Booking");

const getRestaurants = async (req, res) => {
  const resultList = await Restaurant.find({}).sort({ restaurantName: 1 });
  res.status(200).json(resultList);
};

const getARestaurant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Restaurant.findOne({ _id: id });
  if (!json) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const createNewBooking = async (req, res) => {
  const { userId, restaurantId, quantity, status, tableName, BookedTime } =
    req.body;
  try {
    const newBooking = await Book.create({
      userId: userId,
      restaurantId: restaurantId,
      quantity: quantity,
      status: status,
      tableName: tableName,
      BookedTime: BookedTime,
    });
    res.status(200).json(newBooking);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const getBooking = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Book.findOne({ _id: id });
  if (!json) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const updateNewBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBooking = await Book.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { ...req.body },
      },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      console.log("Booking not found");
      return res.status(500).json({ mssg: "error" });
    }

    console.log("Updated Booking:", updatedBooking);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating Booking:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

module.exports = {
  getRestaurants,
  getARestaurant,
  createNewBooking,
  updateNewBooking,
  getBooking,
};
