const mongoose = require("mongoose");
const Restaurant = require("../model/Restaurant");
const User = require("../model/User");
const Staff = require("../model/Staff");
const Book = require("../model/Booking");
const Customer = require("../model/Customer");
const RestaurantImage = require("../model/RestaurantImage");

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
  const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
  var malaysiaTime = new Date(
    new Date(BookedTime).getTime() + malaysiaTimeOffset
  );
  try {
    const newBooking = await Book.create({
      userId: userId,
      restaurantId: restaurantId,
      quantity: quantity,
      status: status,
      tableName: tableName,
      BookedTime: malaysiaTime,
    });
    res.status(200).json(newBooking);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const getBookingForRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(500).json({ mssg: "error" });
  }
  const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
  var currentDate = new Date();
  currentDate = new Date(currentDate.getTime() + malaysiaTimeOffset);
  currentDate.setUTCHours(0, 0, 0, 0);
  var endOfDay = new Date(currentDate);
  endOfDay.setUTCHours(23, 59, 59, 999);
  console.log("begin time: " + currentDate);
  console.log("end time: " + endOfDay);
  const result = await Book.find({
    restaurantId: restaurantId,
    status: { $in: ["Pending", "Book"] },
    BookedTime: {
      $gte: currentDate,
      $lte: endOfDay,
    },
  }).sort({ BookedTime: 1 });

  if (!result) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(result);
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

    console.log("Updated Booking Checking:", updatedBooking);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating Booking:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateTable = async (req, res) => {
  const { id } = req.params;
  const { tableName, tableQuantity, tableStatus, userId } = req.body;
  const updatedTable = {
    tableName,
    tableQuantity,
    tableStatus,
    userId,
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

const getACustomer = async (req, res) => {
  const { restaurantId, userId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(restaurantId)
  ) {
    return res.status(500).json({ mssg: "error" });
  }

  try {
    const json = await Customer.findOne({
      userId: userId,
      restaurantId: restaurantId,
    });

    if (!json) {
      return res.status(500).json({ mssg: "Customer not found" });
    }

    res.status(200).json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mssg: "Internal Server Error" });
  }
};

const createNewCustomer = async (req, res) => {
  const { userId, restaurantId } = req.body;
  try {
    const newCustomer = await Customer.create({
      userId: userId,
      restaurantId: restaurantId,
      userPoints: 0,
      userVouchers: [],
    });
    res.status(200).json(newCustomer);
  } catch (err) {
    console.log("error is here");
    res.status(500).json({ mssg: err });
  }
};

const addVoucherToCustomer = async (req, res) => {
  const {
    voucherId,
    voucherExpiration,
    voucherStatus,
    userId,
    restaurantId,
    userPoints,
  } = req.body;
  const newVoucherObject = {
    voucherId: voucherId,
    voucherExpiration: voucherExpiration,
    voucherStatus: voucherStatus,
  };
  try {
    const updatedVoucher = await Customer.findOneAndUpdate(
      { userId: userId, restaurantId: restaurantId },
      {
        $set: { userPoints: userPoints },
        $push: { userVouchers: newVoucherObject },
      },
      { new: true } // Return the updated document
    );
    console.log("added voucher for customer" + updatedVoucher);
    return res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error("Error adding voucher to user:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateCustomerVoucher = async (req, res) => {
  const { restaurantId, userId, voucherStatus, voucherId } = req.body;
  try {
    const updatedVoucher = await Customer.findOneAndUpdate(
      {
        userId: userId,
        restaurantId: restaurantId,
        "userVouchers._id": voucherId,
      },
      {
        $set: { "userVouchers.$.voucherStatus": voucherStatus },
      },
      { new: true } // Return the updated document
    );
    console.log("added voucher for customer" + updatedVoucher);
    return res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error("Error adding voucher to user:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateCustomerPoints = async (req, res) => {
  const { userId, restaurantId, userPoints } = req.body;
  try {
    const newPoints = await Customer.findOneAndUpdate(
      {
        userId: userId,
        restaurantId: restaurantId,
      },
      { $inc: { userPoints: userPoints } },
      { new: true } // Return the modified document
    );
    res.status(200).json(newPoints);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ mssg: "Internal Server Error" });
  }
};

const getRestaurantMenu = async (req, res) => {
  const { restaurantId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await RestaurantImage.find({
    restaurantId: restaurantId,
    stringType: "menu",
  });
  if (!json) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const updateBookingQuantity = async (req, res) => {
  const { id } = req.params;
  const { newTableQuantity } = req.body;
  try {
    const updatedBooking = await Book.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { quantity: newTableQuantity },
      },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      console.log("Booking not updated");
      return res.status(500).json({ mssg: "error" });
    }
    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating Booking:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const checkAllRestaurantSeats = async (req, res) => {
  const { userId } = req.params;
  try {
    const restaurant = await Restaurant.findOne({
      restaurantTable: {
        $elemMatch: { userId: userId },
      },
    });

    if (!restaurant) {
      return res.status(404).json({ mssg: "Seat not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error getting Seat:", error);
    res.status(500).json({ mssg: "error" });
  }
};

const getBookingForUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const result = await Book.find({
    userId: id,
    status: "Book",
  }).sort({ BookedTime: 1 });

  if (!result) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(result);
};

module.exports = {
  getRestaurants,
  getARestaurant,
  createNewBooking,
  updateNewBooking,
  getBooking,
  getBookingForRestaurant,
  updateTable,
  getACustomer,
  createNewCustomer,
  addVoucherToCustomer,
  updateCustomerVoucher,
  updateCustomerPoints,
  getRestaurantMenu,
  updateBookingQuantity,
  checkAllRestaurantSeats,
  getBookingForUser,
};
